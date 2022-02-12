<template>
  <article v-if='modelValue' class="promise">
    <app-header name="朋友权限">
      <template v-slot:left>
        <van-icon name="arrow-left" @click="$emit('update:modelValue', false)" />
      </template>
      <template #right>
        <van-button type="success" size="mini" @click="change">保存</van-button>
      </template>
    </app-header>
    <section class="promise-info">
      <ul>
        <aside>设置朋友权限</aside>
        <li @click="info.circle = true">
          <span>聊天、朋友圈、微信运动等</span>
          <van-icon v-show='info.circle' color="green" name="arrow" />
        </li>
        <li @click="circleBtn">
          <span>仅聊天</span>
          <van-icon v-show='!info.circle' color="green" name="arrow" />
        </li>
      </ul>
      <ul v-show='info.circle'>
        <aside>朋友圈状态</aside>
        <li>
          <span>不让他（她）看</span>
          <van-switch v-model="info.seeme" size="24px" />
        </li>
        <li>
          <span>不看他（她）</span>
          <van-switch v-model="info.seeyou" size="24px" />
        </li>
      </ul>
      
      <ul v-show='!info.circle'>
        <aside>对方看不到你的朋友圈、状态、微信运动等</aside>
      </ul>
    </section>
  </article>
</template>

<script lang='ts' setup>
import AppHeader from '../../views/layout/header.vue'
import { reactive, onMounted, onUnmounted } from 'vue'
const props = defineProps({
  modelValue: Boolean,
})
const emits = defineEmits(['update:modelValue', 'change'])

const info = reactive<{[ket:string]: any}>({
  circle: true,
  seeme: false,
  seeyou: false,
})

const change = () => {
  emits('change', info)
  emits('update:modelValue', false)
}

const circleBtn = () => {
  info.circle = false
  info.seeme = false
  info.seeyou = false
}

onUnmounted(() => {
  if(props.modelValue) {
    emits('update:modelValue', false)
  }
})
</script>

<style lang='less' scoped>
.promise{
  position: absolute;
  background-color: #eee;
  inset: 0;
  .promise-info{
    margin-top: 3rem;
    ul{
      aside{
        padding: 1rem 4% .4rem;
        font-size: .8rem;
      }
      li{
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .9rem;
        padding: .8rem 4%;
        &:last-of-type{
          border-top: 1px solid #f1f1f1;
        }
      }
    }
  }
}
</style>