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
  const top: any[] = roomlistArr.lists.filter(item => item.roomset.top)
  const down: any[] = roomlistArr.lists.filter(item => !item.roomset.top)
  top.sort((a, b) => Date.parse(b.chat.created_at) - Date.parse(a.chat.created_at))
  down.sort((a, b) => Date.parse(b.chat.created_at) - Date.parse(a.chat.created_at))
  roomlistArr.lists = [...top, ...down]
}

export {
  roomJoin,
  remindArr,
  addUserRemind,
  roomlistArr,
  roomListBtn,
  roomListSort,
}