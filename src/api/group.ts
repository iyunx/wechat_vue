import axios from "../libs/axios";
import { IMessage } from "../utils";

// 群管理页面
const groupIndex = async (group_id: string) => {
  return ((await axios.get(`/group/${group_id}/index`)).data) as IMessage;
}

const groupStore = async (arr: Array<number>) => {
  const data = ((await axios.post('/group/store', arr)).data) as IMessage
  return data.data
}
// 群聊天页面
const groupShow = async (id: string, {page, size}: {page: number, size: number}) => {
  const data = ((await axios.get(`/group/${id}?page=${page}&size=${size}`)).data) as IMessage
  return data.data
}
// 群消息通知
const groupUserUpdate = async (id: string, {num, top, state}: {num?: number, top?: boolean, state?: boolean}) => {
  let str = '?'
  if(num != undefined) {
    if(str[str.length - 1] == '?') str = str + `num=${num}`
    else str = str + `&num=${num}`
  }
  if(top != undefined) {
    if(str[str.length - 1] == '?') str = str + `top=${top}`
    else str = str + `&top=${top}`
  }
  if(state != undefined) {
    if(str[str.length - 1] == '?') str = str + `state=${state}`
    else str = str + `&state=${state}`
  }
  str[str.length - 1] == '?' && (str = '')
  return ((await axios.put(`/group/${id}/num${str}`)).data) as IMessage
}

const groupJoin = async (id: string, ids: {id: number, name: string, avatar: string}[], action: string = 'add') => {
  return (await axios.put(`/group/${id}/join?action=${action}`, {ids})).data as IMessage
}

export {
  groupIndex,
  groupStore,
  groupShow,
  groupUserUpdate,
  groupJoin
}