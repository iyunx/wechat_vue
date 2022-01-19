<template>
  <van-checkbox class="user-box" :name="user.id" :disabled="changeBool && user.isAdmin">
    <div class="user-base">
      <img :src="user.avatar">
      <span>{{user.name}}</span>
    </div>
  </van-checkbox>
</template>

<script lang='ts' setup>
import { PropType, ref } from 'vue'
type TUser = {
  id: number,
  name: string,
  avatar: string,
  isAdmin: boolean
}
const props = defineProps({
  user: {
    type: Object as PropType<TUser>,
    default(){
      return {
        id: 0,
        avatar: '',
        name: ''
      }
    }
  },
  changeBool: {
    type: Boolean,
    default: true
  }
})


const checked = ref(false)
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