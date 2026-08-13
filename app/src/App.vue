<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  watchEffect,
  type Component,
} from "vue";

import { provideDeckEngine } from "@hpe/renderer-vue";
import { provideSlideStateStore } from "@hpe/renderer-vue/slide-state";
import { provideTimeline } from "@hpe/renderer-vue/timeline";
import {
  bindBrowserControls,
  toggleFullscreen,
  type BrowserControls,
} from "@hpe/runtime-browser";
import type { BrowserBinding } from "@hpe/runtime-browser/keyboard";
import { createPresentationSync } from "@hpe/runtime-browser/presentation-sync";
import type { DeckSync } from "@hpe/runtime-browser/sync";
import { bindUrlState } from "@hpe/runtime-browser/url";
import type { DeckEngine, DeckEvent } from "@hpe/runtime-core";
import {
  enumerateSlideStateScenarios,
  type SlideStateStore,
  type SlideStateValues,
} from "@hpe/runtime-core/slide-state";
import type {
  TimelineController,
  TimelineDriver,
} from "@hpe/runtime-core/timeline";
import type { SlideSourceMap } from "@hpe/compiler";
import { manifest, slideLoaders, theme } from "virtual:hpe-deck";

const OverviewView = defineAsyncComponent(
  () => import("./components/OverviewView.vue"),
);
const PresentationAids = defineAsyncComponent(
  () => import("./components/PresentationAids.vue"),
);
const PrintView = defineAsyncComponent(
  () => import("./components/PrintView.vue"),
);
const SpeakerView = defineAsyncComponent(
  () => import("./components/SpeakerView.vue"),
);

interface AppProps {
  readonly engine: DeckEngine;
  readonly timeline: TimelineController;
  readonly timelineDriver: TimelineDriver;
  readonly slideState: SlideStateStore;
  readonly unbindTimeline: () => void;
}

interface DisplayedSlide {
  readonly id: string;
  readonly index: number;
  readonly component: Component;
}

interface BrowserInspectionPort {
  dispatch(event: DeckEvent): void;
  getState(): ReturnType<DeckEngine["getSnapshot"]>;
  getTimelineState(): ReturnType<TimelineController["getSnapshot"]>;
  seekTimeline(timeMs: number): void;
  getSlideState(): ReturnType<SlideStateStore["getSnapshot"]>;
  getSlideStateScenarios(): ReturnType<typeof enumerateSlideStateScenarios>;
  setSlideStateScenario(values: SlideStateValues): void;
  getSourceMap(): Promise<SlideSourceMap | undefined>;
  preparePrint(): Promise<void>;
}

const props = defineProps<AppProps>();
const { state } = provideDeckEngine(props.engine);
const timelineContext = provideTimeline(props.timeline);
provideSlideStateStore(props.slideState);
const slideLayers = shallowRef<
  readonly [DisplayedSlide | undefined, DisplayedSlide | undefined]
>([undefined, undefined]);
const activeSlideLayer = ref<0 | 1>(0);
const stagingSlideLayer = ref<0 | 1>();
const displayedSlideId = ref(state.value.slideId);
const displayedSlideIndex = ref(state.value.slideIndex);
const currentEntry = computed(() => manifest.slides[displayedSlideIndex.value]);
const timelinePlaying = computed(() => timelineContext.state.value.playing);
const scale = ref(1);
const slideLoading = ref(false);
const slideLoadError = ref<string>();
const overview = ref(false);
const printMode = ref(false);
const notesOpen = ref(false);
const spotlight = ref(false);
const pointerX = ref(0);
const pointerY = ref(0);
let controls: BrowserControls | undefined;
let urlBinding: BrowserBinding | undefined;
let sync: DeckSync | undefined;
let slideLoadSequence = 0;
const prefetchedSlides = new Set<string>();

