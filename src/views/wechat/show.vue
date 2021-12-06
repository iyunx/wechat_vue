<template>
  <app-header :name="chatList.user.rname" icon-more>
    <template #left>
      <router-link to='/'>
        <van-icon name="arrow-left" />
      </router-link>
    </template>
  </app-header>
  <ul class="chat init" ref='listDom' id='chatlist'>
    <template v-for="item in chatList.lists" :key="item.id">
      <div v-if='!item.type' class="notify">
        <span>{{moment(item.created_at).locale('zh-tw').fromNow()}}</span>
        <span v-html='item.content'></span>
      </div>
      <li v-else :class="{current: item.user_id === me.id}">
        <aside>
          <router-link to='/'><img class="avatar" :src="item.user.avatar"></router-link>
        </aside>
        <section>
          <article v-if="item.type === 1" v-html='item.content'></article>
          <!-- <div>
            <img v-if="item.type === 2" :src="item.msg" alt="">
            <video v-if="item.type === 3" :src="item.msg" controls></video>
            <app-audio v-if="item.type === 6" :src="item.msg" :code='item.code'></app-audio>
          </div> -->
        </section>
      </li>
    </template>
  </ul>
  <app-footer v-model:dom='listDom' @sendBtn='sendBtn'></app-footer>
</template>

<script lang='ts' setup>
import AppHeader from '../layout/header.vue';
import AppAudio from '../../components/audio/index.vue'
import AppFooter from './footer/index.vue';
import { useRoute } from 'vue-router';
import { roomShow, contactUpdate } from '../../api/room'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { USER } from '../../libs/vuex';
import moment from '../../libs/moment';
import { roomListBtn, roomlistArr, roomJoin } from '../../api/socket';
import { IBase } from './types';
import socket from '../../libs/socket';

const route = useRoute(),
      roomId = route.params.id as string,
      listDom = ref<HTMLUListElement>(),
      me = USER.value as any,
      chatList = reactive<IBase>({
        lists: [],
        user: {}
      })

const getChatLists = async () => {
  let data = await roomShow(roomId)
  chatList.user = data.users
  chatList.lists = data.chats
  roomJoin(roomId)
}

socket.on('message', data => {
  data.room_id == roomId && chatList.lists.push(data)
  setScrollTop(listDom.value)
})

const chatListBtn = (msg: string, room: string, type: number) => {
  socket.emit('message', msg, room, type)
}

const sendBtn = (msg: string, type: number) => {
  // 房间内页
  chatListBtn(msg, roomId, type)
  // 房间列表页
  roomListBtn(roomId, chatList.user.fid, type, msg)
}

const setScrollTop = (dom: HTMLUListElement | undefined) => nextTick(() => dom && (dom.scrollTop = dom.scrollHeight))

const updateContact = async (num = 0) => await contactUpdate(roomId, {num})

onMounted(async () => {
  const rom = roomlistArr.lists.find(item => item.id == roomId);

  /**
   * 滚动条始终在底部！
   * roomlistArr 房间列表页
   * chatList 聊天内容列表页
   */
  getChatLists()
    .then(() => {
      setScrollTop(listDom.value)
      if((rom && rom.roomset.num) || !chatList.user.roomset.state) {
        updateContact()
        if(rom && rom.roomset.num) {
          !rom.roomset.disturb && (roomlistArr.count -= rom.roomset.num)
          rom.roomset.num = 0
        }
      }
    })
})

</script>

<style lang='less' scoped>
.chat{
  width: 100%;
  padding: 0 10px 8px;
  box-sizing: border-box;
  background-color: #ededed;
  li{
    display: flex;
    padding-top: 13px;
    aside{
      margin-right: 10px;
      a{
          width: 44px;
          height: 44px;
          display: block;
        .avatar{
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 6px;
          margin-right: 10px;
        }
      }
    }
    section{
      width: 70%;
      position: relative;
      h4{
        font-weight: 100;
        margin-bottom: 3px;
      }
      div{
        display: inline-block;
        img{
          max-width: 100%;
        }
        video{
          max-width: 100%;
        }
      }
      article{
        display: inline-block;
        background-color: white;
        border-radius: 5px;
        padding: 10px;
        font-size: 14px;
        margin-top: 2px;
        line-height: 21px;
        word-break: break-all;
      }
    }
    &.current {
      flex-direction: row-reverse;
      aside{
        margin-right: 0;
        margin-left: 10px;
      }
      section{
        justify-content: end;
        h4{
          text-align: right;
        }
        div{
          float: right;
        }
        article{
          float: right;
          background-color: #9eea6a;
        }
      }
    }
  }
  .notify{
    font-size: .8rem;
    text-align: center;
    color: #999;
    span{
      display: block;
      margin-bottom: 1rem;
    }
  }
}
</style>