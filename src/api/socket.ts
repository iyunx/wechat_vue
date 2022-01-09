import socket from "../libs/socket";
import { ref, reactive } from 'vue'

/**
 * 加好友，提醒
 */
const remindArr = ref(new Set())
const addUserRemind = (user_id: number) => {
  socket.emit('userRemind', user_id)
}
socket.on('userRemind', (id: number) => {
  remindArr.value.add(id)
})
/**
 * 通过好友申请，进入房间
 */
const roomJoin = (roomId: string) => {
  socket.emit('roomJoin', roomId)
}
/**
 * 通过好友申请，聊天页新增room列表，好友页新增好友信息
 */
type TRoomList = {
  lists: any[],
  count: number,
}
// 我的好友，房间列表首页
const roomlistArr = reactive<TRoomList>({
  lists: [],
  count: 0
});
const roomListBtn = (roomId: string, user: any, type = 1, msg = '') => {
  socket.emit('roomlist', roomId, user, type, msg)
}
socket.on('roomlist', data => {
  /**
   * 注意，直接进入聊天室，roomlistArr.lists不含此聊天室，为空，
   * 只有通过首页进入此聊天室，聊天室才能通过room_id找到
   */
  let ret = roomlistArr.lists.find(item => item.id == data.id)
  if(ret) {
    ret.chat.content = data.chat.content
    ret.chat.created_at = data.chat.created_at
    ret.roomset.num += 1
    !data.roomset.disturb && (roomlistArr.count += 1)
  } else {
    roomlistArr.lists.unshift(data)
    !data.roomset.disturb && (roomlistArr.count += data.roomset.num)
  }
  roomListSort()
})

const roomListSort = () => {
  const top: any[] = roomlistArr.lists.filter(item => {
    if(item.roomset && item.roomset.top) return item
    if(item.group_user && item.group_user.top) return item
  })
  const down: any[] = roomlistArr.lists.filter(item => {
    if(item.roomset && !item.roomset.top) return item
    if(item.group_user && !item.group_user.top) return item
  })
  top.sort((a, b) => Date.parse(b.chat.created_at) - Date.parse(a.chat.created_at))
  down.sort((a, b) => Date.parse(b.chat.created_at) - Date.parse(a.chat.created_at))
  roomlistArr.lists = [...top, ...down]
}

// 创建群聊 通知群员 bool = true 创建，false 邀请入群的人
const groupListBtn = (groupId: string, type = 1, msg = []) => {
  socket.emit('grouplist', groupId, type, msg)
}
// 移除群员，或移除好友
// type ? 移除好友 : 移除群员
const removeUser = (romId: string, uid: number | Array<{id: number, name: string, avatar: string}>, type = true) => {
  socket.emit('removeUser', romId, uid, type)
}
socket.on('removeUser', (romId: string, type: boolean) => {
  const index = roomlistArr.lists.findIndex(item => item.id == romId)
  const room = roomlistArr.lists.find(item => item.id == romId)
  roomlistArr.count -= room.roomset.num;
  roomlistArr.lists.splice(index, 1)
})
// 邀请入群，通知管理员通过审核

export {
  roomJoin,
  remindArr,
  addUserRemind,
  roomlistArr,
  roomListBtn,
  roomListSort,
  groupListBtn,
  removeUser
}