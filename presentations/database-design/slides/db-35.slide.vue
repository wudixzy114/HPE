<template>
  <Slide class="db-slide">
    <div class="db-kicker">PRD 应写到什么程度</div>
    <h2 data-node="title">产品需要写清业务语义，具体数据库语法由研发完成</h2>
    <div data-node="prd-template" class="db-grid-2" style="margin-top: 25px">
      <div class="db-card teal">
        <div class="db-label">字段说明示例</div>
        <table class="db-table compact">
          <tbody>
            <tr>
              <td><strong>字段名称</strong></td>
              <td>优先级</td>
            </tr>
            <tr>
              <td><strong>业务含义</strong></td>
              <td>任务排队时的相对顺序，数值越大越优先</td>
            </tr>
            <tr>
              <td><strong>类型 / 单位</strong></td>
              <td>整数，无单位</td>
            </tr>
            <tr>
              <td><strong>必填 / 默认值</strong></td>
              <td>必填，默认 50</td>
            </tr>
            <tr>
              <td><strong>取值范围</strong></td>
              <td>0～100</td>
            </tr>
            <tr>
              <td><strong>修改规则</strong></td>
              <td>排队前可改；开始运行后不可改</td>
            </tr>
            <tr>
              <td><strong>示例</strong></td>
              <td>80</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="db-card blue">
        <div class="db-label">表与关系说明示例</div>
        <table class="db-table compact">
          <tbody>
            <tr>
              <td><strong>对象</strong></td>
              <td>任务运行</td>
            </tr>
            <tr>
              <td><strong>一句定义</strong></td>
              <td>任务的一次实际执行尝试</td>
            </tr>
            <tr>
              <td><strong>数量关系</strong></td>
              <td>一个任务可以有多次运行</td>
            </tr>
            <tr>
              <td><strong>创建时机</strong></td>
              <td>首次提交或用户点击重试</td>
            </tr>
            <tr>
              <td><strong>修改规则</strong></td>
              <td>只允许按状态流程变化</td>
            </tr>
            <tr>
              <td><strong>删除 / 保留</strong></td>
              <td>用户归档任务后，运行记录仍按保留策略保存</td>
            </tr>
            <tr>
              <td><strong>主要查询</strong></td>
              <td>按 task_id 查询全部运行，按 attempt_no 排序</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div data-node="prd-four-parts" class="db-grid-4" style="margin-top: 22px">
      <div class="db-note">
        <strong>字段：</strong>含义、类型、长度、单位、空值、默认值。
      </div>
      <div class="db-note">
        <strong>关系：</strong>一条或多条，是否必须存在。
      </div>
      <div class="db-note"><strong>流程：</strong>状态如何变化，谁能操作。</div>
      <div class="db-note">
        <strong>规模：</strong>查询方式、数据量、分页和保留期。
      </div>
    </div>
    <div class="db-band teal">
      <strong>分工：</strong>产品定义业务规则和使用方式；研发选择 MySQL
      具体类型、约束、索引和实现方案；双方共同评审取舍。
    </div>
    <div class="db-footer">
      <span>PRD 中只写 String，无法表达完整字段规则</span><span>35</span>
    </div>
  </Slide>
</template>

<notes lang="md">
将 PRD 产物分成字段说明和对象关系说明。产品负责含义、数量、修改规则和查询方式；研发负责具体 DDL 和索引。双方对边界和代价共同确认。
</notes>
