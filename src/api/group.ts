import axios from "../libs/axios";
import { IMessage } from "../utils";

const groupStore = async (arr: Array<number>) => {
  const data = ((await axios.post('/group/store', arr)).data) as IMessage
  return data.data
}

const groupShow = async (id: string, {page, size}: {page: number, size: number}) => {
  const data = ((await axios.get(`/group/${id}?page=${page}&size=${size}`)).data) as IMessage
  return data.data
}

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
  return ((await axios.put(`/group/${id}${str}`)).data) as IMessage
}

const guIndex = async (group_id: string) => {
  return ((await axios.get(`/group/${group_id}/index`)).data) as IMessage;
}

export {
  groupStore,
  groupShow,
  groupUserUpdate,
  guIndex
}