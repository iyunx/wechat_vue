<template>
  <app-me-header v-if="state.currentTab === 'app-me'"></app-me-header>
  <app-header v-else :name='state.currentTitle' icon-add icon-search></app-header>
  <keep-alive>
    <component :is="state.currentTab" />
  </keep-alive>
  <app-footer :active='state.active' @change='onChange'></app-footer>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';
import AppHeader from './layout/header.vue';
import AppFooter from './layout/footer.vue';
import AppWechat from './wechat/index.vue';
import AppContact from './user/index.vue';
import AppFind from './find/index.vue';
import AppMe from './me/index.vue';
import AppMeHeader from './me/header.vue';

export default defineComponent({
  components: {
    AppHeader, AppFooter, AppWechat, AppContact, AppFind, AppMe, AppMeHeader
  },
  setup() {
    const state = reactive({
      active: 0,
      currentTab: 'app-wechat',
      currentTitle: '微信',
      tabs: ['app-wechat', 'app-contact', 'app-find', 'app-me'],
      title: ['微信', '通讯录', '发现', '我']
    })

    const onChange = (n: number) => {
      state.currentTab = state.tabs[n]
      state.active = n
      n < 3 && (state.currentTitle = state.title[n])
    };
    return {
      state,
      onChange
    }
  }
})

</script>

<style lang='less'>

</style>