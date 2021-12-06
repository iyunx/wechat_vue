<template>
  <article v-if='modelValue' class="remark">
    <app-header header-bg-color>
      <template v-slot:left>
        <van-icon name="arrow-left" @click="$emit('update:modelValue', false)" />
      </template>
      <template #right>
        <van-button type="success" size="mini" @click="changeBtn">保存</van-button>
      </template>
    </app-header>
    <section class="remark-base">
      <h3>设置备注和标签</h3>
      <form @submit.prevent="">
        <div class="item">
          <span>备注</span>
          <input name="rname" class="bg" :value='rname' @input="rnameInput" type="text">
        </div>
        <div class="item">
          <span>手机号</span>
          <input name="rphone" class="bg" :value='rphone' @input="rphoneInput" type="text" placeholder="手机号">
        </div>
        <div class="item">
          <span>标签</span>
          <input class="bg" type="text" placeholder="未开发">
        </div>
        <div class="item">
          <span>描述</span>
          <textarea class="bg" width=100% rows="4" :value='text' @input="remarkInput"></textarea>
        </div>
      </form>
    </section>
  </article>
</template>

<script lang='ts' setup>
import AppHeader from '../../views/layout/header.vue'
import { reactive, PropType } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  rname: {
    type: String,
    default: ''
  },
  rphone: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})

const emits = defineEmits([
  'update:modelValue',
  'update:rname',
  'update:rphone',
  'update:text',
  'change'
])

const rnameInput = (e: Event) => {
  let input = e.target as HTMLInputElement
  emits('update:rname', input.value)
}

const rphoneInput = (e: Event) => {
  let input = e.target as HTMLInputElement
  emits('update:rphone', input.value)
}

const remarkInput = (e: Event) => {
  let input = e.target as HTMLInputElement
  emits('update:text', input.value)
}

const changeBtn = () => {
  emits('change', '')
  emits('update:modelValue', false)
}

</script>

<style lang='less' scoped>
.remark{
  background-color: white;
  position: absolute;
  inset: 0;
  .remark-base{
    margin-top: 5rem;
    padding: 0 4%;
    h3{
      text-align: center;
      font-weight: 600;
    }
    .item{
      display: flex;
      flex-direction: column;
      span{
        font-size: .8rem;
        color: #666;
        margin-bottom: .3rem;
        margin-top: 1rem;
      }
      .bg{
        background-color: #f6f6f6;
        outline: none;
        border: none;
        padding: .8rem;
        border-radius: .3rem;
        font-size: .8rem;
        resize: none;
      }
    }
  }
}
</style>