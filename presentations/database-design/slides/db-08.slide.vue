<template>
  <Slide class="db-slide">
    <div class="db-kicker">状态字段 · 有限的业务阶段</div>
    <h2 data-node="title">状态字段包含三部分：稳定代码、允许变化、过程记录</h2>
    <div
      data-node="state-layout"
      class="db-grid-2"
      style="margin-top: 27px; grid-template-columns: 0.85fr 1.4fr"
    >
      <div class="db-card teal">
        <div class="db-label">1. 保存稳定代码</div>
        <div class="db-code">
          status VARCHAR(20)<br /><br /><span class="good">QUEUED</span
          ><br /><span class="good">RUNNING</span><br /><span class="good"
            >SUCCEEDED</span
          ><br /><span class="good">FAILED</span><br /><span class="good"
            >CANCELLED</span
          >
        </div>
        <p style="margin-top: 14px">
          数据库保存机器代码；页面根据语言展示“排队中”“运行中”等文案。
        </p>
      </div>
      <div>
        <div class="db-card blue">
          <div class="db-label">2. 画出允许变化</div>
          <div class="db-flow" style="margin-top: 16px">
            <div class="db-flow-node"><b>QUEUED</b><span>排队中</span></div>
            <div class="db-flow-arrow">→</div>
            <div class="db-flow-node"><b>RUNNING</b><span>运行中</span></div>
            <div class="db-flow-arrow">→</div>
            <div class="db-flow-node"><b>SUCCEEDED</b><span>成功</span></div>
          </div>
          <div class="db-grid-2" style="margin-top: 15px">
            <div class="db-note"><strong>允许：</strong>RUNNING → FAILED</div>
            <div class="db-note">
              <strong>禁止：</strong>SUCCEEDED → RUNNING
            </div>
          </div>
        </div>
        <div class="db-card orange" style="margin-top: 17px">
          <div class="db-label">3. 判断是否需要历史</div>
          <p>
            只关心当前状态：主表保存
            status。需要排障、审计或统计状态耗时：再增加事件表，记录变化时间、原状态、新状态和原因。
          </p>
        </div>
      </div>
    </div>
    <div data-node="status-vs-boolean" class="db-band red">
      <strong>布尔值适合两个答案：</strong>是否启用可以用
      BOOLEAN；排队、运行、成功、失败包含多个阶段，应使用一个状态字段。
    </div>
    <div class="db-footer">
      <span>状态值要有限、稳定、可解释</span><span>08</span>
    </div>
  </Slide>
</template>

<notes lang="md">
状态只讲三个动作：保存稳定代码、画允许变化、判断是否保存历史。页面文案可以多语言变化，数据库代码保持稳定。多个阶段使用一个状态字段，避免多个布尔字段组合出矛盾结果。
</notes>
