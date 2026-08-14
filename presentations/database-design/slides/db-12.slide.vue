<script setup lang="ts">
import DatabaseCaseStory from "./DatabaseCaseStory.vue";
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">完整案例 · 固定用户故事</div>
    <h2 data-node="title">先完整阅读 S1～S8，后续每一步都从这段文字推导</h2>
    <div data-node="full-story" style="margin-top: 19px">
      <DatabaseCaseStory class="db-case-story-full" />
    </div>
    <div class="db-footer">
      <span>后续演进页左侧固定显示同一份故事</span><span>12</span>
    </div>
  </Slide>
</template>

<notes lang="md">
先把故事自然讲完。S 编号只用于后续回溯，并不改变阅读顺序。后续每页左侧都固定显示同一份 S1～S8，右侧每次只完成一个建模动作。
</notes>
