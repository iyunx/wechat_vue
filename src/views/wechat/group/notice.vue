<template>
  <app-header icon-back name="群公告">
    <template v-slot:right v-if="noticeUser.isAdmin">
      <span style="font-size: .9rem;" v-if="!noticeUser.showEdit" @click="noticeEdit">编辑</span>
      <span style="font-size: .9rem;" v-else @click="noticeBtn">完成</span>
    </template>
  </app-header>
  <div class="notice init">

    <div v-if="noticeUser.showEdit">
      <div v-if="noticeUser.id">
        <div class="notice-user">
          <img :src="noticeUser.avatar" :alt="noticeUser.name">
          <div>
            <span>{{noticeUser.name}}</span>
            <p>{{noticeUser.created_at}}</p>
          </div>
        </div>
      </div>
      <van-field :disabled="!noticeUser.isAdmin" type="textarea" autosize v-model="noticeUser.content" placeholder="请输入群公告内容" />
      <div class="notice-isadmin" v-if="!noticeUser.isAdmin">
        <span class="line"></span>
        <span>只有群主及管理员可以编辑群公告</span>
        <span class="line"></span>
      </div>
    </div>
    <!-- 展示 -->
    <div v-else>
      <div v-if="noticeUser.id">
        <div class="notice-user">
          <img :src="noticeUser.avatar" :alt="noticeUser.name">
          <div>
            <span>{{noticeUser.name}}</span>
            <p>{{noticeUser.created_at}}</p>
          </div>
        </div>
        <p style="padding: .5rem 3%; font-size: .9rem;">{{noticeUser.content}}</p>
      </div>
      <h3 v-else style="text-align: center; margin-top: 5rem;">暂无公告</h3>
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
  id: 0,
  content: '',
  name: '',
  avatar: '',
  created_at: '',
  isAdmin: users.isAdmin,
  showEdit: false
})
const router = useRouter()

if(users.base.notice) {
  noticeUser.id = users.base.notice.id
  noticeUser.content = users.base.notice.content
  noticeUser.created_at = users.base.notice.created_at

  const user = users.list.find(u => users.base.notice && u.id == users.base.notice['id'])
  noticeUser.avatar = user.avatar
  noticeUser.name = user.name
}

const noticeBtn = async () => {
  const data = await groupUpdate(users.base.id, {notice: noticeUser.content})
  if(data.code == 400) return Toast.fail(data.msg)
  users.base.notice = data.notice
  router.go(-1)
}

const noticeEdit = () => {
  noticeUser.showEdit = true
}

</script>

<style lang='less' scoped>
.notice{
  .notice-user{
    padding: 3%;
    display: flex;
    font-size: .9rem;
    border-bottom: 1px solid #eee;
    img{
      width: 3rem;
      height: 3rem;
      border-radius: .2rem;
      margin-right: .6rem;
    }
    p{
      margin-top: .4rem;
    }
  }
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