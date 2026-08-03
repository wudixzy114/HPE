# Vue authoring reference

## Use the smallest capability that fits

| Need                           | Use                                                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Static content                 | `<template>` + theme classes                                                                         |
| Click reveal                   | `<Step :at="n">` and manifest `maxStep`                                                              |
| Seekable animation             | `<Timeline v-slot="{ progress }" :to="ms">`                                                          |
| Tabs/toggles/finite simulation | `useSlideState(key, { initial, inspect })`                                                           |
| Complex web interaction        | ordinary Vue refs/computed/events, with every checkable finite state exposed through `useSlideState` |

Do not combine all behavior into one giant component. A slide may import ordinary Vue components from `app/src/components` when they are genuinely reusable.

## Inspectable interaction

```vue
<script setup lang="ts">
import { useSlideState } from "@hpe/renderer-vue/slide-state";

const tab = useSlideState("tab", {
  initial: "overview",
  inspect: ["overview", "details", "metrics"],
});
</script>
```

Use static object keys for classes so the compiler and Tailwind can see every class:

```vue
<div
  :class="{
    'border-teal-500': tab === 'overview',
    'border-slate-400': tab !== 'overview',
  }"
/>
```

Never concatenate class names.

## Content and layout

- Start from the message hierarchy: claim → evidence/relationship → takeaway.
- Prefer one strong visual structure over many decorative objects.
- Use theme spacing and typography. Read `theme.ts` before writing pages.
- Keep major content inside the theme safe area.
- Add `data-layout` only to sibling objects that should not overlap.
- Use `data-overflow="allow"`, `data-safe-area="allow"`, `data-font-size="allow"`, or `data-contrast="allow"` only for deliberate, reviewed exceptions.
- Keep code static with `<ShikiCode lang="typescript" code="..." />`; do not ship a highlighter runtime.

## Notes

Write notes in the slide's `<notes lang="md">` block. Notes should explain delivery, transitions, caveats, and interaction instructions—not repeat visible prose.

## Verification loop

```bash
npm exec -- deck validate --json
npm exec -- deck screenshot --slide slide-id --states all --annotate --json
```

Review raw images before annotated images. Annotation boxes explain geometry; they are not the design itself.
