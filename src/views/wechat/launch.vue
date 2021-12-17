<!-- 发起群聊 -->
<template>
  <app-header icon-back name="发起群聊"></app-header>
  <div class="init">
    <van-field v-model="search.value" @focus="isFocus" @blur="isBlur" left-icon='search' placeholder="请输入用户名" />
    <article class="lists" v-if="!search.focus">
      <section class="fun">
        <router-link class="link" to=''>选择一个群</router-link>
        <router-link class="link" to=''>面对面建群</router-link>
        <router-link to=''>企业微信联系人</router-link>
      </section>
      <van-checkbox-group v-model="search.checked" icon-size='18px'>
        <template v-if="users.star.length">
          <aside class="aside">星标好友</aside>
          <ul class="company list">
            <li v-for="item in users.star">
              <van-checkbox :name="item.id">
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
                <van-checkbox :name="item.id">
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
    <van-button :color="search.checked.length ? 'green' : ''" size="small" :disabled='!search.checked.length' @click="checkBtn">
    完成{{search.checked.length ? ` (${search.checked.length})` : ''}}
    </van-button>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import appHeader from '../layout/header.vue'
import { TData } from '../user/types'
import { getUsers } from '../../api/user';
import { useRouter } from 'vue-router';
import { roomStore } from '../../api/room';

const search = reactive({
        value: '',
        focus: false,
        checked: []
      }),
      users = reactive<TData>({
        lists: {},
        star: [],
        reminds: []
      }),
      router = useRouter()

// 获取好友列表
getUsers().then(ret => {
  if(Object.keys(ret.data.lists).length) {
    users.lists = ret.data.lists
  }
  users.star = ret.data.star
})

const isFocus = () => search.focus = true
const isBlur = () => search.focus = false

const checkBtn = async () => {
  if(search.checked.length <= 1) return
  const room = await roomStore(search.checked)
  // router.push('')
  console.log(room)
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