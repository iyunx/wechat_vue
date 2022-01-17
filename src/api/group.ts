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

const groupUpdate = async <T>(id: string, {name, notice}: {name?: T, notice?: T}) => {
  const data = ((await axios.put(`/group/update/${id}`, {name, notice})).data) as IMessage
  return data.data
}
// 群聊天页面
const groupShow = async (id: string, {page, size}: {page: number, size: number}) => {
  const data = ((await axios.get(`/group/${id}?page=${page}&size=${size}`)).data) as IMessage
  return data.data
}
// 群消息通知
type TGroupUser = {
  num?: number,
  top?: boolean,
  state?: boolean,
  remark?: boolean,
  disturb?: boolean,
  shownick?: boolean,
}
const groupUserUpdate = async (id: string, type: TGroupUser) => {
  return ((await axios.put(`/group/${id}/guupdate`, type)).data) as IMessage
}

const groupJoin = async (id: string, ids: {id: number, name: string, avatar: string}[], action: string = 'add') => {
  return (await axios.put(`/group/${id}/join?action=${action}`, {ids})).data as IMessage
}

export {
  groupIndex,
  groupStore,
  groupUpdate,
  groupShow,
  groupUserUpdate,
  groupJoin
}