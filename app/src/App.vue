<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
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
import { manifest, slides } from "virtual:hpe-deck";

import OverviewView from "./components/OverviewView.vue";
import PrintView from "./components/PrintView.vue";
import SpeakerView from "./components/SpeakerView.vue";

interface AppProps {
  readonly engine: DeckEngine;
  readonly timeline: TimelineController;
  readonly timelineDriver: TimelineDriver;
  readonly slideState: SlideStateStore;
  readonly unbindTimeline: () => void;
}

interface BrowserInspectionPort {
  dispatch(event: DeckEvent): void;
  getState(): ReturnType<DeckEngine["getSnapshot"]>;
  getTimelineState(): ReturnType<TimelineController["getSnapshot"]>;
  seekTimeline(timeMs: number): void;
  getSlideState(): ReturnType<SlideStateStore["getSnapshot"]>;
  getSlideStateScenarios(): ReturnType<typeof enumerateSlideStateScenarios>;
  setSlideStateScenario(values: SlideStateValues): void;
}

const props = defineProps<AppProps>();
const { state } = provideDeckEngine(props.engine);
const timelineContext = provideTimeline(props.timeline);
provideSlideStateStore(props.slideState);
const currentSlide = computed(() => slides[state.value.slideId]);
const currentEntry = computed(() => manifest.slides[state.value.slideIndex]);
const timelinePlaying = computed(() => timelineContext.state.value.playing);
const scale = ref(1);
const overview = ref(false);
const printMode = ref(false);
let controls: BrowserControls | undefined;
let urlBinding: BrowserBinding | undefined;
let sync: DeckSync | undefined;

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
    ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
      element?.tagName ?? "",
    )
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
  }
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

async function printDeck(): Promise<void> {
  printMode.value = true;
  await nextTick();
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
  delete (window as unknown as { __HPE__?: BrowserInspectionPort }).__HPE__;
});

watchEffect(() => {
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
      :style="{
        width: `${manifest.size.width}px`,
        height: `${manifest.size.height}px`,
        transform: `scale(${scale})`,
      }"
    >
      <component
        :is="currentSlide"
        v-if="currentSlide"
        :data-slide-id="state.slideId"
      />
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
        width: `${((state.slideIndex + 1) / manifest.slides.length) * 100}%`,
      }"
    />
    <output class="hpe-page-number"
      >{{ state.slideIndex + 1 }} / {{ manifest.slides.length }}</output
    >
  </main>

  <PrintView v-if="printMode" />
</template>
