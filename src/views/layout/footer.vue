<template>
  <van-config-provider :theme-vars="footerTheme">
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item :icon="active === 0 ? 'chat' : 'chat-o'" :badge="roomlistArr.count ? roomlistArr.count : ''">微信</van-tabbar-item>
      <van-tabbar-item :icon="active === 1 ? 'friends' : 'friends-o'" :badge="remindArr.size ? remindArr.size : ''">通讯录</van-tabbar-item>
      <van-tabbar-item :icon="active === 2 ? 'eye' : 'eye-o'">发现</van-tabbar-item>
      <van-tabbar-item :icon="active === 3 ? 'manager' : 'manager-o'">我</van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
</template>

<script lang='ts' setup>
import { remindArr, roomlistArr } from '../../api/socket'
defineProps({
  active: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const footerTheme = {
  tabbarBackgroundColor: '#f7f7f7',
  tabbarItemActiveBackgroundColor: '#f7f7f7',
  tabbarItemActiveColor: '#07c160'
}

const onChange = (index: number) => {
  emit('change', index)
}
</script>

<style lang='less' scoped>
</style>