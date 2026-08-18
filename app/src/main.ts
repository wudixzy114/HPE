import { createApp, type Component } from "vue";

import { Slide, Step } from "@hpe/renderer-vue";
import { Timeline } from "@hpe/renderer-vue/timeline";
import { createBrowserTimelineClock } from "@hpe/runtime-browser/timeline";
import { createDeckEngine } from "@hpe/runtime-core";
import { createSlideStateStore } from "@hpe/runtime-core/slide-state";
import {
  bindTimelineToDeck,
  createTimelineController,
  createTimelineDriver,
} from "@hpe/runtime-core/timeline";
import { manifest, themes } from "virtual:hpe-deck";
import "virtual:hpe-player-styles.css";

import App from "./App.vue";

const themeIds = new Set<string>();
for (const theme of themes) {
  if (themeIds.has(theme.id)) {
    throw new Error(`Duplicate runtime theme id: ${theme.id}`);
  }
  themeIds.add(theme.id);
  if (
    theme.canvas.width !== manifest.size.width ||
    theme.canvas.height !== manifest.size.height
  ) {
    throw new Error(
      `Theme ${theme.id} declares ${theme.canvas.width}x${theme.canvas.height}, ` +
        `but deck ${manifest.id} declares ${manifest.size.width}x${manifest.size.height}`,
    );
  }
}

const engine = createDeckEngine(manifest);
const timeline = createTimelineController();
const unbindTimeline = bindTimelineToDeck(timeline, engine, manifest);
const timelineDriver = createTimelineDriver(
  timeline,
  createBrowserTimelineClock(),
);
const slideState = createSlideStateStore(engine);
const app = createApp(App as Component, {
  engine,
  timeline,
  timelineDriver,
  slideState,
  unbindTimeline,
});
app.component("Slide", Slide);
app.component("Step", Step);
app.component("Timeline", Timeline);
app.mount("#app");
