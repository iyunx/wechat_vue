<template>
  <ul class="user-box">
    <template v-for="user in users">
      <li class="user-base" >
        <img :src="user.avatar">
        <span>{{user.name}}</span>
      </li>
    </template>
  </ul>
</template>

<script lang='ts' setup>
import { PropType, reactive } from 'vue'
const props = defineProps({
  users: {
    type: Array as PropType<{id: number, name: string, avatar: string}[]>,
    default(){
      return {
        id: 0,
        name: '',
        avatar: ''
      }
    }
  }
})
console.log(props.users)
</script>

<style lang='less' scoped>
.user-box{
  padding-left: 3%;
  .user-base{
    display: flex;
    align-items: center;
    margin-top: 1rem;
    img{
      width: 2.6rem;
      height: 2.6rem;
      margin-right: .6rem;
      border-radius: .2rem;
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