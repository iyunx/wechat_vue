<template>
  <aside class="add-overlay" v-show='modelValue' @click.stop="$emit('update:modelValue', false)">
    <ul class="add">
      <li>
        <router-link to='/room/launch'>
          <van-icon name="chat" />
          <span>发起群聊</span>
        </router-link>
      </li>
      <li>
        <router-link to='/user/search'>
          <van-icon name="add" />
          <span>添加朋友</span>
        </router-link>
      </li>
      <li>
        <van-icon name="expand" />
        <span>扫一扫</span>
      </li>
      <li>
        <van-icon name="gold-coin" />
        <span>收付款</span>
      </li>
      <li>
        <van-icon name="question" />
        <span>帮助与反馈</span>
      </li>
    </ul>
  </aside>
</template>

<script lang='ts' setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang='less' scoped>
.add-overlay{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 101;
}
.add{
  position: absolute;
  top: 55px;
  right: 10px;
  background-color: #4c4c4c;
  z-index: 102;
  padding: 10px 10px 12px;
  color: white;
  border-radius: 5px;
  li{
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #666;
    font-size: 18px;
    a{
      color: white;
    }
    span{
      flex: 1;
      margin-left: 10px;
      font-size: 14px;
      padding-right: 10px;
    }
    &:last-of-type{
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }
  &::before{
    content: '';
    position: absolute;
    top: -16px;
    right: 10px;
    border: 10px solid;
    border-color: transparent transparent #4c4c4c;
  }
}
</style>