function prefetchSlide(index: number): void {
  const entry = manifest.slides[index];
  if (!entry || prefetchedSlides.has(entry.id)) return;
  const loader = slideLoaders[entry.id];
  if (!loader) return;
  prefetchedSlides.add(entry.id);
  void loader().catch(() => {
    prefetchedSlides.delete(entry.id);
  });
}

function prefetchAdjacentSlides(index: number): void {
  prefetchSlide(index - 1);
  prefetchSlide(index + 1);
  prefetchSlide(index + 2);
}

function setSlideLayer(layer: 0 | 1, slide: DisplayedSlide): void {
  const next = [...slideLayers.value] as [
    DisplayedSlide | undefined,
    DisplayedSlide | undefined,
  ];
  next[layer] = slide;
  slideLayers.value = next;
}

async function waitForPaint(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function displaySlide(slideId: string): Promise<void> {
  const loader = slideLoaders[slideId];
  if (!loader) {
    slideLoadError.value = `Unknown slide module: ${slideId}`;
    return;
  }
  const sequence = ++slideLoadSequence;
  slideLoading.value = true;
  slideLoadError.value = undefined;
  try {
    const module = await loader();
    if (sequence !== slideLoadSequence) return;
    const index = manifest.slides.findIndex((entry) => entry.id === slideId);
    if (index < 0) throw new Error(`Unknown slide: ${slideId}`);
    const slide: DisplayedSlide = {
      id: slideId,
      index,
      component: markRaw(module.default),
    };
    const hasDisplayedSlide = slideLayers.value[activeSlideLayer.value];
    if (!hasDisplayedSlide) {
      setSlideLayer(activeSlideLayer.value, slide);
      displayedSlideId.value = slideId;
      displayedSlideIndex.value = index;
      await nextTick();
      prefetchAdjacentSlides(index);
      return;
    }

    const targetLayer: 0 | 1 = activeSlideLayer.value === 0 ? 1 : 0;
    setSlideLayer(targetLayer, slide);
    stagingSlideLayer.value = targetLayer;
    await nextTick();
    await waitForPaint();
    if (sequence !== slideLoadSequence) return;

    activeSlideLayer.value = targetLayer;
    stagingSlideLayer.value = undefined;
    displayedSlideId.value = slideId;
    displayedSlideIndex.value = index;
    await nextTick();
    prefetchAdjacentSlides(index);
  } catch (error) {
    if (sequence !== slideLoadSequence) return;
    slideLoadError.value =
      error instanceof Error ? error.message : String(error);
  } finally {
    if (sequence === slideLoadSequence) slideLoading.value = false;
  }
}

watch(
  () => state.value.slideId,
  (slideId) => {
    void displaySlide(slideId);
  },
  { immediate: true },
);

function resize(): void {
  scale.value = Math.min(
    window.innerWidth / manifest.size.width,
    window.innerHeight / manifest.size.height,
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  return (
    element?.isContentEditable === true ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(element?.tagName ?? "")
  );
}

function onApplicationKey(event: KeyboardEvent): void {
  if (
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    isInteractiveTarget(event.target)
  ) {
    return;
  }
  if (event.key === "Escape" && overview.value) {
    overview.value = false;
  } else if (event.key === "Escape" && notesOpen.value) {
    notesOpen.value = false;
  } else if (
    event.key.toLowerCase() === "o" &&
    state.value.mode !== "speaker"
  ) {
    overview.value = !overview.value;
  } else if (
    event.key.toLowerCase() === "s" &&
    state.value.mode !== "speaker"
  ) {
    openSpeakerView();
  } else if (event.key.toLowerCase() === "f") {
    void toggleFullscreen();
  } else if (event.key.toLowerCase() === "n") {
    notesOpen.value = !notesOpen.value;
  } else if (event.key.toLowerCase() === "h") {
    spotlight.value = !spotlight.value;
  } else if (event.key === "Home") {
    const first = manifest.slides[0];
    if (first) props.engine.dispatch({ type: "GOTO", slideId: first.id });
  } else if (event.key === "End") {
    const last = manifest.slides.at(-1);
    if (last) props.engine.dispatch({ type: "GOTO", slideId: last.id });
  }
}

function onPointerMove(event: PointerEvent): void {
  pointerX.value = event.clientX;
  pointerY.value = event.clientY;
}

function openSpeakerView(): void {
  const url = new URL(window.location.href);
  url.hash = new URLSearchParams({
    slide: state.value.slideId,
    step: String(state.value.step),
    mode: "speaker",
  }).toString();
  window.open(
    url,
    `${manifest.id}-speaker`,
    "popup,width=1440,height=900,noopener",
  );
}

async function preparePrint(): Promise<void> {
  printMode.value = true;
  await nextTick();
  const deadline = performance.now() + 15_000;
  while (
    document.querySelectorAll(".hpe-print-page [data-hpe-slide]").length <
    manifest.slides.length
  ) {
    if (performance.now() >= deadline) {
      throw new Error("Timed out while loading printable slide modules");
    }
    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => resolveFrame()),
    );
  }
}

