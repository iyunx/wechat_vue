import axios from "../libs/axios";
import { IMessage } from "../utils";

const login = async (values: any) => {
  return ((await axios.post('/login', values)).data) as IMessage
}

const register = async (values: any) => {
  return (await axios.post('/register', values)).data as IMessage
}

const postSMS = async (values: string) => {
  return (await axios.post('/sms', {phone: values})).data as IMessage
}


const getUsers = async () => {
  return (await axios.get('/user')).data as IMessage;
}

const getUser = async (id: number | string) => {
  return (await axios.get(`/user/${id}`)).data as IMessage;
}

const getMe = async () => {
  return await axios.get('/user/me');
}

const searchUser = async (str: string) => {
  return (await axios.get('/user/search', { params: {str} })).data as IMessage
}

const addFriend = async (data: any) => {
  return (await axios.post('/user/store', data)).data as IMessage
}

const getRemindIndex = async () => {
  return (await axios.get('/user/remind')).data as IMessage
}
const getRemindShow = async (uid: number, id: number) => {
  return (await axios.get(`/user/${uid}/remind/${id}`)).data as IMessage
}

const postSureFriend = async (contact: any) => {
  let data = (await axios.post('/user/contact', contact)).data as IMessage
  return data.data
}

export {
  login,
  register,
  postSMS,
  getUsers,
  getUser,
  getMe,
  searchUser,
  addFriend,
  getRemindIndex,
  getRemindShow,
  postSureFriend
}