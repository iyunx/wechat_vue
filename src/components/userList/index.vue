<template>
  <van-checkbox-group v-model="modelValue" @change="$emit('update:modelValue', modelValue)">
    <slot></slot>
  </van-checkbox-group>
</template>

<script lang='ts' setup>
import { PropType, ref } from 'vue'

defineProps({
  modelValue: {
    type: Array as PropType<number[]>,
    default: []
  }
})

</script>

<style lang='less' scoped>
.user-box{
  padding: 0 3%;
  margin-top: .8rem;
  .user-base{
    width: 100vw;
    display: flex;
    align-items: center;
    img{
      width: 2.6rem;
      height: 2.6rem;
      margin: 0 .6rem;
    }
    span{
      flex: 1;
      font-size: .9rem;
      padding: .8rem 0;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>