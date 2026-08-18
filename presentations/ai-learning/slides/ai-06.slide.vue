<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 案例</div>
    <h2 data-node="title">
      TCP 三次握手：背流程，还是理解“最小代价的双向确认”
    </h2>

    <div data-node="sequence" class="ac-sequence ac-glass">
      <section class="ac-actor">
        <div class="ac-actor-icon">A</div>
        <b>发起方</b>
        <div class="ac-lifeline" />
      </section>
      <section class="ac-messages">
        <Step :at="1"><div class="ac-message">SYN · 我能发送</div></Step>
        <Step :at="2">
          <div class="ac-message back">SYN / ACK · 我能收，也能发</div>
        </Step>
        <Step :at="3"><div class="ac-message">ACK · 我确认你能发</div></Step>
      </section>
      <section class="ac-actor">
        <div class="ac-actor-icon">B</div>
        <b>接收方</b>
        <div class="ac-lifeline" />
      </section>
    </div>

    <div data-node="essence" class="ac-protocol-essence">
      <span class="ac-chip">两次不够：历史报文会制造假连接</span>
      <b>在不可靠信道上，以最小代价确认双方收发能力</b>
      <span class="ac-chip">四次浪费：三次已完成最小确认</span>
    </div>
    <div class="ac-takeaway" style="margin-top: 16px">
      抓住这根树干，心跳检测、共识机制、陌生人互道“你好”都会自动连成同一个模型。
    </div>
    <div class="ac-footer">
      <span>二 · TCP 三次握手</span><span>07 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
三次消息依次出现。不要停留在协议细节，核心是“最小代价的双向确认”。
</notes>
