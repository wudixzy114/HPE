<template>
  <Slide class="db-slide">
    <div class="db-kicker">PRD 应写到什么程度</div>
    <h2 data-node="title">
      产品不必给最终 DDL，但必须把研发无法替你决定的业务语义写清
    </h2>
    <div data-node="prd-template" class="db-grid-2" style="margin-top: 22px">
      <div class="db-card teal">
        <div class="db-label">字段定义模板</div>
        <table class="db-table compact">
          <tbody>
            <tr>
              <td><strong>业务名称</strong></td>
              <td>优先级</td>
            </tr>
            <tr>
              <td><strong>业务含义</strong></td>
              <td>调度时的相对顺序，越大越优先</td>
            </tr>
            <tr>
              <td><strong>类型 / 单位</strong></td>
              <td>整数，无单位</td>
            </tr>
            <tr>
              <td><strong>必填 / 默认</strong></td>
              <td>必填，默认 50</td>
            </tr>
            <tr>
              <td><strong>取值范围</strong></td>
              <td>0～100</td>
            </tr>
            <tr>
              <td><strong>修改规则</strong></td>
              <td>排队前可改；运行后不可改</td>
            </tr>
            <tr>
              <td><strong>示例</strong></td>
              <td>80</td>
            </tr>
            <tr>
              <td><strong>敏感等级</strong></td>
              <td>内部</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="db-card blue">
        <div class="db-label">状态机定义模板</div>
        <table class="db-table compact">
          <thead>
            <tr>
              <th>当前</th>
              <th>事件</th>
              <th>下一状态</th>
              <th>失败处理</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>QUEUED</td>
              <td>开始回调</td>
              <td>RUNNING</td>
              <td>重复事件幂等返回</td>
            </tr>
            <tr>
              <td>RUNNING</td>
              <td>执行成功</td>
              <td>SUCCEEDED</td>
              <td>先记录产物再提交状态</td>
            </tr>
            <tr>
              <td>RUNNING</td>
              <td>用户取消</td>
              <td>CANCELLING</td>
              <td>等待外部确认</td>
            </tr>
            <tr>
              <td>SUCCEEDED</td>
              <td>旧运行回调</td>
              <td>禁止</td>
              <td>记录并忽略乱序事件</td>
            </tr>
          </tbody>
        </table>
        <div class="db-note" style="margin-top: 12px">
          <strong>还要写：</strong
          >谁可操作、前置条件、是否可重试、是否记录原因、重复请求与同键不同参数如何处理。
        </div>
      </div>
    </div>
    <div
      data-node="query-capacity-template"
      class="db-grid-2"
      style="margin-top: 17px"
    >
      <div class="db-note">
        <strong>查询模板：</strong
        >过滤条件、排序、分页、每页上限、是否立即可见、最大时间范围、导出方式。
      </div>
      <div class="db-note">
        <strong>容量模板：</strong>初始/年度行数、峰值读写
        QPS、保留期、响应目标、增长来源、是否允许延迟。
      </div>
    </div>
    <div class="db-band teal">
      <strong>产品负责定义“什么才算正确”：</strong
      >唯一范围、空值含义、状态变化、历史要求、冲突规则、查询口径和容量目标。
    </div>
    <div class="db-footer">
      <span>研发负责选择具体数据库实现，双方共同评审边界与代价</span
      ><span>35</span>
    </div>
  </Slide>
</template>

<notes lang="md">
产品无需决定 PostgreSQL 还是 MySQL 的所有语法，但唯一性范围、状态迁移、空值含义和历史需求属于业务决定，研发无法替代。字段定义不能只写 String；查询不能只写“支持筛选”；容量不能只写“数据量大”。
</notes>
