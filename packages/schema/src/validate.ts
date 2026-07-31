import { z } from "zod";

import { CURRENT_SCHEMA_VERSION } from "./index.js";
import type { DeckManifest } from "./index.js";

const safeRelativePath = z
  .string()
  .min(1)
  .refine(
    (value) =>
      !value.startsWith("/") &&
      !value.includes("\\") &&
      !value.split("/").includes(".."),
    "must be a safe relative path",
  );

export const slideEntrySchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  file: safeRelativePath,
  title: z.string().min(1).optional(),
  maxStep: z.number().int().nonnegative().optional(),
  durationMs: z.number().int().nonnegative().optional(),
});

export const deckManifestSchema = z
  .object({
    schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    title: z.string().min(1),
    size: z.object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    }),
    theme: safeRelativePath,
    slides: z.array(slideEntrySchema).min(1),
  })
  .superRefine((deck, context) => {
    const seen = new Set<string>();
    for (const [index, slide] of deck.slides.entries()) {
      if (seen.has(slide.id)) {
        context.addIssue({
          code: "custom",
          path: ["slides", index, "id"],
          message: `duplicate slide id: ${slide.id}`,
        });
      }
      seen.add(slide.id);
    }
  });

export class ManifestValidationError extends Error {
  public readonly issues: readonly z.core.$ZodIssue[];

  public constructor(issues: readonly z.core.$ZodIssue[]) {
    super(
      issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n"),
    );
    this.name = "ManifestValidationError";
    this.issues = issues;
  }
}

export function validateDeckManifest(input: unknown): DeckManifest {
  const result = deckManifestSchema.safeParse(input);
  if (!result.success) throw new ManifestValidationError(result.error.issues);
  // Zod models an omitted optional property as `T | undefined`; the public
  // contract uses exact optional properties. Validation guarantees omission.
  return result.data as DeckManifest;
}
