<template>
  <Slide class="db-slide">
    <div class="db-kicker">完整案例 · 用户故事 2/3</div>
    <h2 data-node="title">任务提交后：排队、运行、失败、取消与重试</h2>
    <div data-node="story-run" class="db-grid-2" style="margin-top: 22px">
      <div class="db-story">
        <p>
          <span class="db-badge orange">13</span>
          首次提交会创建第一次执行尝试，并发送给外部调度系统。
        </p>
        <p>
          <span class="db-badge orange">14</span> 调度系统返回外部任务
          ID；同一外部 ID 不能关联两次运行。
        </p>
        <p>
          <span class="db-badge orange">15</span>
          一次运行依次经历待提交、排队、运行、成功或失败等状态。
        </p>
        <p>
          <span class="db-badge orange">16</span>
          用户可以在允许的状态下取消；取消请求发出后还要等待外部确认。
        </p>
        <p>
          <span class="db-badge orange">17</span>
          外部回调可能重复、乱序、延迟，甚至先成功后又收到旧的运行中事件。
        </p>
        <p>
          <span class="db-badge orange">18</span>
          系统超时扫描与用户取消可能同时更新同一次运行。
        </p>
      </div>
      <div class="db-story">
        <p>
          <span class="db-badge red">19</span>
          运行失败后可使用完全相同配置重试；每次重试有独立尝试序号。
        </p>
        <p>
          <span class="db-badge red">20</span>
          每次运行都保留队列、开始结束时间、错误码、错误摘要和外部任务 ID。
        </p>
        <p>
          <span class="db-badge red">21</span>
          用户修改输入或参数后重新提交，应创建新任务，并记录来源任务。
        </p>
        <p>
          <span class="db-badge red">22</span>
          每次运行可产生多个日志、报表或数据文件，文件存对象存储。
        </p>
        <p>
          <span class="db-badge red">23</span> 数据库只保存对象
          key、类型、大小、哈希和创建时间。
        </p>
        <p>
          <span class="db-badge red">24</span>
          需要统计成功率、重试次数、排队时长、运行时长和失败原因。
        </p>
      </div>
    </div>
    <div class="db-band red">
      <strong>这里已经出现三个不同概念：</strong
      >用户的一次提交、一次实际执行、一次状态变化。混成一行一定会覆盖历史。
    </div>
    <div class="db-footer">
      <span>异常流程比正常流程更能暴露表结构问题</span><span>13</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这部分需求专门用于拆出 task、task_run 和 task_run_event。重复回调要求事件去重；乱序回调要求状态迁移规则；修改后重提与相同配置重试是两个不同业务动作。产物文件不直接塞入核心业务表。
</notes>
