<template>
  <app-header icon-back name="群管理员"></app-header>
  <div class="init">
    <div class="admin-header">
      <van-icon class="admin-icon" name="user-o" />
      <span>群管理员</span>
    </div>
    <ul class="admin-capa">
      <span>群管理员可以拥有以下能力</span>
      <li>修改群聊基本信息（群聊名称、群公告等）</li>
      <li>删除群成员（群主、管理员除外）</li>
      <li>同意进群申请</li>
    </ul>
    <ul class="admin-list">
      <template v-for="u in users.adminer" :key="u.id">
        <li v-if="u.id != users.myset.id">
          <img :src="u.avatar" :alt="u.name">
          <span>{{u.name}}</span>
        </li>
      </template>
      <router-link replace
        v-if="users.adminer.length == 0 || users.adminer.length < 4"
        to="/manage/list?change=1"
        class="li-border"
      >
        <van-icon name="plus" />
      </router-link>

      <router-link replace
        v-if="users.adminer.length - 1 > 0"
        to="/manage/list?change=0"
        class="li-border"
      >
        <van-icon name="minus" />
      </router-link>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import appHeader from '../../../layout/header.vue'
import { users } from '../index'

</script>

<style lang='less' scoped>
.admin-header{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.6rem 0;
  .admin-icon{
    font-size: 2rem;
    color: green;
    border: 1px solid green;
    border-radius: 50%;
    padding: .6rem;
    margin-bottom: .4rem;
  }
}
.admin-capa{
  font-size: .8rem;
  padding: 0 3% 1rem 3%;
  border-bottom: 1px solid #eee;
  li{
    margin-top: .4rem;
    padding-left: 1rem;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: .4rem;
      top: 50%;
      width: 4px;
      height: 4px;
      background-color: black;
      transform: translateY(-50%);
      border-radius: 50%;
    }
  }
}
.admin-list{
  padding: 0 3%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin-top: 1rem;
  justify-items: center;
  li{
    display: flex;
    flex-direction: column;
    font-size: .8rem;
    img{
      width: 3rem;
      height: 3rem;
      border-radius: .3rem;
    }
  }
  .li-border{
    border: 1px solid #eee;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .3rem;
  }
}
</style>