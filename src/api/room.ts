import axios from "../libs/axios";
import { IMessage } from "../utils";

const roomIndex = async () => {
  let data = ((await axios.get('/room')).data) as IMessage
  return data.data
}

const roomStore = async (id: string) => {
  return ((await axios.post('/room/store', id)).data) as IMessage
}

const roomShow = async (id: string, {page, size}: {page: number, size: number}) => {
  const data = ((await axios.get(`/room/${id}?page=${page}&size=${size}`)).data) as IMessage
  return data.data
}

const roomUpdate = async (id: string) => {
  return ((await axios.put(`/room/${id}`, {})).data) as IMessage
}

const contactUpdate = async (id: string, {num, top, state}: {num?: number, top?: boolean, state?: boolean}) => {
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
  return ((await axios.put(`/room/${id}/roomset${str}`)).data) as IMessage
}

const roomDestroy = async (id: string) => {
  // return ((await axios.post('/login', values)).data) as IMessage
}

const imgUpload = async (file: any) => {
  return ((await axios.post('/room/upload', file)).data) as IMessage
}

export {
  roomIndex,
  roomStore,
  roomShow,
  roomUpdate,
  contactUpdate,
  imgUpload
}