<template>
  <Slide class="db-slide">
    <div class="db-kicker">范式的实际价值</div>
    <h2 data-node="title">
      不遵循范式，问题会分别出现在修改、并发、可靠性和扩展时
    </h2>
    <table
      data-node="normalization-consequences"
      class="db-table dense"
      style="margin-top: 22px"
    >
      <thead>
        <tr>
          <th>场景</th>
          <th>坏结构</th>
          <th>故障过程</th>
          <th>最终后果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>修改</strong></td>
          <td>每条任务重复 project_name</td>
          <td>项目改名需批量更新数百万任务；中途失败或漏更新</td>
          <td>同一项目出现多个名称，查询口径不一致</td>
        </tr>
        <tr>
          <td><strong>并发</strong></td>
          <td>任务行同时保存项目当前配额</td>
          <td>两个提交分别读旧配额并覆盖写入</td>
          <td>配额丢失更新或超额使用</td>
        </tr>
        <tr>
          <td><strong>可靠性</strong></td>
          <td>任务和运行共用一行</td>
          <td>重试覆盖第一次错误、外部 ID 和时间</td>
          <td>无法审计、排障、对账与恢复过程</td>
        </tr>
        <tr>
          <td><strong>扩展</strong></td>
          <td>input_1 / input_2 / input_3</td>
          <td>新增第 4 个输入需改表、接口、代码和历史兼容</td>
          <td>需求每次扩展都变成全链路结构变更</td>
        </tr>
        <tr>
          <td><strong>删除</strong></td>
          <td>模板信息只存在任务行</td>
          <td>删除最后一条任务时模板信息一起消失</td>
          <td>删除业务记录意外丢失另一类主数据</td>
        </tr>
        <tr>
          <td><strong>插入</strong></td>
          <td>项目信息依赖任务行存在</td>
          <td>项目尚未有任务时没有位置保存</td>
          <td>业务被迫创建假任务或允许大量空字段</td>
        </tr>
        <tr>
          <td><strong>改字段</strong></td>
          <td>所有动态参数都用 value_text</td>
          <td>将 timeout 从文本改整数，要清洗所有历史格式</td>
          <td>迁移无法判断“30s”“半小时”等原始意图</td>
        </tr>
      </tbody>
    </table>
    <div data-node="consequence-chain" class="db-band red">
      <strong>共同根因：</strong
      >不同事实被放在同一位置，或同一事实被放在多个位置；一旦多个请求、多个版本或多年数据同时存在，矛盾必然显现。
    </div>
    <div class="db-footer">
      <span>范式不是形式主义，而是在控制变化的影响范围</span><span>25</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页逐项回应为什么范式和并发、可靠性、扩展有关。范式本身不直接实现锁，但把权威事实集中到正确位置后，数据库才有可能用一行锁、唯一约束或事务保护它。结构错误会让一致性维护扩散到大量行和多个服务。
</notes>
