/// <reference types="vite/client" />

declare module "virtual:hpe-deck" {
  import type { Component } from "vue";

  import type { DeckManifest } from "@hpe/schema";

  export const manifest: DeckManifest;
  export const slides: Readonly<Record<string, Component>>;
  export const notes: Readonly<Record<string, string>>;
}
