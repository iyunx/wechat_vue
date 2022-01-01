<template>
  <app-header icon-back />
  <div class="init">
    <section class="top">
      <ul class="avatar">
        <li v-for="img in users.base.avatar"><img :src="img" alt=""></li>
      </ul>
      <span>{{users.base.name}}</span>
    </section>
    <van-button @click="joinBtn" class="btn" type="success">加入该群聊</van-button>
  </div>
</template>

<script lang='ts' setup>
import { Toast } from 'vant';
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../../layout/header.vue';
import { users, getUserList } from './index';
import socket from '../../../libs/socket';

const route = useRoute(),
      router = useRouter(),
      routeId = route.params.id as string,
      uid = route.query.uid,
      uname = route.query.uname,
      from = route.query.from

getUserList(routeId)
  .then(() => {
    
    // if((users.base.user_ids as Array<number>).includes(users.myset.id)){
    //   router.push(`/group/${routeId}`)
    // }
  })

const joinBtn = () => {
  // 允许自动加入
  if(users.base.allow){
    socket.emit('message', users.myset.name + '加入了群聊', routeId, 1, 0)
    socket.emit('grouplist', routeId, 0, users.myset.name + '加入了群聊')
  } else {
    // 管理员申请后才能加入
    Toast('申请成功，等待管理员审核')
    console.log(uid, uname, from)
  }
  
}
</script>

<style lang='less' scoped>
.init{
  overflow-y: scroll;
  margin: 45px 0 0;
  position: absolute;
  inset: 0;
  background-color: #eee;
}
.top{
  width: 70%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20%;
  span{
    font-size: .9rem;
  }
}
.avatar{
  width: 4rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .15rem;
  border: 1px solid white;
  padding: .3rem;
  border-radius: .3rem;
  margin-bottom: 1rem;
  img{
    width: 100%;
  }
}
.btn{
  position: fixed;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
}
</style>