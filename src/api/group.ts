import { Toast } from "vant";
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
// 群管理
const groupUpdate = async <T>(id: string, manage: T) => {
  const data = ((await axios.put(`/group/update/${id}`, manage)).data) as IMessage
  // if(data.code == 400) return Toast(data.msg)
  return data.data
}
// 群聊天页面
const groupShow = async (id: string, {page, size}: {page: number, size: number}) => {
  const data = ((await axios.get(`/group/${id}?page=${page}&size=${size}`)).data) as IMessage
  return data.data
}
// 个人对某个群的私有化管理定制 group_user 中间表
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
// 加入或移除群聊
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