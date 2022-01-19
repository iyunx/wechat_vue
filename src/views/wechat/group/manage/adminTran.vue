<template>
  <app-header icon-back name="管理员转让">
  </app-header>
  <div class="init">
    <user-list :users="users.exLeaderList" @transfer="transferAdmin" />
  </div>
  <van-popup v-model:show="show">内容</van-popup>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import appHeader from '../../../layout/header.vue'
import userList from '../../../../components/userList/list.vue'
import { users } from '../index'
import { groupUpdate } from '../../../../api/group'

const router = useRouter(),
      route = useRoute(),
      show = ref(false)

const transferAdmin = async (val: {name: string, id: number}) => {
  show.value = true
  const data = await groupUpdate(users.base.id, {user_id: val.id})
}

</script>

<style lang='less' scoped>

</style>