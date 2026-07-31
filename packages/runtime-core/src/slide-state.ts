import type { DeckEngine, Unsubscribe } from "./types.js";

export type SlideStateValue = string | number | boolean | null;
export type SlideStateValues = Readonly<Record<string, SlideStateValue>>;

export interface SlideStateSnapshot {
  readonly slideId: string;
  readonly values: SlideStateValues;
}

export interface SlideStateDeclaration {
  readonly slideId: string;
  readonly key: string;
  readonly initial: SlideStateValue;
  readonly inspect: readonly SlideStateValue[];
}

export interface RegisterSlideStateOptions {
  readonly slideId?: string;
  readonly key: string;
  readonly initial: SlideStateValue;
  readonly inspect: readonly SlideStateValue[];
}

export interface SlideStateScenario {
  readonly id: string;
  readonly values: SlideStateValues;
}

export interface SlideStateStore {
  getSnapshot(): SlideStateSnapshot;
  set(key: string, value: SlideStateValue): SlideStateSnapshot;
  setScenario(values: SlideStateValues): SlideStateSnapshot;
  register(options: RegisterSlideStateOptions): Unsubscribe;
  declarations(slideId: string): readonly SlideStateDeclaration[];
  subscribe(listener: (snapshot: SlideStateSnapshot) => void): Unsubscribe;
  destroy(): void;
}

interface RegisteredDeclaration {
  readonly declaration: SlideStateDeclaration;
  subscribers: number;
}

function isJsonSafePrimitive(value: unknown): value is SlideStateValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function assertDeclaration(options: RegisterSlideStateOptions): void {
  if (!options.key.trim()) throw new Error("Slide state key cannot be empty");
  if (options.inspect.length === 0) {
    throw new Error(`Slide state ${options.key} must declare inspect values`);
  }
  if (![options.initial, ...options.inspect].every(isJsonSafePrimitive)) {
    throw new Error(
      `Slide state ${options.key} values must be JSON-safe primitives`,
    );
  }
  if (!options.inspect.some((value) => Object.is(value, options.initial))) {
    throw new Error(
      `Slide state ${options.key} inspect values must include its initial value`,
    );
  }
  const serialized = options.inspect.map((value) => JSON.stringify(value));
  if (new Set(serialized).size !== serialized.length) {
    throw new Error(`Slide state ${options.key} inspect values must be unique`);
  }
}

function declarationsEqual(
  left: SlideStateDeclaration,
  right: SlideStateDeclaration,
): boolean {
  return (
    left.slideId === right.slideId &&
    left.key === right.key &&
    Object.is(left.initial, right.initial) &&
    left.inspect.length === right.inspect.length &&
    left.inspect.every((value, index) => Object.is(value, right.inspect[index]))
  );
}

function scenarioId(values: SlideStateValues): string {
  const entries = Object.entries(values);
  if (entries.length === 0) return "default";
  return entries
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
}

export function enumerateSlideStateScenarios(
  declarations: readonly SlideStateDeclaration[],
  limit = 256,
): readonly SlideStateScenario[] {
  if (!Number.isInteger(limit) || limit < 1)
    throw new Error("Scenario limit must be a positive integer");
  const sorted = [...declarations].sort((left, right) =>
    left.key.localeCompare(right.key),
  );
  const duplicate = sorted.find(
    (declaration, index) => declaration.key === sorted[index - 1]?.key,
  );
  if (duplicate)
    throw new Error(`Duplicate slide state declaration: ${duplicate.key}`);
  let count = 1;
  for (const declaration of sorted) {
    count *= declaration.inspect.length;
    if (count > limit)
      throw new Error(
        `Inspectable slide state combinations exceed the limit of ${limit}`,
      );
  }
  let values: SlideStateValues[] = [{}];
  for (const declaration of sorted) {
    values = values.flatMap((snapshot) =>
      declaration.inspect.map((value) => ({
        ...snapshot,
        [declaration.key]: value,
      })),
    );
  }
  return values.map((snapshot) => ({
    id: scenarioId(snapshot),
    values: snapshot,
  }));
}

export function createSlideStateStore(engine: DeckEngine): SlideStateStore {
  let active = true;
  let snapshot: SlideStateSnapshot = {
    slideId: engine.getSnapshot().slideId,
    values: {},
  };
  const declarations = new Map<string, Map<string, RegisteredDeclaration>>();
  const listeners = new Set<(snapshot: SlideStateSnapshot) => void>();

  const emit = (): void => {
    for (const listener of listeners) listener(snapshot);
  };
  const initialValues = (slideId: string): SlideStateValues =>
    Object.fromEntries(
      [...(declarations.get(slideId)?.values() ?? [])].map(
        ({ declaration }) => [declaration.key, declaration.initial],
      ),
    );
  const unsubscribeDeck = engine.subscribe((deckState) => {
    if (deckState.slideId === snapshot.slideId) return;
    snapshot = {
      slideId: deckState.slideId,
      values: initialValues(deckState.slideId),
    };
    emit();
  });

  const store: SlideStateStore = {
    getSnapshot: () => snapshot,
    set(key, value) {
      if (!active) throw new Error("Slide state store has been destroyed");
      if (!isJsonSafePrimitive(value))
        throw new Error("Slide state values must be JSON-safe primitives");
      if (!declarations.get(snapshot.slideId)?.has(key)) {
        throw new Error(`Undeclared slide state: ${snapshot.slideId}.${key}`);
      }
      if (Object.is(snapshot.values[key], value)) return snapshot;
      snapshot = { ...snapshot, values: { ...snapshot.values, [key]: value } };
      emit();
      return snapshot;
    },
    setScenario(values) {
      for (const [key, value] of Object.entries(values)) store.set(key, value);
      return snapshot;
    },
    register(options) {
      if (!active) throw new Error("Slide state store has been destroyed");
      assertDeclaration(options);
      const slideId = options.slideId ?? snapshot.slideId;
      const declaration: SlideStateDeclaration = {
        slideId,
        key: options.key,
        initial: options.initial,
        inspect: [...options.inspect],
      };
      const slideDeclarations =
        declarations.get(slideId) ?? new Map<string, RegisteredDeclaration>();
      const registered = slideDeclarations.get(options.key);
      if (
        registered &&
        !declarationsEqual(registered.declaration, declaration)
      ) {
        throw new Error(
          `Conflicting declaration for slide state ${slideId}.${options.key}`,
        );
      }
      const entry = registered ?? { declaration, subscribers: 0 };
      entry.subscribers += 1;
      slideDeclarations.set(options.key, entry);
      declarations.set(slideId, slideDeclarations);
      if (snapshot.slideId === slideId && !(options.key in snapshot.values)) {
        snapshot = {
          ...snapshot,
          values: { ...snapshot.values, [options.key]: options.initial },
        };
        emit();
      }
      let registeredActive = true;
      return () => {
        if (!registeredActive) return;
        registeredActive = false;
        const current = slideDeclarations.get(options.key);
        if (!current) return;
        current.subscribers -= 1;
        if (current.subscribers === 0) slideDeclarations.delete(options.key);
        if (slideDeclarations.size === 0) declarations.delete(slideId);
      };
    },
    declarations(slideId) {
      return [...(declarations.get(slideId)?.values() ?? [])].map(
        ({ declaration }) => declaration,
      );
    },
    subscribe(listener) {
      if (!active) throw new Error("Slide state store has been destroyed");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      if (!active) return;
      active = false;
      unsubscribeDeck();
      listeners.clear();
      declarations.clear();
    },
  };
  return store;
}
