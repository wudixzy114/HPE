/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "only-public-package-api",
      severity: "error",
      from: { path: "^(packages|app)/" },
      to: {
        path: "^packages/[^/]+/src/",
        pathNot: "^packages/[^/]+/src/index\\.ts$",
      },
    },
    {
      name: "schema-is-foundational",
      severity: "error",
      from: { path: "^packages/schema/src" },
      to: { path: "^packages/(runtime|renderer|compiler|checker|cli)" },
    },
    {
      name: "core-is-platform-free",
      severity: "error",
      from: { path: "^packages/runtime-core/src" },
      to: {
        path: "^(vue|playwright|vite|@vue|packages/(runtime-browser|renderer-vue|compiler|checker|cli))",
      },
    },
    {
      name: "browser-adapter-is-ui-free",
      severity: "error",
      from: { path: "^packages/runtime-browser/src" },
      to: {
        path: "^(vue|playwright|vite|@vue|packages/(renderer-vue|compiler|checker|cli))",
      },
    },
    {
      name: "renderer-does-not-own-platform-or-tools",
      severity: "error",
      from: { path: "^packages/renderer-vue/src" },
      to: {
        path: "^(playwright|vite|packages/(runtime-browser|compiler|checker|cli))",
      },
    },
    {
      name: "compiler-is-runtime-independent",
      severity: "error",
      from: { path: "^packages/compiler/src" },
      to: { path: "^packages/(runtime|renderer|checker|cli)" },
    },
    {
      name: "checker-is-renderer-independent",
      severity: "error",
      from: { path: "^packages/checker/src" },
      to: { path: "^packages/(runtime|renderer|compiler|cli)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)dist/" },
    tsConfig: { fileName: "tsconfig.base.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["types", "import", "default"],
    },
  },
};
