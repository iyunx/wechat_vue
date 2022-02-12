<template>
  <app-header icon-back  :name="`聊天信息(${users.list.length})`" />
  <main class="init">
  <van-field v-model="users.search" left-icon="search" @keyup="searchEnter" />
    <ul class="users" v-if='users'>
      <li v-for="user in users.list" :key="user.id">
        <img :src="user.avatar" :alt="user.name">
        <span>{{user.group_user.nickname ? (user.group_user.nickname.length > 3 ? user.group_user.nickname.slice(0, 3) + '...' : user.group_user.nickname) : user.name}}</span>
      </li>
      <li class="icon-plus"><van-icon name="plus" /></li>
      <li v-if="isShow" class="icon-plus"><van-icon name="minus" /></li>
    </ul>
  </main>
</template>

<script lang='ts' setup>
import AppHeader from '../../layout/header.vue';
import { onUnmounted, computed } from 'vue'
import { users, searchEnter } from './index';

onUnmounted(() => users.search = '')

const isShow = computed(() => (users.base.admin_ids && users.base.admin_ids.includes(users.myset.id)) || users.myset.id == users.base.user_id)
</script>

<style lang='less' scoped>
@pr: 3%;
@white: white;
.init{
  overflow-y: scroll;
  margin: 45px 0 0;
  position: absolute;
  inset: 0;
  background-color: #eee;
}
.flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: .8rem 0;
}
.users{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 1rem @pr;
  gap: 1rem;
  box-sizing: border-box;
  background-color: @white;
  li{
    font-size: .8rem;
    text-align: center;
    img{
      width: 100%;
      border-radius: .3rem;
    }
    &.icon-plus{
      border: 1px dashed #bbb;
      padding: .6rem;
      height: 2.2rem;
      border-radius: .3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
    }
  }
}
</style>