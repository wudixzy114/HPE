<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模步骤 2 · 决定哪些对象独立成表</div>
    <h2 data-node="title">
      一个概念有独立身份、数量或生命周期时，才值得成为独立实体
    </h2>
    <table
      data-node="entity-decision-table"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>候选概念</th>
          <th>独立身份？</th>
          <th>独立生命周期 / 数量？</th>
          <th>判断</th>
          <th>为什么</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>模板</strong></td>
          <td>有稳定编码</td>
          <td>启用、停用；拥有多个版本</td>
          <td>独立表</td>
          <td>稳定身份与版本内容的生命周期不同</td>
        </tr>
        <tr>
          <td><strong>模板版本</strong></td>
          <td>模板内版本号</td>
          <td>发布后不可变</td>
          <td>独立表</td>
          <td>历史任务必须精确引用某个版本</td>
        </tr>
        <tr>
          <td><strong>任务</strong></td>
          <td>有内部与公开 ID</td>
          <td>一次业务提交</td>
          <td>独立表</td>
          <td>承载提交快照、归属和当前汇总状态</td>
        </tr>
        <tr>
          <td><strong>输入</strong></td>
          <td>任务内序号</td>
          <td>一个任务可以有多个</td>
          <td>子表</td>
          <td>数量不固定，并且每个输入有用途和快照</td>
        </tr>
        <tr>
          <td><strong>运行</strong></td>
          <td>独立运行 ID</td>
          <td>一次任务可重试多次</td>
          <td>独立子表</td>
          <td>每次有自己的状态、时间、错误和外部 ID</td>
        </tr>
        <tr>
          <td><strong>运行事件</strong></td>
          <td>事件 ID / 外部事件 ID</td>
          <td>只追加，不覆盖</td>
          <td>事件表</td>
          <td>支持去重、审计、乱序判断和耗时分析</td>
        </tr>
        <tr>
          <td><strong>优先级</strong></td>
          <td>无</td>
          <td>随任务一起变化</td>
          <td>任务字段</td>
          <td>它只是任务的一项属性</td>
        </tr>
      </tbody>
    </table>
    <div data-node="entity-tests" class="db-grid-3" style="margin-top: 17px">
      <div class="db-note">
        <strong>身份测试：</strong>它是否需要被别的记录单独引用？是否需要稳定
        ID？
      </div>
      <div class="db-note">
        <strong>数量测试：</strong>一个父对象下会不会出现 0、1、N 条？N
        条通常意味着子表。
      </div>
      <div class="db-note">
        <strong>生命周期测试：</strong
        >是否独立创建、修改、删除、归档、授权或保留历史？
      </div>
    </div>
    <div class="db-footer">
      <span>字段多不是拆表理由，独立性才是</span><span>16</span>
    </div>
  </Slide>
</template>

<notes lang="md">
逐个判断候选概念。模板与模板版本拆开，不是因为字段多，而是版本发布后不可变，模板本身还能继续启停和发布新版本。优先级没有独立身份和生命周期，因此只是任务字段。
</notes>
