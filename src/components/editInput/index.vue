<template>
  <div
    contenteditable
    ref='inputRef'
    @input="inputBtn"
    @blur="emitBtn"
    class="edit-box"
    v-html='modelValue'
    v-dart-directive='null'
  >
  </div>
</template>

<script lang='ts' setup>
// vDartDirective vNameDirective
// 自定义指令引入方式1 import vDartDirective from ''
// 自定义指令引入方式2 import { dart as vDartDirective } from ''
import { ref } from 'vue';
import vDartDirective from './index';
import { editInputValue } from '../../views/wechat/footer/editInputFn'

defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'change', 'sendIsShow'])

const inputRef = ref<HTMLDivElement>()

const inputBtn = () => {
  let value = inputRef.value?.innerText.trim()
  if(value) {
    editInputValue.sendBtnShow = true
  } else {
    editInputValue.sendBtnShow = false
  }
}

const emitBtn = () => {
  const value = inputRef.value?.innerHTML
  let val = value?.toString()
  if(val){
    val = val.replace(/(&nbsp;|<br>)/g, '').replace(/(<div>)/g, '<p>').replace(/(<\/div>)/g, '<\/p>').replace(/(<p><\/p>)/g, '')
    emit('update:modelValue', val)
  }
}

</script>

<style lang='less' scoped>
.edit-box{
  // 目前只有webkit内核浏览器才支持read-write-plaintext-only这个值
  // -webkit-user-modify: read-write-plaintext-only;
  outline: none;
  border: none;
  min-height: 2rem;
  max-height: 6rem;
  padding: .4rem .6rem;
  box-sizing: border-box;
  background-color: white;
  border-radius: 4px;
  font-size: 14px;
  overflow-y: auto;
  word-break: break-all;
}
</style>