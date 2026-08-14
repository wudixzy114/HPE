<template>
  <Slide class="db-slide">
    <div class="db-kicker">设计错误的实际后果</div>
    <h2 data-node="title">结构问题会在修改、插入、删除和扩展时反复出现</h2>
    <table
      data-node="design-consequences"
      class="db-table dense"
      style="margin-top: 25px"
    >
      <thead>
        <tr>
          <th>问题</th>
          <th>例子</th>
          <th>会发生什么</th>
          <th>对应改法</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>更新异常</strong></td>
          <td>每条任务重复保存 project_name</td>
          <td>项目改名需要批量更新，漏更新后出现多个名称</td>
          <td>项目名称只放 project</td>
        </tr>
        <tr>
          <td><strong>插入异常</strong></td>
          <td>模板信息只能跟任务一起保存</td>
          <td>没有任务时无法先创建模板，只能制造空记录</td>
          <td>模板独立成表</td>
        </tr>
        <tr>
          <td><strong>删除异常</strong></td>
          <td>项目资料只存在任务记录中</td>
          <td>删除最后一个任务时，项目资料也消失</td>
          <td>项目与任务分表</td>
        </tr>
        <tr>
          <td><strong>数量扩展困难</strong></td>
          <td>input_1、input_2、input_3</td>
          <td>增加第 4 个输入要改表、接口和代码</td>
          <td>task_input 多行保存</td>
        </tr>
        <tr>
          <td><strong>历史被覆盖</strong></td>
          <td>任务与每次运行共用一行</td>
          <td>重试覆盖第一次错误、时间和外部编号</td>
          <td>task 与 task_run 分开</td>
        </tr>
        <tr>
          <td><strong>查询口径混乱</strong></td>
          <td>所有字段都用 String 或 JSON</td>
          <td>不同服务各自解析，统计前需要大量清洗</td>
          <td>稳定字段使用准确类型和正常列</td>
        </tr>
      </tbody>
    </table>
    <div data-node="simple-summary" class="db-grid-3" style="margin-top: 22px">
      <div class="db-card teal">
        <div class="db-label">减少重复</div>
        <p>同一事实有一个主要来源。</p>
      </div>
      <div class="db-card blue">
        <div class="db-label">控制变化</div>
        <p>修改一个对象只影响对应表。</p>
      </div>
      <div class="db-card orange">
        <div class="db-label">支持增长</div>
        <p>新增多条数据时增加行，不增加固定列。</p>
      </div>
    </div>
    <div class="db-footer">
      <span>范式的价值体现在长期维护成本</span><span>24</span>
    </div>
  </Slide>
</template>

<notes lang="md">
将范式的价值落到六类具体问题。初学者不需要记“异常”术语的定义，只需能识别：改一处要改很多行、没有子记录时无法保存主数据、删除明细会带走主数据。
</notes>
