<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">五 · 出路二</div>
    <h2 data-node="title">深度给护城河，广度给杠杆；乘积才是超级个体</h2>

    <div data-node="axis" class="ac-axis-stage ac-axis-stage--stable">
      <span class="ac-axis-label-y">深度 · 一手上下文与底层权衡</span>
      <span class="ac-axis-label-x">广度 · 跨界模型与提问燃料</span>

      <Step :at="1" class="ac-axis-slot depth">
        <section class="ac-axis-quadrant">
          <b>深度阵地</b>
          <p>
            AI 能讲清“三次握手是什么”，但“为什么恰好是三次”的工程权衡，
            以及它在你们系统里的真实代价，只有一手上下文里才有。
          </p>
        </section>
      </Step>

      <Step :at="2" class="ac-axis-slot breadth">
        <section class="ac-axis-quadrant">
          <b>广度杠杆</b>
          <p>
            能问出“用负反馈解释习惯养成”，前提是脑中同时装着控制论和戒烟问题。
            广度是提问的燃料。
          </p>
        </section>
      </Step>

      <Step :at="3" class="ac-axis-slot super">
        <section class="ac-axis-quadrant">
          <b>深度 × 广度</b>
          <p>
            既能钻到通用语料够不到的地方，又能把不同领域连接成新解法——乘积才形成超级个体。
          </p>
        </section>
      </Step>
    </div>

    <div class="ac-takeaway" style="margin-top: 18px">
      AI 的水位线是“平均”：对许多领域懂 80
      分，却没有你的战场上下文，也无法替你提出真正独特的问题。
    </div>
    <div class="ac-footer">
      <span>五 · 深度与广度</span><span>26 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
初始状态只有坐标轴。第一次点击出现左上“深度”，第二次出现右下“广度”，第三次出现右上“深度 × 广度”。三个 Step 外壳都固定在最终坐标，不发生位移。
</notes>