async function printDeck(): Promise<void> {
  await preparePrint();
  window.print();
}

function toggleTimeline(): void {
  props.timeline.dispatch({
    type: "SET_PLAYING",
    playing: !timelinePlaying.value,
  });
}

function onBeforePrint(): void {
  printMode.value = true;
}

function onAfterPrint(): void {
  printMode.value = false;
}

onMounted(() => {
  controls = bindBrowserControls(props.engine);
  urlBinding = bindUrlState(props.engine);
  sync = createPresentationSync(props.engine, `hpe:${manifest.id}`, {
    role: state.value.mode === "speaker" ? "follower" : "presenter",
    timeline: props.timeline,
    slideState: props.slideState,
  });
  if (state.value.mode === "speaker") sync.requestSnapshot();
  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("keydown", onApplicationKey);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("beforeprint", onBeforePrint);
  window.addEventListener("afterprint", onAfterPrint);
  const inspectionPort: BrowserInspectionPort = {
    dispatch: (event) => {
      props.engine.dispatch(event);
    },
    getState: () => props.engine.getSnapshot(),
    getTimelineState: () => props.timeline.getSnapshot(),
    seekTimeline: (timeMs) => {
      props.timeline.dispatch({ type: "SEEK", timeMs });
    },
    getSlideState: () => props.slideState.getSnapshot(),
    getSlideStateScenarios: () =>
      enumerateSlideStateScenarios(
        props.slideState.declarations(props.engine.getSnapshot().slideId),
      ),
    setSlideStateScenario: (values) => {
      props.slideState.setScenario(values);
    },
    getSourceMap: async () => {
      const { sources } = await import("virtual:hpe-deck/sources");
      return sources[props.engine.getSnapshot().slideId];
    },
    preparePrint,
  };
  (window as unknown as { __HPE__: BrowserInspectionPort }).__HPE__ =
    inspectionPort;
});

onBeforeUnmount(() => {
  controls?.destroy();
  urlBinding?.destroy();
  sync?.destroy();
  props.timelineDriver.destroy();
  props.unbindTimeline();
  props.slideState.destroy();
  props.timeline.destroy();
  props.engine.destroy();
  window.removeEventListener("resize", resize);
  window.removeEventListener("keydown", onApplicationKey);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("beforeprint", onBeforePrint);
  window.removeEventListener("afterprint", onAfterPrint);
  delete (window as unknown as { __HPE__?: BrowserInspectionPort }).__HPE__;
});

