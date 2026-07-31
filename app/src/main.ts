import { createApp, type Component } from "vue";

import { Slide, Step } from "@hpe/renderer-vue";
import { createDeckEngine } from "@hpe/runtime-core";
import { manifest } from "virtual:hpe-deck";

import App from "./App.vue";

const engine = createDeckEngine(manifest);
const app = createApp(App as Component, { engine });
app.component("Slide", Slide);
app.component("Step", Step);
app.mount("#app");
