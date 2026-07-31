import { parseExpression } from "@babel/parser";
import * as t from "@babel/types";
import {
  NodeTypes,
  type AttributeNode,
  type DirectiveNode,
  type ElementNode,
  type RootNode,
  type TemplateChildNode,
} from "@vue/compiler-core";

import type { SourceLocation } from "@hpe/schema";

import type { CompilationIssue } from "./diagnostics.js";

export interface TemplateAssetReference {
  readonly value: string;
  readonly source: SourceLocation;
}

export interface TemplateAnalysis {
  readonly nodes: Readonly<Record<string, SourceLocation>>;
  readonly assets: readonly TemplateAssetReference[];
  readonly inlineStyles: readonly TemplateAssetReference[];
  readonly issues: readonly CompilationIssue[];
}

const ASSET_ATTRIBUTES = new Map<string, ReadonlySet<string>>([
  ["img", new Set(["src", "srcset"])],
  ["video", new Set(["src", "poster"])],
  ["audio", new Set(["src"])],
  ["source", new Set(["src", "srcset"])],
  ["track", new Set(["src"])],
  ["object", new Set(["data"])],
  ["image", new Set(["href", "xlink:href"])],
  ["use", new Set(["href", "xlink:href"])],
]);

function sourceLocation(
  file: string,
  node: { loc: { start: { line: number; column: number } } },
): SourceLocation {
  return { file, line: node.loc.start.line, column: node.loc.start.column };
}

export function walkTemplateElements(
  root: RootNode,
  visit: (element: ElementNode) => void,
): void {
  const walkChildren = (children: readonly TemplateChildNode[]): void => {
    for (const child of children) {
      if (child.type === NodeTypes.ELEMENT) {
        visit(child);
        walkChildren(child.children);
      } else if (child.type === NodeTypes.IF) {
        for (const branch of child.branches) walkChildren(branch.children);
      } else if (child.type === NodeTypes.FOR) {
        walkChildren(child.children);
      }
    }
  };
  walkChildren(root.children);
}

function staticAttribute(
  element: ElementNode,
  name: string,
): AttributeNode | undefined {
  return element.props.find(
    (property): property is AttributeNode =>
      property.type === NodeTypes.ATTRIBUTE && property.name === name,
  );
}

function directiveArgument(property: DirectiveNode): string | undefined {
  return property.arg?.type === NodeTypes.SIMPLE_EXPRESSION &&
    property.arg.isStatic
    ? property.arg.content
    : undefined;
}

function isStaticClassExpression(node: t.Node | null | undefined): boolean {
  if (!node) return false;
  if (
    t.isStringLiteral(node) ||
    t.isBooleanLiteral(node) ||
    t.isNullLiteral(node) ||
    t.isNumericLiteral(node)
  ) {
    return true;
  }
  if (t.isTemplateLiteral(node)) return node.expressions.length === 0;
  if (t.isArrayExpression(node)) {
    return node.elements.every(
      (element) =>
        element === null ||
        (!t.isSpreadElement(element) && isStaticClassExpression(element)),
    );
  }
  if (t.isObjectExpression(node)) {
    return node.properties.every((property) => {
      if (!t.isObjectProperty(property) && !t.isObjectMethod(property))
        return false;
      return (
        !property.computed &&
        (t.isIdentifier(property.key) || t.isStringLiteral(property.key))
      );
    });
  }
  if (t.isConditionalExpression(node)) {
    return (
      isStaticClassExpression(node.consequent) &&
      isStaticClassExpression(node.alternate)
    );
  }
  if (t.isLogicalExpression(node)) return isStaticClassExpression(node.right);
  if (
    t.isTSAsExpression(node) ||
    t.isTSTypeAssertion(node) ||
    t.isTSNonNullExpression(node)
  ) {
    return isStaticClassExpression(node.expression);
  }
  if (t.isParenthesizedExpression(node))
    return isStaticClassExpression(node.expression);
  return false;
}

