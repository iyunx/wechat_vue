<template>
  <app-header :name="chatList.room.name">
    <template #left>
      <router-link to='/'>
        <van-icon name="arrow-left" />
      </router-link>
    </template>
    <template v-slot:right>
      <router-link :to='`/group/${roomId}/index`'>
        <van-icon name="ellipsis" />
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
import { groupShow, groupUserUpdate } from '../../api/group'
import { imgUpload, audioUp } from '../../api/room'

import { onMounted, reactive, ref, nextTick, onBeforeUnmount, computed } from 'vue'
import moment from '../../libs/moment';
import { roomlistArr, roomJoin } from '../../api/socket';
import { IBase } from './types';
import socket from '../../libs/socket';
import { Toast } from 'vant';
import { users } from './group'

const route = useRoute(),
      roomId = route.params.id as string,
      chatDom = ref<HTMLUListElement>(),
      chatList = reactive<IBase>({
        count: 0,
        lists: [],
        room: {}
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
  const data = await groupShow(roomId, pager)
  chatList.count = data.count
  chatList.room = data.group
  chatList.room.id = data.group.group.id
  chatList.room.name = data.group.group.name
  Reflect.deleteProperty(chatList.room, 'group')
  console.log(chatList)
  // 进入群聊
  roomJoin(roomId)
  
  data.rows.forEach(item => {
    if(item.type >= 2 && item.type < 4) imgSwiper.images.push(item.content)
  })
  chatList.lists = data.rows
}

const audioCanPaly = (e) => {
  console.log(e)
}
// 下拉加载
const onRefresh = () => {
  if(chatList.count <= chatList.lists.length) {
    Toast.success('已经全部加载')
    return
  };
  pager.page += 1
  setTimeout(async () => {
    const data = await groupShow(roomId, pager)
    chatList.lists.unshift(...data.rows)
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
// 发送实时群聊天信息
const chatListBtn = (msg: any, room: string, type: number) => {
  // 1为群 0为私聊天
  socket.emit('message', msg, room, type, 1)
}
// 实时提醒消息 推送
const groupListBtn = (gid: string, type: number, val: string) => {
  socket.emit('grouplist', gid, type, val)
}
// 0系统信息，1文字，2本地(图，音乐，食品，文件等)，3实时录音
const sendBtn = async (val: any, type: number) => {
  switch (type) {
    case 1:
      // 房间内页
      chatListBtn(val, roomId, type)
      // 房间列表页
      groupListBtn(roomId, type, val)
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
      // 群发送
      form.append('isGroup', 'true')
      form.set('room_id', roomId)
      const info = await imgUpload(form)
      // 房间内页
      chatListBtn(info, roomId, ty.id)
      // 房间列表页
      groupListBtn(roomId, ty.id, ty.title)
      break;
    case 3:
      const audioForm = new FormData()
      audioForm.append('files', val)
      audioForm.set('room_id', roomId)
      audioForm.append('isGroup', 'true')
      const audio = await audioUp(audioForm)
      console.log(audio)
      let title = '[语音]'
      audio.type == 5 && (title = '[视频]')
      // 房间内页
      chatListBtn(audio, roomId, audio.type)
      // 房间列表页
      groupListBtn(roomId, audio.type, title)
      break;
    default:
      break;
  }
}
// 未读消息设定为已读
// const updateContact = async (num = 0) => await contactUpdate(roomId, {num})
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
  setTimeout(() => {
    getChatLists()
    .then(() => {
      setScrollTop(chatDom.value as HTMLUListElement)
      setTimeout(() => setScrollTop(chatDom.value as HTMLUListElement), 100)
    })
  }, 150)
})
// 未读消息设定为已读
const updateContact = async (num = 0) => await groupUserUpdate(roomId, {num})
// 更新未读信息条数，本地与数据库
const upCount = () => {
  const rom = roomlistArr.lists.find(item => item.id == roomId);
  if((rom && rom.roomset.num) || !chatList.room.state) {
    updateContact()
    if(rom && rom.roomset.num) {
      !rom.roomset.disturb && (roomlistArr.count -= rom.roomset.num)
      rom.roomset.num = 0
    }
  }
}
// 退出页面前，清除未读消息
onBeforeUnmount(() => {
  upCount()
  // 复原
  users.list = []
  users.myset = {}
  users.base = {}
  users.search = ''
})

</script>
