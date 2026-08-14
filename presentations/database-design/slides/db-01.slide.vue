<template>
  <Slide class="db-slide">
    <div class="db-kicker">学习路径</div>
    <h2 data-node="title">先认识数据库能存什么，再学习怎样把业务放进去</h2>
    <div data-node="learning-path" class="db-flow" style="margin-top: 38px">
      <div class="db-flow-node" style="border-color: #79bdb4">
        <b>① 类型全景</b><span>数字、文本、时间、真假、JSON</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>② 常用字段</b><span>ID、名称、状态、空值、公共字段</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>③ 业务建模</b><span>从一段用户故事拆出表与关系</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>④ 设计原则</b><span>用 1NF～3NF 检查重复与依赖</span>
      </div>
      <div class="db-flow-arrow">→</div>
      <div class="db-flow-node">
        <b>⑤ 正确与好用</b><span>约束、防重复、索引与性能边界</span>
      </div>
    </div>
    <div data-node="questions" class="db-grid-3" style="margin-top: 32px">
      <div class="db-card teal">
        <div class="db-label">字段层</div>
        <h3>这个值是什么？</h3>
        <p style="margin-top: 10px">
          它需要计算、排序、比较、校验，还是只用于识别？
        </p>
      </div>
      <div class="db-card blue">
        <div class="db-label">表结构层</div>
        <h3>这个事实属于谁？</h3>
        <p style="margin-top: 10px">
          一个对象有几条？是否独立变化？需不需要保存历史？
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">运行层</div>
        <h3>多人同时操作会怎样？</h3>
        <p style="margin-top: 10px">
          能否重复、覆盖或关联错误？高频查询能否稳定运行？
        </p>
      </div>
    </div>
    <div class="db-band">
      <strong>全程使用同一个中台案例：</strong
      >从用户提交任务开始，一步一步得到最终数据库结构。
    </div>
    <div class="db-footer">
      <span>课程结构：基础 → 选择 → 建模 → 检查 → 运行</span><span>01</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页帮助基础较少的听众建立顺序。先认识数据库类型，再处理 ID、状态等高频字段；随后进入完整案例，最后用范式和约束检查。每一层只增加少量新概念。
</notes>