function validateClassBinding(
  property: DirectiveNode,
  file: string,
  slideId: string,
): CompilationIssue | undefined {
  const expression =
    property.exp?.type === NodeTypes.SIMPLE_EXPRESSION
      ? property.exp.content
      : undefined;
  if (!expression) {
    return {
      code: "DYNAMIC_CLASS_UNSCANNABLE",
      message: "Class bindings must enumerate every Tailwind class statically",
      slideId,
      source: sourceLocation(file, property),
    };
  }
  try {
    const ast = parseExpression(expression, { plugins: ["typescript"] });
    if (isStaticClassExpression(ast)) return undefined;
  } catch {
    // Report the same stable diagnostic below.
  }
  return {
    code: "DYNAMIC_CLASS_UNSCANNABLE",
    message:
      "Class bindings may use static strings, arrays, objects or conditionals; concatenation and computed classes are forbidden",
    slideId,
    source: sourceLocation(file, property),
  };
}

function splitSrcset(value: string): readonly string[] {
  if (value.trimStart().startsWith("data:")) return [value.trim()];
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/u)[0])
    .filter((candidate): candidate is string => Boolean(candidate));
}

export function analyzeTemplate(
  root: RootNode,
  file: string,
  slideId: string,
): TemplateAnalysis {
  const nodes: Record<string, SourceLocation> = {};
  const assets: TemplateAssetReference[] = [];
  const inlineStyles: TemplateAssetReference[] = [];
  const issues: CompilationIssue[] = [];

  walkTemplateElements(root, (element) => {
    const dataNode = staticAttribute(element, "data-node");
    if (dataNode) {
      const id = dataNode.value?.content.trim();
      if (!id) {
        issues.push({
          code: "NODE_ID_EMPTY",
          message: "data-node must contain a stable identifier",
          slideId,
          source: sourceLocation(file, dataNode),
        });
      } else if (nodes[id]) {
        issues.push({
          code: "NODE_ID_DUPLICATE",
          message: `Duplicate data-node identifier: ${id}`,
          slideId,
          source: sourceLocation(file, dataNode),
        });
      } else {
        nodes[id] = sourceLocation(file, dataNode);
      }
    }

    for (const property of element.props) {
      if (property.type !== NodeTypes.DIRECTIVE || property.name !== "bind")
        continue;
      const argument = directiveArgument(property);
      if (argument === undefined) {
        issues.push({
          code: "DYNAMIC_ATTRIBUTE_SPREAD",
          message:
            "v-bind object spreads are forbidden on slide layout elements",
          slideId,
          source: sourceLocation(file, property),
        });
      } else if (argument === "data-node") {
        issues.push({
          code: "NODE_ID_DYNAMIC",
          message: "data-node must be a static attribute",
          slideId,
          source: sourceLocation(file, property),
        });
      } else if (argument === "class") {
        const issue = validateClassBinding(property, file, slideId);
        if (issue) issues.push(issue);
      }
    }

    const style = staticAttribute(element, "style");
    if (style?.value) {
      inlineStyles.push({
        value: style.value.content,
        source: sourceLocation(file, style.value),
      });
    }

    const assetAttributes = ASSET_ATTRIBUTES.get(element.tag.toLowerCase());
    if (assetAttributes) {
      for (const property of element.props) {
        if (
          property.type === NodeTypes.DIRECTIVE &&
          property.name === "bind" &&
          assetAttributes.has(directiveArgument(property) ?? "")
        ) {
          issues.push({
            code: "DYNAMIC_ASSET_REFERENCE",
            message:
              "Layout assets must use static paths so they can be validated and bundled",
            slideId,
            source: sourceLocation(file, property),
          });
        }
      }
      for (const name of assetAttributes) {
        const attribute = staticAttribute(element, name);
        if (!attribute?.value) continue;
        const values =
          name === "srcset"
            ? splitSrcset(attribute.value.content)
            : [attribute.value.content];
        for (const value of values) {
          assets.push({ value, source: sourceLocation(file, attribute) });
        }
      }
    }
  });
  return { nodes, assets, inlineStyles, issues };
}

export function getStaticAttribute(
  element: ElementNode,
  name: string,
): string | undefined {
  return staticAttribute(element, name)?.value?.content;
}
