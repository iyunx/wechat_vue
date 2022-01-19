<!-- 群管理 -->
<template>
  <app-header icon-back name="群管理"></app-header>
  <div class="manage-bg">
    <div class="init">
      <section class="pd">
        <div class="manage-flex">
          <span>群聊要求确认</span>
          <van-switch size="18px" @click="groupUP" v-model="users.base.allow"></van-switch>
        </div>
        <div class="small">启动后，群成员需群主或管理员确认才能邀请朋友进群。扫描二维码进群将同时停用。</div>
      </section>

      <section class="pd manage-top">
        <router-link to="/manage/admintran" class="manage-flex">
          <span>群主管理权限转让</span>
          <van-icon name="arrow" />
        </router-link>
      </section>
      
      <router-link to="/manage/adminer">
        <section class="pd manage-top">群管理员</section>
      </router-link>
      

      <section class="pd manage-top" style="text-align: center; color: red;">
        <span>解散该群聊</span>
      </section>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import appHeader from '../../../layout/header.vue'
import { users } from '../index'
import { groupUpdate } from '../../../../api/group'

const groupUP = async () => {
  await groupUpdate(users.base.id, {allow: users.base.allow})
}
</script>

<style lang='less' scoped>
.manage-bg{
  width: 100vw;
  height: 100vh;
  background-color: #f6f6f6;
  .pd{
    padding: 3%;
    background-color: white;
    font-size: .96rem;
    .manage-flex{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .small{
      font-size: .8rem;
      color: #999;
      margin-top: .7rem;
    }
  }
  .manage-top{
    margin-top: .6rem;
  }
}
</style>