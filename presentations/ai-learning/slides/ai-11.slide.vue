<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 实战总原则</div>
    <h2 data-node="title">先让 AI 知道“你是谁”，再让知识适应你的认知结构</h2>

    <div data-node="passport" class="ac-passport-stage">
      <Step :at="1">
        <section class="ac-passport">
          <h3>学习者护照</h3>
          <p>个性化第一次变得没有成本</p>
          <div class="ac-passport-fields">
            <div class="ac-passport-field">
              <b>基础</b><span>零基础 / 已写过一年 Python</span>
            </div>
            <div class="ac-passport-field">
              <b>目标</b><span>能上手改代码 / 彻底搞懂原理</span>
            </div>
            <div class="ac-passport-field">
              <b>偏好</b><span>直观类比 / 完整推导</span>
            </div>
          </div>
        </section>
      </Step>
      <Step :at="2">
        <section class="ac-menu">
          <div class="ac-menu-row">
            <b>先建立直觉</b><span>多用类比和生活化例子，先不要求数学严谨</span>
          </div>
          <div class="ac-menu-row">
            <b>有基础，要深入</b
            ><span>跳过入门，直接讲底层机制和 trade-off</span>
          </div>
          <div class="ac-menu-row">
            <b>时间紧</b><span>我只有 15 分钟，只给最小必需集</span>
          </div>
          <div class="ac-menu-row">
            <b>讲一遍没懂</b><span>换一种完全不同的讲法，不重复刚才角度</span>
          </div>
        </section>
      </Step>
    </div>
    <Step :at="3">
      <div class="ac-takeaway" style="margin-top: 17px">
        <strong>直觉先行，严谨随后。</strong>&nbsp;不声明背景，AI
        只能服务“一个平均水平的陌生人”。
      </div>
    </Step>
    <div class="ac-footer">
      <span>三 · 个性化原则</span><span>12 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
学习者护照是整页焦点。四种状态不是四张卡，而是一张按需点菜的菜单。
</notes>
