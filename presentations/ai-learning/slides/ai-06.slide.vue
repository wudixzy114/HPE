<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">二 · 案例</div>
    <h2 data-node="title">
      TCP 建立连接为什么是三次握手，不是两次，也不是四次？
    </h2>

    <div data-node="sequence" class="ac-sequence ac-glass">
      <section class="ac-actor">
        <div class="ac-actor-icon">A</div>
        <b>发起方</b>
        <div class="ac-lifeline" />
      </section>
      <section class="ac-messages">
        <Step :at="1">
          <div class="ac-message">SYN · A 告诉 B：我能发送</div>
        </Step>
        <Step :at="2">
          <div class="ac-message back">
            SYN / ACK · B 证明：我能接收，也能发送
          </div>
        </Step>
        <Step :at="3">
          <div class="ac-message">ACK · A 确认：我能接收你的回复</div>
        </Step>
      </section>
      <section class="ac-actor">
        <div class="ac-actor-icon">B</div>
        <b>接收方</b>
        <div class="ac-lifeline" />
      </section>
    </div>

    <Step :at="4">
      <div data-node="essence" class="ac-protocol-reveal">
        <span class="ac-chip">两次不够：历史重复报文可能制造假连接</span>
        <b>在不可靠的信道上，以最小代价让双方确认彼此的收发能力</b>
        <span class="ac-chip">四次浪费：三次已完成最小双向确认</span>
      </div>
      <div class="ac-takeaway" style="margin-top: 14px">
        抓住这个本质，分布式心跳、Web3
        共识、陌生人互道“你好”，都会显现出同一根树干。
      </div>
    </Step>
    <div class="ac-footer">
      <span>二 · TCP 三次握手</span><span>07 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
前三步只讲通信过程。三次握手全部走完后，第四步才揭示“两次为什么不够、四次为什么浪费”和最小双向确认的本质。
</notes>
