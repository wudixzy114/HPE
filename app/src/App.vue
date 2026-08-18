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
import { manifest, slideLoaders, theme, themes } from "virtual:hpe-deck";

import AnnotationCanvas from "./components/AnnotationCanvas.vue";

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
const annotationActive = ref(false);
const annotationTool = ref<"pen" | "highlighter">("pen");
const annotationColor = ref("#ef4444");
const annotationHasDrawing = ref(false);
const annotationClearVersion = ref(0);
const defaultThemeId = theme?.id ?? manifest.id;
const themeOptions = computed(() => themes);
const themeStorageKey = `hpe:${manifest.id}:theme`;
const themePickerOpen = ref(false);

function hasThemeOption(themeId: string): boolean {
  return themeOptions.value.some((option) => option.id === themeId);
}

function initialThemeId(): string {
  const selectedFromUrl = new URLSearchParams(window.location.search).get(
    "theme",
  );
  if (selectedFromUrl && hasThemeOption(selectedFromUrl)) {
    return selectedFromUrl;
  }
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (storedTheme && hasThemeOption(storedTheme)) return storedTheme;
  } catch {
    // Theme selection remains usable when browser storage is unavailable.
  }
  return defaultThemeId;
}

const activeThemeId = ref(initialThemeId());
const activeTheme = computed(
  () =>
    themeOptions.value.find(
      (themeOption) => themeOption.id === activeThemeId.value,
    ) ?? undefined,
);

function themeSwatches(themeOption: (typeof themes)[number]): string[] {
  return Object.values(themeOption.colors)
    .slice(0, 3)
    .map((color) => color.value);
}

function themeFont(themeOption: (typeof themes)[number] | undefined): string {
  const typography = themeOption?.typography.ui ?? themeOption?.typography.body;
  if (!typography) return "Inter, ui-sans-serif, system-ui, sans-serif";
  return [typography.family, ...typography.fallback]
    .map((family) => (family.includes(" ") ? `"${family}"` : family))
    .join(", ");
}
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
    clearAnnotations();
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

function clearAnnotations(): void {
  annotationClearVersion.value += 1;
  annotationHasDrawing.value = false;
}

function selectAnnotationTool(tool: "pen" | "highlighter"): void {
  if (annotationActive.value && annotationTool.value === tool) {
    annotationActive.value = false;
    return;
  }
  annotationTool.value = tool;
  annotationColor.value = tool === "highlighter" ? "#fde047" : "#ef4444";
  annotationActive.value = true;
}

function openOverview(): void {
  annotationActive.value = false;
  overview.value = true;
}

function setTheme(themeId: string): void {
  if (!hasThemeOption(themeId)) return;
  activeThemeId.value = themeId;
  themePickerOpen.value = false;
  try {
    window.localStorage.setItem(themeStorageKey, themeId);
  } catch {
    // Theme selection remains usable when browser storage is unavailable.
  }
  const url = new URL(window.location.href);
  if (themeId === defaultThemeId) url.searchParams.delete("theme");
  else url.searchParams.set("theme", themeId);
  window.history.replaceState({}, "", url);
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
  if (event.key === "Escape" && annotationActive.value) {
    annotationActive.value = false;
  } else if (event.key === "Escape" && overview.value) {
    overview.value = false;
  } else if (event.key === "Escape" && notesOpen.value) {
    notesOpen.value = false;
  } else if (
    event.key.toLowerCase() === "o" &&
    state.value.mode !== "speaker"
  ) {
    if (overview.value) overview.value = false;
    else openOverview();
  } else if (
    event.key.toLowerCase() === "s" &&
    state.value.mode !== "speaker"
  ) {
    openSpeakerView();
  } else if (event.key.toLowerCase() === "f") {
    void toggleFullscreen();
  } else if (event.key.toLowerCase() === "n") {
    notesOpen.value = !notesOpen.value;
  } else if (event.key.toLowerCase() === "p") {
    selectAnnotationTool("pen");
  } else if (event.key.toLowerCase() === "h") {
    selectAnnotationTool("highlighter");
  } else if (event.key.toLowerCase() === "c" && annotationHasDrawing.value) {
    clearAnnotations();
  } else if (event.key === "Home") {
    const first = manifest.slides[0];
    if (first) props.engine.dispatch({ type: "GOTO", slideId: first.id });
  } else if (event.key === "End") {
    const last = manifest.slides.at(-1);
    if (last) props.engine.dispatch({ type: "GOTO", slideId: last.id });
  }
}

function openSpeakerView(): void {
  const url = new URL(window.location.href);
  if (activeThemeId.value !== defaultThemeId) {
    url.searchParams.set("theme", activeThemeId.value);
  }
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
  window.removeEventListener("beforeprint", onBeforePrint);
  window.removeEventListener("afterprint", onAfterPrint);
  document.documentElement.removeAttribute("data-hpe-annotation-active");
  delete document.documentElement.dataset.hpeAnnotationTool;
  delete (window as unknown as { __HPE__?: BrowserInspectionPort }).__HPE__;
});

