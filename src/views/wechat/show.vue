<template>
  <app-header :name="chatList.user.rname" icon-more>
    <template #left>
      <router-link to='/'>
        <van-icon name="arrow-left" />
      </router-link>
    </template>
  </app-header>
  <app-chat
    :lists="chatList.lists"
    :count="chatList.count"
    :swiper="imgSwiper"
    @domRef='getChatDom'
    @onRefresh='onRefresh'
    @swiper='swiperBtn'
  >
  </app-chat>
  <app-footer v-model:dom='chatDom' @sendBtn='sendBtn'></app-footer>
</template>

<script lang='ts' setup>
import AppHeader from '../layout/header.vue';
import AppChat from '../../components/chat/index.vue'
import AppFooter from './footer/index.vue';
import { useRoute } from 'vue-router';
import { roomShow, contactUpdate, imgUpload } from '../../api/room'
import { onMounted, reactive, ref, nextTick, onBeforeUnmount } from 'vue'
import moment from '../../libs/moment';
import { roomListBtn, roomlistArr, roomJoin } from '../../api/socket';
import { IBase } from './types';
import socket from '../../libs/socket';
import { Toast } from 'vant';

const route = useRoute(),
      roomId = route.params.id as string,
      chatDom = ref<HTMLUListElement>(),
      chatList = reactive<IBase>({
        count: 0,
        lists: [],
        user: {}
      }),
      pager = reactive({
        page: 1,
        size: 20
      }),
      imgSwiper = reactive<{show: boolean, images: string[], index: number}>({
        show: false,
        images: [],
        index: 2
      })

// 信息列表
const getChatLists = async () => {
  const data = await roomShow(roomId, pager)
  chatList.user = data.friend
  chatList.lists = data.chats.rows
  chatList.count = data.chats.count
  roomJoin(roomId)
  data.chats.rows.forEach(item => {
    if(item.type >= 2 && item.type < 4) imgSwiper.images.push(item.content)
  })
}
// 下拉加载
const onRefresh = () => {
  if(chatList.count <= chatList.lists.length) {
    Toast.success('已经全部加载')
    return
  };
  pager.page += 1
  setTimeout(async () => {
    const data = await roomShow(roomId, pager)
    chatList.lists.unshift(...data.chats.rows)
    imgSwiper.images = []
    chatList.lists.forEach((item: any) => {
      if(item.type >= 2 && item.type < 4) imgSwiper.images.push(item.content)
    })
  }, 1000)
}

// 接受实时聊天信息
socket.on('message', data => {
  if(data.room_id == roomId){
    switch(data.type){
      case 1:
        chatList.lists.push(data)
        break;
      case 2:
      case 3:
        data.content.forEach(item => {
          chatList.lists.push({
            type: item.type,
            content: item.path,
            room_id: data.room_id,
            user_id: data.user_id,
            user: data.user,
            created_at: moment().format('YYYY-MM-DD H:i:s'),
            updated_at: moment().format('YYYY-MM-DD H:i:s')
          })
        })
        break;
      case 4:
        data.content.forEach(item => {
          chatList.lists.push({
            type: item.type,
            content: {url: item.path, name: item.name},
            room_id: data.room_id,
            user_id: data.user_id,
            user: data.user,
            created_at: moment().format('YYYY-MM-DD H:i:s'),
            updated_at: moment().format('YYYY-MM-DD H:i:s')
          })
        })
        break;
    }
    setTimeout(() => setScrollTop(chatDom.value as HTMLUListElement), 100)
  }
})
// 发送实时聊天信息
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
      chatListBtn(info, roomId, ty.id)
      // 房间列表页
      roomListBtn(roomId, chatList.user.fid, ty.id, ty.title)
      break
    default:
      break;
  }
}
// 未读消息设定为已读
const updateContact = async (num = 0) => await contactUpdate(roomId, {num})
// 接收dom
const getChatDom = (val: HTMLUListElement) => {
  chatDom.value = val
}
// 滚动条在最底部
const setScrollTop = (dom: HTMLUListElement) => {
  nextTick(() => dom && (dom.scrollTop = dom.scrollHeight))
}

const swiperBtn = (val: boolean) => imgSwiper.show = val

onMounted(() => {
  // roomlistArr是通过首页获取内容的，其他页面刷新丢失
  getChatLists()
    .then(() => {
      setScrollTop(chatDom.value as HTMLUListElement)
      setTimeout(() => setScrollTop(chatDom.value as HTMLUListElement), 100)
    })
})

// 更新未读信息条数，本地与数据库
const upCount = () => {
  const rom = roomlistArr.lists.find(item => item.id == roomId);
  if((rom && rom.roomset.num) || !chatList.user.roomset.state) {
    updateContact()
    if(rom && rom.roomset.num) {
      !rom.roomset.disturb && (roomlistArr.count -= rom.roomset.num)
      rom.roomset.num = 0
    }
  }
}
// 退出页面前，清除未读消息
onBeforeUnmount(() => upCount())

</script>
