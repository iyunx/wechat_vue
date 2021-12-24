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

const groupUserUpdate = async (id: string , {num}: {num: number}) => {

}

export {
  groupStore,
  groupShow,
  groupUserUpdate
}