watchEffect(() => {
  document.title = manifest.title;
  document.documentElement.dataset.hpeTheme = activeThemeId.value;
  document.documentElement.style.setProperty(
    "--hpe-font-sans",
    themeFont(activeTheme.value),
  );
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
  document.documentElement.toggleAttribute(
    "data-hpe-annotation-active",
    annotationActive.value,
  );
  document.documentElement.dataset.hpeAnnotationTool = annotationActive.value
    ? annotationTool.value
    : "off";
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
          :data-hpe-active-slide="
            layerIndex === activeSlideLayer ? '' : undefined
          "
        />
      </div>
      <output v-if="slideLoadError" class="hpe-slide-load-error" role="alert">
        页面加载失败：{{ slideLoadError }}
      </output>
      <AnnotationCanvas
        v-if="state.mode !== 'inspect'"
        :active="annotationActive"
        :tool="annotationTool"
        :color="annotationColor"
        :clear-version="annotationClearVersion"
        :width="manifest.size.width"
        :height="manifest.size.height"
        @drawing-change="annotationHasDrawing = $event"
      />
    </div>
    <nav
      v-if="state.mode !== 'inspect'"
      class="hpe-toolbar"
      :class="{ 'hpe-toolbar--theme-picker-open': themePickerOpen }"
      aria-label="Presentation tools"
      tabindex="0"
    >
      <div class="hpe-toolbar__actions">
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
        <button type="button" title="Overview (O)" @click="openOverview">
          Overview
        </button>
        <button type="button" title="Notes (N)" @click="notesOpen = !notesOpen">
          Notes
        </button>
        <button type="button" title="Speaker view (S)" @click="openSpeakerView">
          Speaker
        </button>
        <button
          type="button"
          title="Fullscreen (F)"
          @click="toggleFullscreen()"
        >
          Fullscreen
        </button>
        <div v-if="themeOptions.length > 1" class="hpe-toolbar__theme">
          <button
            type="button"
            :aria-expanded="themePickerOpen"
            aria-controls="hpe-theme-picker"
            :title="`Theme: ${activeTheme?.name ?? activeThemeId}`"
            @click="themePickerOpen = !themePickerOpen"
          >
            Theme
          </button>
          <div
            v-if="themePickerOpen"
            id="hpe-theme-picker"
            class="hpe-toolbar__theme-menu"
            role="group"
            aria-label="Presentation theme"
          >
            <button
              v-for="themeOption in themeOptions"
              :key="themeOption.id"
              type="button"
              class="hpe-toolbar__theme-option"
              :class="{
                'hpe-toolbar__theme-option--active':
                  activeThemeId === themeOption.id,
              }"
              :aria-pressed="activeThemeId === themeOption.id"
              @click="setTheme(themeOption.id)"
            >
              <span class="hpe-toolbar__theme-swatches" aria-hidden="true">
                <i
                  v-for="swatch in themeSwatches(themeOption)"
                  :key="swatch"
                  :style="{ backgroundColor: swatch }"
                />
              </span>
              <span class="hpe-toolbar__theme-copy">
                <b>{{ themeOption.name }}</b>
                <small>{{ themeOption.description }}</small>
              </span>
            </button>
          </div>
        </div>
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
      </div>
      <span class="hpe-toolbar__handle" aria-hidden="true">•••</span>
    </nav>
    <aside
      v-if="state.mode !== 'inspect'"
      class="hpe-annotation-dock"
      :class="{ 'hpe-annotation-dock--active': annotationActive }"
      aria-label="Annotation tools"
    >
      <button
        type="button"
        title="Pen (P)"
        :aria-pressed="annotationActive && annotationTool === 'pen'"
        :class="{
          'hpe-annotation-dock__tool--active':
            annotationActive && annotationTool === 'pen',
        }"
        @click="selectAnnotationTool('pen')"
      >
        <span aria-hidden="true">✎</span>
        Pen
      </button>
      <button
        type="button"
        title="Highlighter (H)"
        :aria-pressed="annotationActive && annotationTool === 'highlighter'"
        :class="{
          'hpe-annotation-dock__tool--active':
            annotationActive && annotationTool === 'highlighter',
        }"
        @click="selectAnnotationTool('highlighter')"
      >
        <span aria-hidden="true">▰</span>
        Highlight
      </button>
      <div v-if="annotationActive" class="hpe-annotation-dock__options">
        <div class="hpe-annotation-dock__colors" aria-label="Annotation color">
          <button
            v-for="color in annotationTool === 'highlighter'
              ? ['#fde047', '#86efac', '#67e8f9']
              : ['#ef4444', '#e5aa31', '#14b8a6']"
            :key="color"
            type="button"
            class="hpe-annotation-dock__color"
            :class="{
              'hpe-annotation-dock__color--active': annotationColor === color,
            }"
            :style="{ '--hpe-annotation-color': color }"
            :aria-label="`Use ${color}`"
            :aria-pressed="annotationColor === color"
            @click="annotationColor = color"
          />
        </div>
        <button
          type="button"
          title="Clear annotations (C)"
          :disabled="!annotationHasDrawing"
          @click="clearAnnotations"
        >
          Clear
        </button>
      </div>
    </aside>
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
  <PrintView v-if="printMode" />
</template>
