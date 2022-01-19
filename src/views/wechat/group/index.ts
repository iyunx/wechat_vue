import { reactive, ref } from 'vue'
import { groupIndex } from '../../../api/group';
import { USER } from '../../../libs/vuex';
const me = USER.value
type TUBase = {
  id: string,
  name: string,
  avatar: string,
  user_id: number,
  user_ids: number[],
  admin_ids?: number[] | null,
  allow: boolean,
  notice?: object | null,
  qrcode?: string | null
}
type TUser = {
  list: any[]
  myset: any
  base: TUBase,
  search: string,
  isAdmin: boolean,
  adminer: any[]
}
const users = reactive<TUser>({
  list: [],
  myset: {},
  base: {
    id: '',
    name: '',
    avatar: '',
    user_id: 0,
    user_ids: [],
    allow: false,
  },
  search: '',
  isAdmin: false,
  adminer: [],
})

const old = ref<any[]>([])

const getUserList = async (id: string) => {
  const ret = await groupIndex(id)
  users.base = {
    id: ret.data.id,
    name: ret.data.name,
    avatar: ret.data.img,
    allow: ret.data.allow,
    notice: ret.data.notice,
    qrcode: ret.data.qrcode,
    user_id: ret.data.user_id,
    admin_ids: ret.data.admin_ids,
    user_ids: ret.data.user_ids
  }
  users.list = ret.data.users
  old.value = ret.data.users
  users.list.forEach((item: any) => {
    if(me && me.id == item.id) {
      users.myset = {
        ...item.group_user,
        id: item.id,
        name: item.name,
        avatar: item.avatar,
      }
    }
    item.isAdmin = isAdminFn(item.id)
  })

  users.isAdmin = isAdminFn(users.myset.id)
  users.adminer = users.list.filter(u => u.isAdmin)
}

const searchEnter = (e: KeyboardEvent) => {
  const search = users.search.trim();
  if(search.length > 0 && e.key == 'Enter'){
    users.list = users.list.filter(item => item.group_user.nickname ? item.group_user.nickname.includes(search) : item.name.includes(search))
  }
  search.length == 0 && (users.list = old.value)
}

const isAdminFn = (id: number) => {
  return id == users.base.user_id
    ? true
    : users.base.admin_ids && (users.base.admin_ids as Array<number>).includes(id) 
      ? true
      : false
}

export {
  users,
  getUserList,
  searchEnter,
  isAdminFn
}