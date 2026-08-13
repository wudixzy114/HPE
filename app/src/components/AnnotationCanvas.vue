<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  active: boolean;
  tool: "pen" | "highlighter";
  color: string;
  clearVersion: number;
  width: number;
  height: number;
}>();

const emit = defineEmits<{
  drawingChange: [hasDrawing: boolean];
}>();

interface Point {
  readonly x: number;
  readonly y: number;
}

const canvas = ref<HTMLCanvasElement>();
let drawing = false;
let lastPoint: Point | undefined;
let activePointerId: number | undefined;

function context(): CanvasRenderingContext2D | undefined {
  return canvas.value?.getContext("2d") ?? undefined;
}

function pointFromEvent(event: PointerEvent): Point | undefined {
  const element = canvas.value;
  if (!element) return undefined;
  const bounds = element.getBoundingClientRect();
  if (bounds.width === 0 || bounds.height === 0) return undefined;
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * element.width,
    y: ((event.clientY - bounds.top) / bounds.height) * element.height,
  };
}

function drawSegment(from: Point, to: Point, pressure: number): void {
  const drawingContext = context();
  if (!drawingContext) return;
  drawingContext.strokeStyle = props.color;
  drawingContext.globalAlpha = props.tool === "highlighter" ? 0.34 : 0.92;
  drawingContext.globalCompositeOperation = "source-over";
  drawingContext.lineCap = "round";
  drawingContext.lineJoin = "round";
  drawingContext.lineWidth =
    (props.tool === "highlighter" ? 34 : 9) * Math.max(0.72, pressure || 0.5);
  drawingContext.beginPath();
  drawingContext.moveTo(from.x, from.y);
  drawingContext.lineTo(to.x, to.y);
  drawingContext.stroke();
}

function onPointerDown(event: PointerEvent): void {
  if (!props.active || (event.pointerType === "mouse" && event.button !== 0))
    return;
  const point = pointFromEvent(event);
  if (!point) return;
  drawing = true;
  activePointerId = event.pointerId;
  lastPoint = point;
  canvas.value?.setPointerCapture(event.pointerId);
  drawSegment(point, point, event.pressure);
  emit("drawingChange", true);
  event.preventDefault();
}

function onPointerMove(event: PointerEvent): void {
  if (!drawing || event.pointerId !== activePointerId || !lastPoint) return;
  const events = event.getCoalescedEvents?.() ?? [event];
  for (const pointerEvent of events) {
    const point = pointFromEvent(pointerEvent);
    if (!point) continue;
    drawSegment(lastPoint, point, pointerEvent.pressure);
    lastPoint = point;
  }
  event.preventDefault();
}

function finishDrawing(event?: PointerEvent): void {
  if (event && event.pointerId !== activePointerId) return;
  if (event && canvas.value?.hasPointerCapture(event.pointerId) === true) {
    canvas.value.releasePointerCapture(event.pointerId);
  }
  drawing = false;
  lastPoint = undefined;
  activePointerId = undefined;
}

function clear(): void {
  const element = canvas.value;
  const drawingContext = context();
  if (element && drawingContext) {
    drawingContext.clearRect(0, 0, element.width, element.height);
  }
  finishDrawing();
  emit("drawingChange", false);
}

watch(() => props.clearVersion, clear);
watch(
  () => props.active,
  (active) => {
    if (!active) finishDrawing();
  },
);

onBeforeUnmount(() => finishDrawing());
</script>

<template>
  <canvas
    ref="canvas"
    class="hpe-annotation-canvas"
    :class="{ 'hpe-annotation-canvas--active': active }"
    :width="width"
    :height="height"
    aria-label="Slide annotation canvas"
    :aria-hidden="!active"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="finishDrawing"
    @pointercancel="finishDrawing"
  />
</template>
