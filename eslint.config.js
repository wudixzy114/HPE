import eslint from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

const privateSourcePatterns = [
  "@hpe/*/src/**",
  "../*/src/**",
  "../../*/src/**",
];

function restrictedImports(packages) {
  return [
    "error",
    {
      paths: packages.map((name) => ({
        name,
        message: "This dependency points against the architecture layers.",
      })),
      patterns: [
        {
          group: [
            ...privateSourcePatterns,
            ...packages.map((name) => `${name}/**`),
          ],
          message:
            "Import only public exports and follow the architecture layers.",
        },
      ],
    },
  ];
}

export default tseslint.config(
  { ignores: ["**/dist/**", "**/coverage/**", "node_modules/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx,vue}"],
  })),
  ...pluginVue.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.vue"],
  })),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ["vitest.config.ts"] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...tseslint.configs.disableTypeChecked,
    files: ["vitest.config.ts"],
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".vue"],
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,vue}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "vue/html-closing-bracket-newline": "off",
      "vue/html-indent": "off",
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  },
  {
    files: ["app/slides/**/*.vue"],
    rules: { "vue/multi-word-component-names": "off" },
  },
  {
    files: ["packages/schema/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/runtime-core",
        "@hpe/runtime-browser",
        "@hpe/renderer-vue",
        "@hpe/compiler",
        "@hpe/checker",
        "@hpe/cli",
      ]),
    },
  },
  {
    files: ["packages/runtime-core/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/runtime-browser",
        "@hpe/renderer-vue",
        "@hpe/compiler",
        "@hpe/checker",
        "@hpe/cli",
      ]),
    },
  },
  {
    files: ["packages/runtime-browser/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/schema",
        "@hpe/renderer-vue",
        "@hpe/compiler",
        "@hpe/checker",
        "@hpe/cli",
      ]),
    },
  },
  {
    files: ["packages/renderer-vue/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/schema",
        "@hpe/runtime-browser",
        "@hpe/compiler",
        "@hpe/checker",
        "@hpe/cli",
      ]),
    },
  },
  {
    files: ["packages/compiler/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/runtime-core",
        "@hpe/runtime-browser",
        "@hpe/renderer-vue",
        "@hpe/checker",
        "@hpe/cli",
      ]),
    },
  },
  {
    files: ["packages/checker/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/runtime-core",
        "@hpe/runtime-browser",
        "@hpe/renderer-vue",
        "@hpe/compiler",
        "@hpe/cli",
      ]),
    },
  },
  {
    files: ["packages/cli/src/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports([
        "@hpe/runtime-core",
        "@hpe/runtime-browser",
        "@hpe/renderer-vue",
      ]),
    },
  },
  {
    files: ["app/**/*.{ts,vue}"],
    rules: { "no-restricted-imports": restrictedImports([]) },
  },
  {
    files: ["*.config.{js,cjs,ts}", "eslint.config.js"],
    languageOptions: { globals: { module: "readonly" } },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
);
