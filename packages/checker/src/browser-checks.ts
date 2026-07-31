import type { Bounds, DiagnosticSeverity } from "./index.js";

export interface BrowserCheckOptions {
  readonly expectedWidth: number;
  readonly expectedHeight: number;
  readonly minimumFontSize: number;
  readonly safeArea: number;
}

export interface BrowserFinding {
  readonly code: string;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly nodeId?: string;
  readonly bounds?: Bounds;
  readonly slideBounds?: Pick<Bounds, "width" | "height">;
}

/** Self-contained because Playwright serializes this function into the page. */
export function runBrowserChecks(
  root: HTMLElement,
  options: BrowserCheckOptions,
): BrowserFinding[] {
  const findings: BrowserFinding[] = [];
  const slideRect = root.getBoundingClientRect();
  const slideBounds = { width: slideRect.width, height: slideRect.height };
  const visible = (element: HTMLElement): boolean => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) > 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  };
  const bounds = (rect: DOMRect): Bounds => ({
    x: rect.x - slideRect.x,
    y: rect.y - slideRect.y,
    width: rect.width,
    height: rect.height,
  });
  const nodeId = (element: HTMLElement): string | undefined =>
    element.dataset.node ??
    element.closest<HTMLElement>("[data-node]")?.dataset.node;
  const push = (
    finding: Omit<BrowserFinding, "nodeId" | "bounds" | "slideBounds">,
    element?: HTMLElement,
  ): void => {
    const id = element ? nodeId(element) : undefined;
    const rect = element ? bounds(element.getBoundingClientRect()) : undefined;
    findings.push({
      ...finding,
      ...(id === undefined ? {} : { nodeId: id }),
      ...(rect === undefined ? {} : { bounds: rect }),
      slideBounds,
    });
  };

  if (
    Math.abs(slideRect.width - options.expectedWidth) > 1 ||
    Math.abs(slideRect.height - options.expectedHeight) > 1
  ) {
    push({
      code: "SLIDE_SIZE_MISMATCH",
      severity: "error",
      message: `Expected ${options.expectedWidth}x${options.expectedHeight}, received ${slideRect.width}x${slideRect.height}`,
    });
  }
  if (root.scrollWidth > root.clientWidth + 1) {
    push({
      code: "SLIDE_SCROLL_OVERFLOW_X",
      severity: "error",
      message: `Slide scrollWidth ${root.scrollWidth}px exceeds clientWidth ${root.clientWidth}px`,
    });
  }
  if (root.scrollHeight > root.clientHeight + 1) {
    push({
      code: "SLIDE_SCROLL_OVERFLOW_Y",
      severity: "error",
      message: `Slide scrollHeight ${root.scrollHeight}px exceeds clientHeight ${root.clientHeight}px`,
    });
  }

  for (const element of root.querySelectorAll<HTMLElement>("[data-node]")) {
    if (!visible(element) || element.dataset.overflow === "allow") continue;
    const rect = element.getBoundingClientRect();
    if (
      rect.left < slideRect.left - 0.5 ||
      rect.top < slideRect.top - 0.5 ||
      rect.right > slideRect.right + 0.5 ||
      rect.bottom > slideRect.bottom + 0.5
    ) {
      push(
        {
          code: "SLIDE_ELEMENT_OVERFLOW",
          severity: "error",
          message: `Node ${element.dataset.node ?? "unknown"} extends outside the logical slide`,
        },
        element,
      );
    }
    if (element.dataset.safeArea !== "allow") {
      const inset = options.safeArea;
      if (
        rect.left < slideRect.left + inset ||
        rect.top < slideRect.top + inset ||
        rect.right > slideRect.right - inset ||
        rect.bottom > slideRect.bottom - inset
      ) {
        push(
          {
            code: "SAFE_AREA_VIOLATION",
            severity: "warning",
            message: `Node enters the ${inset}px slide safe area`,
          },
          element,
        );
      }
    }
  }

  const textElements = root.querySelectorAll<HTMLElement>(
    "h1,h2,h3,h4,h5,h6,p,li,td,th,figcaption,blockquote,[data-text]",
  );
  const parseColor = (
    value: string,
  ): [number, number, number, number] | undefined => {
    const match = value.match(
      /rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/u,
    );
    if (!match) return undefined;
    return [
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
      match[4] === undefined ? 1 : Number(match[4]),
    ];
  };
  const background = (element: HTMLElement): [number, number, number] => {
    let current: HTMLElement | null = element;
    while (current) {
      const color = parseColor(getComputedStyle(current).backgroundColor);
      if (color && color[3] > 0) return [color[0], color[1], color[2]];
      current = current.parentElement;
    }
    return [255, 255, 255];
  };
  const luminance = ([
    red = 0,
    green = 0,
    blue = 0,
  ]: readonly number[]): number => {
    const channels = [red, green, blue].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return (
      0.2126 * (channels[0] ?? 0) +
      0.7152 * (channels[1] ?? 0) +
      0.0722 * (channels[2] ?? 0)
    );
  };
  const contrast = (
    foreground: readonly number[],
    backgroundColor: readonly number[],
  ): number => {
    const light = Math.max(luminance(foreground), luminance(backgroundColor));
    const dark = Math.min(luminance(foreground), luminance(backgroundColor));
    return (light + 0.05) / (dark + 0.05);
  };

  for (const element of textElements) {
    if (!visible(element)) continue;
    const hasDirectText = [...element.childNodes].some(
      (child) =>
        child.nodeType === Node.TEXT_NODE && Boolean(child.textContent?.trim()),
    );
    if (!hasDirectText && element.dataset.text === undefined) continue;
    const style = getComputedStyle(element);
    const clippedX =
      element.scrollWidth > element.clientWidth + 1 &&
      style.overflowX !== "visible";
    const clippedY =
      element.scrollHeight > element.clientHeight + 1 &&
      style.overflowY !== "visible";
    if (clippedX || clippedY) {
      push(
        {
          code: "TEXT_CLIPPED",
          severity: "error",
          message: `Text scroll size ${element.scrollWidth}x${element.scrollHeight}px exceeds its clipped ${element.clientWidth}x${element.clientHeight}px box`,
        },
        element,
      );
    }
    const fontSize = Number.parseFloat(style.fontSize);
    if (
      fontSize < options.minimumFontSize &&
      element.dataset.fontSize !== "allow"
    ) {
      push(
        {
          code: "FONT_SIZE_TOO_SMALL",
          severity: "warning",
          message: `Font size ${fontSize}px is below the ${options.minimumFontSize}px minimum`,
        },
        element,
      );
    }
    const foreground = parseColor(style.color);
    if (foreground) {
      const ratio = contrast(foreground, background(element));
      const weight =
        Number(style.fontWeight) || (style.fontWeight === "bold" ? 700 : 400);
      const required =
        fontSize >= 24 || (fontSize >= 18.66 && weight >= 700) ? 3 : 4.5;
      if (ratio < required && element.dataset.contrast !== "allow") {
        push(
          {
            code: "COLOR_CONTRAST_LOW",
            severity: "warning",
            message: `Text contrast ${ratio.toFixed(2)}:1 is below ${required}:1`,
          },
          element,
        );
      }
    }
  }

  for (const image of root.querySelectorAll<HTMLImageElement>("img")) {
    if (visible(image) && (!image.complete || image.naturalWidth === 0)) {
      push(
        {
          code: "IMAGE_DECODE_FAILED",
          severity: "error",
          message: `Image did not decode: ${image.currentSrc || image.src}`,
        },
        image,
      );
    }
  }
  for (const media of root.querySelectorAll<HTMLMediaElement>("video,audio")) {
    if (visible(media) && media.error) {
      push(
        {
          code: "MEDIA_LOAD_FAILED",
          severity: "error",
          message: `Media failed to load: ${media.currentSrc || media.src}`,
        },
        media,
      );
    }
  }

  const layout = [
    ...root.querySelectorAll<HTMLElement>("[data-layout]"),
  ].filter(
    (element) => visible(element) && element.dataset.layout !== "allow-overlap",
  );
  for (let leftIndex = 0; leftIndex < layout.length; leftIndex += 1) {
    const left = layout[leftIndex];
    if (!left) continue;
    const leftRect = left.getBoundingClientRect();
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < layout.length;
      rightIndex += 1
    ) {
      const right = layout[rightIndex];
      if (!right || left.contains(right) || right.contains(left)) continue;
      const rightRect = right.getBoundingClientRect();
      const width =
        Math.min(leftRect.right, rightRect.right) -
        Math.max(leftRect.left, rightRect.left);
      const height =
        Math.min(leftRect.bottom, rightRect.bottom) -
        Math.max(leftRect.top, rightRect.top);
      if (width > 4 && height > 4) {
        push(
          {
            code: "LAYOUT_OVERLAP",
            severity: "warning",
            message: `Layout objects overlap by ${Math.round(width)}x${Math.round(height)}px`,
          },
          right,
        );
      }
    }
  }
  return findings;
}
