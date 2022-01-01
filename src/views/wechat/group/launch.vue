<!-- 发起群聊 -->
<template>
  <app-header icon-back :name=" action ? ( action == 'add' ? '选择联系人' : `聊天成员(${users.star.length})`) : '发起群聊'"></app-header>
  <div class="init">
    <van-field v-model="search.value" @input="searchBtn" @focus="isFocus" @blur="isBlur" left-icon='search' placeholder="请输入用户名" />
    <article class="lists" v-if="!search.focus">
      <section class="fun" v-if="!routeId">
        <router-link class="link" to=''>选择一个群</router-link>
        <router-link class="link" to=''>面对面建群</router-link>
        <router-link to=''>企业微信联系人</router-link>
      </section>
      <van-checkbox-group v-model="search.checked" icon-size='18px'>
        <template v-if="users.star.length">
          <aside class="aside" v-if="action != 'remove'">星标好友</aside>
          <ul class="company list">
            <li v-for="item in users.star">
              <van-checkbox :name="item.id" :disabled='search.addCheck.includes(item.id)'>
                <div class="checkbox">
                  <aside><img :src="item.avatar"></aside>
                  <span>{{item.Contact.rname || item.name}}</span>
                </div>
              </van-checkbox>
            </li>
          </ul>
        </template>
        <template v-if="users.lists">
          <template v-for="(user, k) in users.lists">
            <aside class="aside">{{k}}</aside>
            <ul class="company list">
              <li v-for="item in user">
                <van-checkbox :name="item.id" :disabled='search.addCheck.includes(item.id)'>
                  <div class="checkbox">
                    <aside><img :src="item.avatar"></aside>
                    <span>{{item.Contact.rname || item.name}}</span>
                  </div>
                </van-checkbox>
              </li>
            </ul>
          </template>
        </template>
      </van-checkbox-group>
    </article>
    <article v-else>

    </article>
  </div>
  <div class="checkBtn">
    <van-button :color="search.checked.length >= 1 ? 'green' : ''" size="small" :disabled='!((search.checked.length - search.addCheck.length)>=1)' @click="checkBtn">
      <span v-if="!routeId">完成{{search.checked.length ? ` (${search.checked.length})` : ''}}</span>
      <span v-else>完成{{search.checked.length - search.addCheck.length ? ` (${search.checked.length - search.addCheck.length})` : ''}}</span>
    </van-button>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref, watchEffect } from 'vue'
import appHeader from '../../layout/header.vue'
import { TData } from '../../user/types'
import { getUser, getUsers } from '../../../api/user';
import { useRouter, useRoute } from 'vue-router';
import { groupStore, groupUserUpdate } from '../../../api/group';
import { groupListBtn } from '../../../api/socket';
import { users as userList } from './index'

const search = reactive({
        value: '',
        focus: false,
        checked: [],
        addCheck: []
      }),
      users = reactive<TData>({
        lists: {},
        star: [],
        reminds: []
      }),
      oriUsers = reactive<TData>({
        lists: {},
        star: [],
        reminds: []
      }),
      userArr = ref<{id: number, name: string, avatar: string}[]>([]),
      router = useRouter(),
      route = useRoute(),
      routeId = route.params.id,
      action = route.query.action

// 获取好友列表
const getUserList = () => {
  if(action == 'remove') {
    const us = JSON.parse(JSON.stringify(userList.list))
    us.forEach(item => {
      item.Contact = {
        rname: item.group_user.nickname
      }
      delete item.group_user
    })
    users.star = us
    oriUsers.star = us
  } else {
    getUsers().then(ret => {
      if(!Object.keys(ret.data.lists).length) return;
      users.lists = ret.data.lists
      const u = Object.values(ret.data.lists) as any[]
      for(let k of u) {
        userArr.value.push(...k)
      }
      users.star = ret.data.star
      
      oriUsers.lists = ret.data.lists
      oriUsers.star = ret.data.star
      // 群，增群员
      action == 'add' && userList.list.forEach(item => search.checked.push(item.id) && search.addCheck.push(item.id))
    })
  }
}
getUserList()

const isFocus = () => !routeId && (search.focus = true)
const isBlur = () => !routeId && (search.focus = false)

const searchBtn = () => {
  if(routeId) {
    if(search.value.length){
      users.star = oriUsers.star.filter(item => item.name.includes(search.value));
      const u = Object.entries(oriUsers.lists)
      users.lists = {}
      for(let [k, v] of u) {
        const vm = v.filter(item => item.name.includes(search.value) || item.Contact.rname.includes(search.value))
        vm.length && (users.lists[k] = vm)
      }
    } else {
      users.lists = oriUsers.lists
      users.star = oriUsers.star
    }
  } else {
    console.log(333)
  }
  
}

const checkBtn = async () => {
  if(search.checked.length <= 1) return
  const u = []
  for(let i = 0; i < search.checked.length; i++) {
    const us = userArr.value.find(item => item.id == search.checked[i])
    u.push({id: us.id, name: us.name, avatar: us.avatar})
  }
  if(routeId && action){
    // 加入或邀请入群聊
    // const group = await groupUserUpdate(routeId as string, {})
  } else {
    // 创建群聊
    const group = await groupStore(u)
    router.push('/group/' + group.id)
    groupListBtn(group.id, 0)
  }
}

</script>

<style lang='less' scoped>
.input{
  border: none;
  width: 94%;
  box-sizing: border-box;
  margin: 0 3%;
  position: relative;
}
.lists{
  .fun{
    display: flex;
    flex-direction: column;
    padding: .5rem 3% 0;
    font-size: .8rem;
    .link{
      margin-bottom: .5rem;
      border-bottom: .1rem solid #f6f6f6;
      padding-bottom: .5rem;
    }
  }
  .company{
    padding-left:10px;
    &.list{
      li{
        &:first-of-type{
          aside{
            background-color: white;
          }
        }
      }
    }
    li{
      margin-bottom: 10px;
      .checkbox{
        display: flex;
        align-items: center;
        width: 100vw;
        margin-left: .7rem;
      }
      span{
        font-size: 15px;
        margin-left: 10px;
        display: block;
        color: black;
        flex: 1;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
      }
      aside{
        width: 40px;
        height: 40px;
        border-radius: 5px;
        overflow: hidden;
        img{
          max-width: 100%;
          max-height: 100%;
        }
      }
      &:first-of-type{
        aside{
          text-align: center;
          line-height: 40px;
          color: white;
          font-size: 20px;
          background-color: #2b81d8;
        }
      }
      &:last-of-type{
        span{
          border: none;
        }
      }
    }
  }
  .aside{
    background-color: #eee;
    padding:.3rem .6rem .3rem;
    font-size: .8rem;
    margin: 10px 0;
  }
}
.checkBtn{
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 3rem;
  background-color: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: right;
  padding-right: 3%;
}
</style>