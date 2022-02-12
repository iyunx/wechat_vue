<template>
  <app-header icon-back name="管理员转让">
  </app-header>
  <div class="init">
    <user-list :users="users.exLeaderList" @transfer="transferAdmin" />
  </div>
  <van-popup round v-model:show="show" teleport="body" :style="{ width: '70%' }">
    <div class="info">确定选择 {{newAdmin.name}} 为新群主，你将自动放弃群主身份。</div>
    <van-button style="width: 50%;" @click="show = false">取消</van-button>
    <van-button @click="sureBtn" style="width: 50%;">确定</van-button>
  </van-popup>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import appHeader from '../../../layout/header.vue'
import userList from '../../../../components/userList/list.vue'
import { users } from '../index'
import { groupUpdate } from '../../../../api/group'

const router = useRouter(),
      show = ref(false),
      newAdmin = reactive({
        name: '',
        id: 0
      })

const transferAdmin =  (val: {name: string, id: number}) => {
  show.value = true
  newAdmin.id = val.id;
  newAdmin.name = val.name
}

const sureBtn = async () => {
  const data = await groupUpdate(users.base.id, {user_id: newAdmin.id})
  if(data) router.replace(`/group/${users.base.id}/index`)
}
</script>

<style lang='less' scoped>
.box{
  border-radius: 5px;
}
.info{
  padding: 1rem;
  font-size: .9rem;
}
</style>