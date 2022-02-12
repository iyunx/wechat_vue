<template>
  <app-me-header v-if="state.actived === 3"></app-me-header>
  <app-header v-else :name='state.currentTitle' icon-add icon-search></app-header>
  <keep-alive>
    <component :is="currentTab[state.actived]" />
  </keep-alive>
  <app-footer :actived="state.actived" @upActive="upActive"></app-footer>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import AppHeader from './layout/header.vue';
import AppFooter from './layout/footer.vue';
import AppWechat from './wechat/index.vue';
import AppContact from './user/index.vue';
import AppFind from './find/index.vue';
import AppMe from './me/index.vue';
import AppMeHeader from './me/header.vue';

const currentTab = [AppWechat, AppContact, AppFind, AppMe]
const title = ['微信', '通讯录', '发现', '我']

const state = reactive({
  actived: 0,
  currentTitle: title[0],
})

const upActive = (n: number) => {
  state.actived = n
  n < 3 && (state.currentTitle = title[n])
}
</script>

<style lang='less'>

</style>