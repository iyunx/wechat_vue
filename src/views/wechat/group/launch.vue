<!-- 发起群聊 -->
<template>
  <app-header icon-back :name=" action ? ( action == 'add' ? '选择联系人' : `聊天成员(${users.star.length})`) : '发起群聊'"></app-header>
  <div class="init">
    <van-field v-model="search.value" @input="searchBtn" left-icon='search' placeholder="请输入用户名" />
    <article class="lists">
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
        <template v-if="Object.keys(users.lists).length" v-for="(user, k) in users.lists">
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
      </van-checkbox-group>
    </article>
  </div>
  <div class="checkBtn">
    <van-button 
      :color="search.checked.length - search.addCheck.length >= 1 ? 'green' : ''" size="small"
      :disabled='!((search.checked.length - search.addCheck.length) >= 1)'
      @click="checkBtn">
      <!-- 群员 增 删 -->
      <span v-if="routeId">完成{{search.checked.length - search.addCheck.length ? ` (${search.checked.length - search.addCheck.length})` : ''}}</span>
      <span v-else>完成{{search.checked.length ? ` (${search.checked.length})` : ''}}</span>
    </van-button>
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import appHeader from '../../layout/header.vue'
import { TData } from '../../user/types'
import { getUsers } from '../../../api/user';
import { useRouter, useRoute } from 'vue-router';
import { groupStore, groupJoin } from '../../../api/group';
import { groupListBtn, removeUser } from '../../../api/socket';
import { users as userList } from './index'
import { Toast } from 'vant';

const search = reactive({
        value: '',
        checked: [],
        addCheck: []
      }),
      users = reactive<TData>({
        lists: {},
        star: [],
        reminds: []
      }),
      // 好友原始数据 star星标好友，lists为按首字母分类的{}好友群组，all为全部好友或群友的数组
      userArr = reactive({
        lists: {},
        star: [],
        all: [],
      }),
      router = useRouter(),
      route = useRoute(),
      routeId = route.params.id as string,
      action = route.query.action as string

// 获取好友列表
const getUserList = () => {
  if(action == 'remove') {
    let us = JSON.parse(JSON.stringify(userList.list)) as any[]
    us = us.filter(item => {
      item.Contact = {
        rname: item.group_user.nickname || ''
      }
      delete item.group_user
      return item.id != userList.base.user_id
    })
    users.star = us
    userArr.all = us
  } else {
    getUsers().then(ret => {
      if(!Object.keys(ret.data.lists).length) return;
      const u = Object.values(ret.data.lists) as any[]
      // 所有好友 [{id: '', name: ''}]
      for(let v of u) {
        userArr.all.push(...v)
      }
      // 所有好友首字母分组 {a: [{id: '', name: '', ...}], b: [...]}
      userArr.lists = ret.data.lists
      userArr.star = ret.data.star
      
      users.lists = ret.data.lists
      users.star = ret.data.star
      
      // 群，增群员
      action == 'add' && userList.list.forEach(item => search.checked.push(item.id) && search.addCheck.push(item.id))
    })
  }
}
getUserList()

const searchBtn = () => {
  if(action == 'remove'){
    search.value.length
    ? users.star = userArr.all.filter(item => item.name.includes(search.value) || item.Contact.rname.includes(search.value))
    : users.star = userArr.all
  } else {
    if(search.value.length){
      users.star = userArr.star.filter(item => item.Contact.star && (item.name.includes(search.value) || item.Contact.rname.includes(search.value)));
      const u = Object.entries(userArr.lists) as any[]
      users.lists = {}
      for(let [k, v] of u) {
        const vm = v.filter(item => item.name.includes(search.value) || item.Contact.rname.includes(search.value))
        vm.length && (users.lists[k] = vm)
      }
    } else {
      users.lists = userArr.lists
      users.star = userArr.star
    }
  }
}

const checkBtn = async () => {
  if(routeId){
    // 移除群友，或群
    if(action == 'remove'){
      if(userList.base.user_id != userList.myset.id) return Toast('你不是管理员')
      if(users.star.length - search.checked.length < 2) return Toast('一个群至少3人')
      const del: Array<{id: number, name: string, avatar: string}> = []
      search.checked.forEach(id => {
        users.star.forEach(item => {
          if(item.id == id) {
            const ret = userArr.all.find(item => item.id == id)
            del.push({id, avatar: ret.avatar, name: ret.name })
          }
        })
        users.star = users.star.filter(item => item.id != id)
      })
      const data = await groupJoin(routeId, del, action)
      if(data.code == 200){
        removeUser(routeId, del, false)
        router.push(`/group/${data.data.id}`)
      }
    } else {
      // 邀请好友入群
      const addId = []
      search.checked.forEach(id => {
        if(!search.addCheck.includes(id)){
          const ret = userArr.all.find(item => item.id == id)
          addId.push({id, avatar: ret.avatar, name: ret.name })
        }
      })
      const data = await groupJoin(routeId, addId)
      if(data.code == 200){
        // 通知入群的人，加入群聊，对方微信首页，新增一个群聊房间
        // 房间的id，房间的头像，房间的名称
        groupListBtn(routeId, 0, addId)
        router.replace(`/group/${data.data.id}`)
      }
    }
  } else {
    // 创建群聊
    if(search.checked.length <= 1) return Toast('群员必须2人以上')
    const u = []
    for(let i = 0; i < search.checked.length; i++) {
      const us = userArr.all.find(item => item.id == search.checked[i])
      u.push({id: us.id, name: us.name, avatar: us.avatar})
    }
    const group = await groupStore(u)
    router.push('/group/' + group.id)
    groupListBtn(group.id, 0, u)
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