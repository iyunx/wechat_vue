<template>
  <app-header icon-back :name="changeBool ? '添加群管理员' : '删除群管理员'">
    <template #right>
      <van-button
        :type="checkLen ? 'success' : 'default'"
        :disabled="!checkLen"
        size="mini"
        @click="addBtn"
      >完成</van-button>
    </template>
  </app-header>
  <div class="init">
    <user-index v-model="checked">
      <template v-for="user in userAll" :key="user.id">
        <user-item :user="user" :changeBool="changeBool" />
      </template> 
    </user-index>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import appHeader from '../../../layout/header.vue'
import userIndex from '../../../../components/userList/index.vue'
import userItem from '../../../../components/userList/item.vue'
import { users, isAdminFn } from '../index'
import { groupUpdate } from '../../../../api/group'

const checked = ref<number[]>([]),
      router = useRouter(),
      route = useRoute(),
      changeBool = Number(route.query.change as string) ? true : false // 1增 0删
// 添加管理员
const us = changeBool ? users.list.filter(u => {
  if(u.isAdmin) {
    checked.value.push(u.id)
    return u
  }
}) : []

const checkLen = computed(() => checked.value.length - us.length)

const userAll = changeBool ? users.exLeaderList : users.adminer

const addBtn = async () => {
  let adminIds = changeBool ? checked.value : users.base.admin_ids.filter(id => !(new Set(checked.value)).has(id))
  const data = await groupUpdate(users.base.id, {adminIds})
  if(data) {
    users.base.admin_ids = data.admin_ids
    users.list.forEach(u => u.isAdmin = isAdminFn(u.id))
    users.adminer = users.list.filter(u => u.isAdmin && u.id != users.base.user_id)
    router.replace('/manage/adminer')
  }
}

// 移除管理员

</script>

<style lang='less' scoped>

</style>