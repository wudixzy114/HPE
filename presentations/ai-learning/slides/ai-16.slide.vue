<template>
  <Slide class="ac-slide">
    <div class="ac-kicker">三 · 已有高质量资料</div>
    <h2 data-node="title">
      有资料时，别让 AI 重新生成；让它围绕原文成为你的私教
    </h2>

    <div data-node="reading-map" class="ac-reading-map">
      <Step :at="1">
        <section class="ac-document">
          <h3>团队文档 / 内部 PPT / 好书</h3>
          <div class="ac-document-lines">
            <i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <div class="ac-takeaway" style="margin-top: 28px">
            有资料时不要再让 AI 凭空生成：它自己产出的内容可能混入幻觉；
            高质量的语料是稀缺资源，浪费掉太可惜。
          </div>
        </section>
      </Step>
      <Step :at="2">
        <section class="ac-route">
          <div class="ac-route-step">
            <b>01</b
            ><span
              ><strong>看结构：</strong>整体结构是什么，哪几部分是核心？</span
            >
          </div>
          <div class="ac-route-step">
            <b>02</b
            ><span><strong>定顺序：</strong>按我的基础，应该先读哪里？</span>
          </div>
          <div class="ac-route-step">
            <b>03</b
            ><span><strong>分轻重：</strong>重点啃哪里，哪些可以跳过？</span>
          </div>
          <div class="ac-route-step">
            <b>04</b
            ><span
              ><strong>声明基础：</strong
              >同一份资料，零基础和老兵的阅读地图应该完全不同。</span
            >
          </div>
        </section>
      </Step>
    </div>
    <Step :at="3">
      <div class="ac-prompt" style="margin-top: 16px">
        我要在两周内吃透这份文档 / PPT。请基于【贴入资料】告诉我：
        它的整体结构是什么？哪几部分是核心？以我的基础【声明背景】，应该按什么顺序读、重点啃哪里、哪些可以跳过？
      </div>
    </Step>
    <div class="ac-footer">
      <span>三 · 私教①快速问路</span><span>17 / 28</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先显示原始资料，再生成阅读路线。这页解决“PPT 太厚不知从哪啃起”的问题；个性化原则在私教模式同样适用。
</notes>
