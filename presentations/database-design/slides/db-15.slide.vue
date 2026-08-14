<template>
  <Slide class="db-slide">
    <div class="db-kicker">建模第 3 步 · 决定拆几张表</div>
    <h2 data-node="title">先拆出五张核心表，每张表只负责一种主要事实</h2>
    <div data-node="five-tables" class="db-grid-3" style="margin-top: 28px">
      <div class="db-card blue">
        <div class="db-label">01 · task_template</div>
        <h3>模板的稳定身份</h3>
        <p style="margin-top: 10px">
          保存模板编码、名称和启停状态。一个模板可以发布多个版本。
        </p>
      </div>
      <div class="db-card teal">
        <div class="db-label">02 · template_version</div>
        <h3>一次发布的内容</h3>
        <p style="margin-top: 10px">
          保存版本号、表单规则和配置规则；发布后保持不变。
        </p>
      </div>
      <div class="db-card orange">
        <div class="db-label">03 · task</div>
        <h3>用户的一次提交</h3>
        <p style="margin-top: 10px">
          保存项目、提交人、模板版本、名称、优先级和配置快照。
        </p>
      </div>
      <div class="db-card yellow">
        <div class="db-label">04 · task_input</div>
        <h3>任务的一条输入</h3>
        <p style="margin-top: 10px">
          一个任务可以有多条输入，每条有顺序、用途和来源快照。
        </p>
      </div>
      <div class="db-card red">
        <div class="db-label">05 · task_run</div>
        <h3>一次实际执行</h3>
        <p style="margin-top: 10px">
          每次重试新增一行，保存状态、时间、错误和外部任务编号。
        </p>
      </div>
      <div class="db-card">
        <div class="db-label">后续按需要增加</div>
        <h3>事件与文件表</h3>
        <p style="margin-top: 10px">
          需要过程审计时增加 run_event；一个运行产生多个文件时增加 artifact。
        </p>
      </div>
    </div>
    <div data-node="split-tests" class="db-grid-3" style="margin-top: 22px">
      <div class="db-note">
        <strong>数量：</strong
        >一个任务有多条输入、多次运行，所以输入和运行各自建子表。
      </div>
      <div class="db-note">
        <strong>变化：</strong
        >模板名称可修改，已发布版本保持稳定，所以模板与版本分开。
      </div>
      <div class="db-note">
        <strong>历史：</strong
        >每次运行的错误和时间都要保留，不能覆盖在任务主表中。
      </div>
    </div>
    <div class="db-band teal">
      <strong>拆表判断：</strong
      >同一对象下会出现多条，或某部分拥有独立生命周期、状态和历史，就适合独立成表。
    </div>
    <div class="db-footer">
      <span>字段多只是现象，数量和生命周期才是依据</span><span>15</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先给出最小核心结构。文件和事件作为按需求增加的表，降低初学者一次接受的复杂度。拆表依据只保留三项：数量、独立变化、历史保留。
</notes>
