/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent;
  export default component;
}

declare module "virtual:hpe-deck" {
  import type { Component } from "vue";

  import type { DeckManifest } from "@hpe/schema";
  import type { ThemeDefinition } from "@hpe/theme";

  export const manifest: DeckManifest;
  export const theme: ThemeDefinition | undefined;
  export const slideLoaders: Readonly<
    Record<string, () => Promise<{ default: Component }>>
  >;
  export const slides: Readonly<Record<string, Component>>;
}

declare module "virtual:hpe-deck/notes" {
  export const notes: Readonly<Record<string, string>>;
}

declare module "virtual:hpe-deck/sources" {
  import type { SlideSourceMap } from "@hpe/compiler";

  export const sources: Readonly<Record<string, SlideSourceMap>>;
}
