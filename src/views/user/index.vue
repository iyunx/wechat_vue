<template>
  <div class="init contact">
    <ul class="fn">
      <li @click="newFriendBtn">
        <aside><van-icon name="manager" /></aside>
        <span>新的朋友<i v-if="remindArr.size">{{remindArr.size}}</i></span>
      </li>
      <li>
        <aside><van-icon name="chat" /></aside>
        <span>仅聊天的朋友</span>
      </li>
      <li>
        <aside><van-icon name="friends" /></aside>
        <span>群聊</span>
      </li>
      <li>
        <aside><van-icon name="todo-list" /></aside>
        <span>标签</span>
      </li>
      <li>
        <aside><van-icon name="bookmark" /></aside>
        <span>公众号</span>
      </li>
    </ul>
    <aside class="aside">我的企业及企业联系人</aside>
    <ul class="company">
      <li>
        <aside><van-icon name="wechat" /></aside>
        <span>企业微信联系人</span>
      </li>
    </ul>
    <template v-if="users.star.length">
      <aside class="aside">星标好友</aside>
      <ul class="company list">
        <li v-for="item in users.star" @click="friendBtn(item.id)">
          <aside><img :src="item.avatar"></aside>
          <span>{{item.Contact.rname || item.name}}</span>
        </li>
      </ul>
    </template>
    <template v-if="users.lists">
      <template v-for="(user, k) in users.lists">
        <aside class="aside">{{k}}</aside>
        <ul class="company list">
          <li v-for="item in user" @click="friendBtn(item.id)">
            <aside><img :src="item.avatar"></aside>
            <span>{{item.Contact.rname || item.name}}</span>
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router';
import { getUsers } from '../../api/user';
import { remindArr } from '../../api/socket';
import { TData } from './types'

const router  = useRouter()
const users = reactive<TData>({
  lists: {},
  star: [],
  reminds: []
})
// 获取好友列表
getUsers().then(ret => {
  if(Object.keys(ret.data.lists).length) {
    users.lists = ret.data.lists
  }
  users.star = ret.data.star
  if(ret.data.reminds.length){
    ret.data.reminds.forEach((item: any) => {
      remindArr.value.add(item.content.id)
    })
  }
})

// getRemindCount()

const friendBtn = (id: number) => {
  router.push( {name: 'user', params: {id}} )
}

const newFriendBtn = () => {
  router.push('/user/remind')
}
</script>

<style lang='less' scoped>
.contact{
  width: 100vw;
  padding-top: 10px;
  .fn{
    padding-left:10px;
    li{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span{
        font-size: 15px;
        margin-left: 10px;
        display: block;
        color: black;
        flex: 1;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        i{
          margin-right: 1rem;
          background-color: #ee0a24;
          color: white;
          border-radius: .6rem;
          height: .3rem;
          min-width: .3rem;
          font-style: normal;
          font-size: .5rem;
          padding: .35rem;
          display: flex;
          align-items: center;
        }
      }
      aside{
        background-color: #fb9f3c;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: white;
        font-size: 20px;
        border-radius: 5px;
      }
      &:nth-of-type(3){
        aside{
          background-color: #07c062;
        }
      }
      &:nth-last-of-type(2){
        aside{
          background-color: #2b81d8;
        }
      }
      &:last-of-type{
        margin-bottom: 0;
        aside{
          background-color: #2b81d8;
        }
        span{
          border: none;
        }
      }
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
      display: flex;
      align-items: center;
      margin-bottom: 10px;
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
    padding: 10px;
    font-size: 12px;
    margin: 10px 0;
  }
}
</style>