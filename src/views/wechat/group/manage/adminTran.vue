<template>
  <app-header icon-back name="管理员转让">
  </app-header>
  <div class="init">
    <user-list :users="users.exLeaderList" />
  </div>
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

const addBtn = async () => {
  // const data = await groupUpdate(users.base.id, {user_id: checked.value})
}

</script>

<style lang='less' scoped>

</style>