watchEffect(() => {
  document.title = manifest.title;
  document.documentElement.dataset.hpeTheme = theme?.id ?? manifest.id;
  document.documentElement.style.setProperty(
    "--hpe-slide-width",
    `${manifest.size.width}px`,
  );
  document.documentElement.style.setProperty(
    "--hpe-slide-height",
    `${manifest.size.height}px`,
  );
  document.documentElement.style.setProperty(
    "--hpe-print-width",
    `${manifest.size.width / 96}in`,
  );
  document.documentElement.style.setProperty(
    "--hpe-print-height",
    `${manifest.size.height / 96}in`,
  );
  document.documentElement.dataset.hpeStep = String(state.value.step);
  document.documentElement.dataset.hpeMode = state.value.mode;
});
</script>

<template>
  <SpeakerView v-if="state.mode === 'speaker'" :engine="props.engine" />

  <OverviewView
    v-else-if="overview"
    :engine="props.engine"
    :current-slide-id="state.slideId"
    @close="overview = false"
  />

  <main v-else class="hpe-viewport">
    <div
      class="hpe-stage"
      :aria-busy="slideLoading"
      :data-slide-loading="slideLoading ? '' : undefined"
      :style="{
        width: `${manifest.size.width}px`,
        height: `${manifest.size.height}px`,
        transform: `scale(${scale})`,
      }"
    >
      <div
        v-for="(layer, layerIndex) in slideLayers"
        :key="layerIndex"
        class="hpe-slide-layer"
        :class="{
          'hpe-slide-layer--active': layerIndex === activeSlideLayer,
          'hpe-slide-layer--staging': layerIndex === stagingSlideLayer,
        }"
        :aria-hidden="layerIndex !== activeSlideLayer"
      >
        <component
          :is="layer.component"
          v-if="layer"
          :key="layer.id"
          :data-slide-id="layer.id"
        />
      </div>
      <output v-if="slideLoadError" class="hpe-slide-load-error" role="alert">
        页面加载失败：{{ slideLoadError }}
      </output>
    </div>
    <nav
      v-if="state.mode !== 'inspect'"
      class="hpe-toolbar"
      aria-label="Presentation tools"
    >
      <button
        type="button"
        title="Previous slide"
        @click="props.engine.dispatch({ type: 'PREVIOUS' })"
      >
        ←
      </button>
      <button
        type="button"
        title="Next slide"
        @click="props.engine.dispatch({ type: 'NEXT' })"
      >
        →
      </button>
      <button type="button" title="Overview (O)" @click="overview = true">
        Overview
      </button>
      <button type="button" title="Notes (N)" @click="notesOpen = !notesOpen">
        Notes
      </button>
      <button
        type="button"
        title="Spotlight (H)"
        @click="spotlight = !spotlight"
      >
        Spotlight
      </button>
      <button type="button" title="Speaker view (S)" @click="openSpeakerView">
        Speaker
      </button>
      <button type="button" title="Fullscreen (F)" @click="toggleFullscreen()">
        Fullscreen
      </button>
      <button type="button" title="Print all slides" @click="printDeck">
        Print
      </button>
      <button
        v-if="currentEntry?.durationMs !== undefined"
        type="button"
        :title="timelinePlaying ? 'Pause timeline' : 'Play timeline'"
        @click="toggleTimeline"
      >
        {{ timelinePlaying ? "Pause" : "Play" }}
      </button>
    </nav>
    <div
      class="hpe-progress"
      :style="{
        width: `${((displayedSlideIndex + 1) / manifest.slides.length) * 100}%`,
      }"
    />
    <output class="hpe-page-number"
      >{{ displayedSlideIndex + 1 }} / {{ manifest.slides.length }}</output
    >
  </main>

  <PresentationAids
    v-if="state.mode !== 'inspect' && state.mode !== 'speaker' && notesOpen"
    :slide-id="state.slideId"
    @close-notes="notesOpen = false"
  />
  <div
    v-if="state.mode !== 'inspect' && state.mode !== 'speaker' && spotlight"
    class="hpe-spotlight"
    aria-hidden="true"
    :style="{ transform: `translate(${pointerX}px, ${pointerY}px)` }"
  />

  <PrintView v-if="printMode" />
</template>
