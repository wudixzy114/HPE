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

interface Stroke {
  readonly tool: "pen" | "highlighter";
  readonly color: string;
  readonly points: Point[];
}

const canvas = ref<HTMLCanvasElement>();
const cursorVisible = ref(false);
const cursorPoint = ref<Point>({ x: 0, y: 0 });
let drawing = false;
let activePointerId: number | undefined;
let activeStroke: Stroke | undefined;
let committedCanvas: HTMLCanvasElement | undefined;

function context(): CanvasRenderingContext2D | undefined {
  return canvas.value?.getContext("2d") ?? undefined;
}

function committedContext(): CanvasRenderingContext2D | undefined {
  if (!committedCanvas) committedCanvas = document.createElement("canvas");
  if (
    committedCanvas.width !== props.width ||
    committedCanvas.height !== props.height
  ) {
    committedCanvas.width = props.width;
    committedCanvas.height = props.height;
  }
  return committedCanvas.getContext("2d") ?? undefined;
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

function drawStroke(
  drawingContext: CanvasRenderingContext2D,
  stroke: Stroke,
): void {
  const first = stroke.points[0];
  if (!first) return;
  drawingContext.save();
  drawingContext.strokeStyle = stroke.color;
  drawingContext.globalAlpha = stroke.tool === "highlighter" ? 0.34 : 0.92;
  drawingContext.globalCompositeOperation = "source-over";
  drawingContext.lineCap = stroke.tool === "highlighter" ? "butt" : "round";
  drawingContext.lineJoin = "round";
  drawingContext.lineWidth = stroke.tool === "highlighter" ? 34 : 9;
  drawingContext.beginPath();
  drawingContext.moveTo(first.x, first.y);
  if (stroke.points.length === 1) {
    drawingContext.lineTo(first.x + 0.01, first.y);
  } else {
    for (const point of stroke.points.slice(1)) {
      drawingContext.lineTo(point.x, point.y);
    }
  }
  drawingContext.stroke();
  drawingContext.restore();
}

function renderActiveStroke(): void {
  const element = canvas.value;
  const drawingContext = context();
  if (!element || !drawingContext) return;
  drawingContext.clearRect(0, 0, element.width, element.height);
  if (committedCanvas) drawingContext.drawImage(committedCanvas, 0, 0);
  if (activeStroke) drawStroke(drawingContext, activeStroke);
}

function updateCursor(event: PointerEvent): Point | undefined {
  const point = pointFromEvent(event);
  if (!point) return undefined;
  cursorPoint.value = point;
  cursorVisible.value = true;
  return point;
}

function onPointerDown(event: PointerEvent): void {
  if (!props.active || (event.pointerType === "mouse" && event.button !== 0))
    return;
  const point = updateCursor(event);
  if (!point) return;
  drawing = true;
  activePointerId = event.pointerId;
  activeStroke = { tool: props.tool, color: props.color, points: [point] };
  canvas.value?.setPointerCapture(event.pointerId);
  renderActiveStroke();
  emit("drawingChange", true);
  event.preventDefault();
}

function onPointerMove(event: PointerEvent): void {
  updateCursor(event);
  if (!drawing || event.pointerId !== activePointerId || !activeStroke) return;
  const events = event.getCoalescedEvents?.() ?? [event];
  for (const pointerEvent of events) {
    const point = pointFromEvent(pointerEvent);
    if (point) activeStroke.points.push(point);
  }
  renderActiveStroke();
  event.preventDefault();
}

function finishDrawing(event?: PointerEvent): void {
  if (event && event.pointerId !== activePointerId) return;
  if (activeStroke) {
    const drawingContext = committedContext();
    if (drawingContext) drawStroke(drawingContext, activeStroke);
  }
  if (event && canvas.value?.hasPointerCapture(event.pointerId) === true) {
    canvas.value.releasePointerCapture(event.pointerId);
  }
  drawing = false;
  activePointerId = undefined;
  activeStroke = undefined;
  renderActiveStroke();
}

function clear(): void {
  if (
    activePointerId !== undefined &&
    canvas.value?.hasPointerCapture(activePointerId) === true
  ) {
    canvas.value.releasePointerCapture(activePointerId);
  }
  activeStroke = undefined;
  drawing = false;
  activePointerId = undefined;
  const element = canvas.value;
  const drawingContext = context();
  if (element && drawingContext) {
    drawingContext.clearRect(0, 0, element.width, element.height);
  }
  const storedContext = committedContext();
  if (committedCanvas && storedContext) {
    storedContext.clearRect(
      0,
      0,
      committedCanvas.width,
      committedCanvas.height,
    );
  }
  emit("drawingChange", false);
}

watch(() => props.clearVersion, clear);
watch(
  () => props.active,
  (active) => {
    if (!active) {
      finishDrawing();
      cursorVisible.value = false;
    }
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
    @pointerenter="updateCursor"
    @pointerleave="cursorVisible = false"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="finishDrawing"
    @pointercancel="finishDrawing"
  />
  <div
    v-if="active && cursorVisible"
    class="hpe-annotation-cursor"
    :class="`hpe-annotation-cursor--${tool}`"
    aria-hidden="true"
    :style="{
      left: `${cursorPoint.x}px`,
      top: `${cursorPoint.y}px`,
      borderColor: color,
      backgroundColor: tool === 'highlighter' ? `${color}38` : 'transparent',
    }"
  />
</template>
