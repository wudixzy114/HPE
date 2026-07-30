# HTML PPT Engine Research

这个仓库用于沉淀 HTML PPT 引擎的竞品调研、技术选型与后续原型。

## 当前结论

- 播放内核优先研究 [Reveal.js](https://revealjs.com/)，它的浏览器运行时、演讲者视图、插件机制和打印链路最完整。
- 面向开发者的完整产品形态优先研究 [Slidev](https://sli.dev/)；Markdown 到多格式产物的编译链路优先研究 [Marp](https://marp.app/)。
- 如果目标包含类似 PowerPoint 的可视化编辑器，优先研究 [Strut](https://strut.io/) 的交互和数据模型，但其 AGPL-3.0 许可证不适合未经评估直接嵌入闭源产品。
- 目前没有一个宽松许可证项目同时成熟覆盖“可视化编辑、播放、协作、HTML/PDF/PPTX 高保真导出”。合理路线是组合成熟组件，并保持自己的文档模型。

## 文档

- [开源项目调研与技术建议](docs/open-source-landscape.md)
- [项目元数据快照](data/projects.json)

调研快照日期：2026-07-30。
