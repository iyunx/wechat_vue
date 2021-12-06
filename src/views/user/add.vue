<template>
  <app-header icon-back name="申请添加好友" header-bg-color></app-header>
  <van-form @submit="onSubmit" class="add-form">
    <van-cell-group inset>
      <h5>发送添加朋友申请</h5>
      <van-field
        v-model="user.content.add_name"
        name="add_name"
        type="textarea"
        :border='false'
        class="box"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <h5>设置备注</h5>
      <van-field
        v-model="user.rname"
        name="rname"
        :border='false'
        class="box"
        :rules="[{ required: true, message: '请填写备注' }]"
      />
      <h5>标签</h5>
      <div class="box input">
        <span>未开放</span>
        <van-icon name="arrow" />
      </div>
      
      <h5>设置朋友圈权限</h5>
      <ul class="box">
        <li class="input" @click="user.permission.circle = false">
          <span>聊天、朋友圈、微信运动等</span>
          <van-icon v-show='!user.permission.circle' name="success" class="just-say-icon" />
        </li>
        <li class="input" @click="user.permission.circle = true">
          <span>仅聊天</span>
          <van-icon v-show='user.permission.circle' name="success" class="just-say-icon" />
        </li>
      </ul>
      
      <aside style="margin-top: 1rem;" v-if="!user.permission.circle">
        <h5>朋友圈状态</h5>
        <ul class="box">
          <li class="input">
            <span>不让他(她)看</span>
            <van-switch v-model="user.permission.seeme" size='1rem' active-color='#08c060' inactive-color='#c6c6c6' />
          </li>
          <li class="input">
            <span>不看他(她)</span>
            <van-switch v-model="user.permission.seeyou" size='1rem' active-color='#08c060' inactive-color='#c6c6c6' />
          </li>
        </ul>
      </aside>
    </van-cell-group>
    <div style="display: flex; justify-content: center; margin-top: 1.3rem;">
      <van-button style="padding: 0 4rem;" type="success" native-type="submit">发送</van-button>
    </div>
  </van-form>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { USER } from '../../libs/vuex';
import AppHeader from '../layout/header.vue';
import { addFriend } from '../../api/user';
import { addUserRemind } from '../../api/socket';
import { Notify } from 'vant';

const route = useRoute(),
      router = useRouter(),
      { name, from } = route.query,
      user_id = Number(route.params.id),
      me = {
        id: USER.value?.id as number,
        name: USER.value?.name as string
      }
      
const user = reactive({
  user_id,
  rname: name,
  content: {
    name,
    add_name: me.name,
    from
  },
  permission: {
    circle: false,
    seeme: false,
    seeyou: false,
  }
})
const onSubmit = async () => {
  if(user_id == me.id) Notify('自己不能加自己')
  addFriend(user)
  addUserRemind(user_id)
  router.go(-1)
}
</script>

<style lang='less' scoped>
.add-form{
  padding-top: 3rem;
  h5{
    font-weight: 400;
    padding: 0;
    margin: 1rem 0 .3rem;
    color: #888;
  }
  h5:first-of-type{
    margin: .3rem 0;
  }
  .box{
    background-color: #f7f7f7;
    border-radius: .2rem;
    overflow: hidden;
    li:last-of-type{
      border-top: 1px solid #f1f1f1;
    }
  }
  .input{
    display: flex;
    font-size: .8rem;
    padding: 1rem .8rem;
    align-items: center;
    justify-content: space-between;
    .just-say-icon{
      font-size: 15px;
      color: #08bf62;
    }
  }
}
</style>