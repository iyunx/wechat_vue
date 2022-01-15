<template>
  <app-header icon-back name="群公告">
    <template v-slot:right v-if="noticeUser.isAdmin">
      <span style="font-size: .9rem;" v-if="!noticeUser.showEdit" @click="noticeUser.showEdit = true">编辑</span>
      <span style="font-size: .9rem;" v-else @click="noticeBtn">完成</span>
    </template>
  </app-header>
  <div class="notice init">

    <div v-if="noticeUser.showEdit">
      <div v-if="noticeUser.id" class="notice-user">
        <img :src="noticeUser.avatar" :alt="noticeUser.name">
      </div>
      <van-field :disabled="!noticeUser.isAdmin" type="textarea" autosize v-model="noticeUser.content" placeholder="请输入群公告内容" />
    </div>
    <!-- 展示 -->
    <div class="" v-else>

      <div class="notice-isadmin" v-if="!noticeUser.isAdmin">
        <span class="line"></span>
        <span>只有群主及管理员可以编辑群公告</span>
        <span class="line"></span>
      </div>
    </div>

  </div>
</template>

<script lang='ts' setup>
import { Toast } from 'vant';
import { reactive } from 'vue'
import { useRouter } from 'vue-router';
import { groupUpdate } from '../../../api/group';
import appHeader from '../../layout/header.vue'
import { users } from './index';

const noticeUser = reactive({
  id: users.base.notice ? users.base.notice.id : 0,
  content: users.base.notice ? users.base.notice.content : '',
  name: '',
  avatar: '',
  created_at: users.base.notice ? users.base.created_at.id : '',
  isAdmin: users.isAdmin,
  showEdit: false
})
console.log(noticeUser)

if(users.base.notice) {
  const user = users.list.find(u => u.id === users.base.notice.id)
  noticeUser.avatar = user.avatar
  noticeUser.name = user.name
}

const noticeBtn = async () => {
  const data = await groupUpdate(users.base.id, {notice: noticeUser.content})
  if(data.code == 400) {
    return Toast.fail(data.msg)
  }
  useRouter().go(-1)
}

</script>

<style lang='less' scoped>
.notice{
  .notice-none{
    text-align: center;
    margin-top: 20%;
  }
  .notice-isadmin{
    position: fixed;
    bottom: 20%;
    width: 100%;
    text-align: center;
    font-size: .8rem;
    color: #333;
    .line{
      display: inline-block;
      width: 2.6rem;
      height: 1px;
      background-color: #ddd;
      margin: 0 .6rem;
      vertical-align: 5px; // 垂直居中
    }
  }
}
</style>