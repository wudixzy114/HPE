<template>
  <Slide class="slide" data-locked="true">
    <div class="top">
      <div class="kicker">三、上下文与记忆</div>
      <div class="chapter">12 / 49</div>
    </div>
    <h2 data-node="title">工具结果太长怎么办？</h2>
    <p data-node="subtitle" class="subtitle">
      第 07 页占用图里橙色 38%
      就是这块，最容易膨胀。工具一调完就地整理，别只等后面的压缩兜底。
    </p>
    <div
      data-node="grid-1"
      class="grid two"
      style="margin-top: 16px; grid-template-columns: 1.05fr 1fr"
    >
      <table data-node="matrix-1" class="matrix" style="margin-top: 0">
        <tr>
          <th>情况</th>
          <th>运行时怎么处理</th>
        </tr>
        <tr>
          <td>太长（大日志 / 大文件）</td>
          <td>
            完整结果落到文件，只回一句<code>(Output file has written to …)</code
            >，要用再按路径 Read 展开
          </td>
        </tr>
        <tr>
          <td>太短 / 为空</td>
          <td>
            补一个<b>明确信号</b>（如
            <code>(Bash completed with no output)</code
            >），别让模型以为工具没跑成
          </td>
        </tr>
        <tr>
          <td>二进制 / 图片</td>
          <td>不塞原始字节，转成一句<b>描述</b>（多少字节、什么类型）</td>
        </tr>
        <tr>
          <td>重复 / 刷屏日志</td>
          <td><b>去重、合并</b>同类行，只留代表 + 计数</td>
        </tr>
      </table>
      <div data-node="tool-eg-1" class="tool-eg">
        <div data-node="tool-eg-2" class="tool-eg-block long">
          <div class="eg-cap">
            <span class="eg-dot orange"></span>太长 · 落文件 + 留引用
          </div>
          <div data-node="code-1" class="code">
            <span class="c"
              ># grep 命中上千行，不整坨回填，运行时实际回一句：</span
            >
            <span class="k">(Output file has written to</span>
            <span class="s">/tmp/cc-grep-8f2.txt</span><span class="k">)</span>
            <span class="c"># 模型要细看再按这个路径 Read 展开</span>
          </div>
        </div>
        <div data-node="tool-eg-3" class="tool-eg-block short">
          <div class="eg-cap">
            <span class="eg-dot teal"></span>太短 / 空 · 给明确信号
          </div>
          <div data-node="code-2" class="code">
            <span class="c"
              ># 命令成功但没有 stdout，不回空串，运行时实际回：</span
            >
            <span class="k">(Bash completed with no output)</span>
            <span class="c"># 这样模型不会误以为工具没跑成</span>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <span>能无限膨胀的只有工具结果这一块；把它管住，窗口就稳了一大半</span
      ><span>12</span>
    </div>
  </Slide>
</template>

<notes lang="md">
这页只回答一件事：工具结果太长怎么办。先看左边四种情况的处理原则，重点讲太长和太短两行。右边给两个具体例子。太长：一次 grep 命中几百上千行，运行时不会把整坨塞回上下文，而是把完整结果落到一个文件里，只回一句 (Output file has written to …) 的引用，模型要细看再按路径展开——省下的就是第 07 页那 38%。太短或为空更容易被误判：命令成功但没有输出，如果只回一个空字符串，模型会以为工具没跑成，所以运行时会补一句明确信号，实际返回的就是 (Bash completed with no output)。把这两种都收拾干净，工具结果这块就不会失控。
</notes>
