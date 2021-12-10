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
          <div v-else>
            <img v-if="item.type === 2" :src="item.content" @click="imgOpenBtn(item.content)">
            <video v-if="item.type === 3" :src="item.content" controls></video>
            <a :href='item.content.url' class="file" v-if="item.type === 4">
              <div class="file-flex">
                <span>{{item.content.name.slice(0, 42)}}</span>
                <i>1mb</i>
              </div>
              <img :src="fileUrl">
            </a>
            <!-- <app-audio v-if="item.type === 6" :src="item.msg" :code='item.code'></app-audio> -->
          </div>
        </section>
      </li>
    </template>
  </ul>
  
  <van-image-preview v-model:show="imgSwiper.show" :start-position='imgSwiper.index' :images="imgSwiper.images" @change="imgCloseBtn">
  </van-image-preview>
  <app-footer v-model:dom='listDom' @sendBtn='sendBtn'></app-footer>
</template>

<script lang='ts' setup>
import AppHeader from '../layout/header.vue';
import AppAudio from '../../components/audio/index.vue'
import AppFooter from './footer/index.vue';
import { useRoute } from 'vue-router';
import { roomShow, contactUpdate, imgUpload } from '../../api/room'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { USER } from '../../libs/vuex';
import moment from '../../libs/moment';
import { roomListBtn, roomlistArr, roomJoin } from '../../api/socket';
import { IBase } from './types';
import socket from '../../libs/socket';
import fileUrl from '../../assets/files.png'

const route = useRoute(),
      roomId = route.params.id as string,
      listDom = ref<HTMLUListElement>(),
      me = USER.value as any,
      chatList = reactive<IBase>({
        lists: [],
        user: {}
      }),
      imgSwiper = reactive<{show: boolean, images: string[], index: number}>({
        show: false,
        images: [],
        index: 2
      })

const getChatLists = async () => {
  let data = await roomShow(roomId)
  chatList.user = data.users
  chatList.lists = data.chats
  data.chats.forEach((item: any) => {
    if(item.type >= 2 && item.type < 4) imgSwiper.images.push(item.content)
  })
  roomJoin(roomId)
}

socket.on('message', data => {
  data.room_id == roomId && chatList.lists.push(data)
  setScrollTop()
})

const chatListBtn = (msg: any, room: string, type: number) => {
  socket.emit('message', msg, room, type)
}

const sendBtn = async (val: any, type: number) => {
  switch (type) {
    case 1:
      // 房间内页
      chatListBtn(val, roomId, type)
      // 房间列表页
      roomListBtn(roomId, chatList.user.fid, type, val)
      break;
    case 2:
      const tp = val[Object.values(val).length - 1].type.split('/')[0]
      const typelist = [
        {id: 2, type: 'image', title: '[图片]'},
        {id: 3, type: 'video', title: '[视频]'}
      ]
      const ty = typelist.find(item => item.type == tp) || {id: 4, title: '[文件]'};
      const arr: any[] = [];
      (Object.values(val) as File[]).forEach(item => {
        arr.push({type: item.type, name: item.name, file: item})
      })
      const form = new FormData()
      for (const file of (Object.values(val) as File[])) {
        form.append('files', file)
      }
      form.set('room_id', roomId)
      
      const info = await imgUpload(form)
      // 房间内页
      chatListBtn(info.data, roomId, ty.id)
      // 房间列表页
      roomListBtn(roomId, chatList.user.fid, ty.id, ty.title)
      break
    default:
      break;
  }
}

const setScrollTop = () => nextTick(() => {
  let dom = listDom.value
  if(dom) {
    console.dir(dom)
    console.log(dom.scrollHeight)
    setTimeout(() => {
      console.log(listDom.value?.scrollHeight)
    })
  }
  dom && (dom.scrollTop = ref(dom.scrollHeight).value)
})

const updateContact = async (num = 0) => await contactUpdate(roomId, {num})

const imgOpenBtn = (img: string) => {
  let i = imgSwiper.images.findIndex(item => item.includes(img))
  imgSwiper.index = i
  imgSwiper.show = true
}

const imgCloseBtn = (newIndex: number) => {
  imgSwiper.index = newIndex
}


onMounted(async () => {
  const rom = roomlistArr.lists.find(item => item.id == roomId);

  /**
   * 滚动条始终在底部！
   * roomlistArr 房间列表页
   * chatList 聊天内容列表页
   */
  getChatLists()
    .then(() => {
      setScrollTop()
      if((rom && rom.roomset.num) || !chatList.user.roomset.state) {
        updateContact()
        if(rom && rom.roomset.num) {
          !rom.roomset.disturb && (roomlistArr.count -= rom.roomset.num)
          rom.roomset.num = 0
        }
      }
      setScrollTop()
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
          max-width: 60%;
        }
        video{
          max-width: 100%;
        }
        .file{
          background-color: white;
          height: 4.4rem;
          width: 14rem;
          display: flex;
          padding: .5rem;
          box-sizing: border-box;
          border-radius: .5rem;
          .file-flex{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            span{
              font-size: .8rem;
            }
            i{
              font-size: .6rem;
              font-style: normal;
              color: #666;
            }
          }
          img{
            margin: .4rem 0 0 .6rem;
            width: 3rem;
            height: 2.6rem;
          }
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
          overflow: hidden;
          float: right;
          img, video, .file{
            float: right;
          }
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