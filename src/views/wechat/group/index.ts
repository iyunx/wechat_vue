import { reactive, ref } from 'vue'
import { groupIndex } from '../../../api/group';
import { USER } from '../../../libs/vuex';
const me = USER.value

type TUser = {
  list: any[]
  myset: any
  base: any,
  search: string,
  isAdmin: boolean,
}
const users = reactive<TUser>({
  list: [],
  myset: {},
  base: {},
  search: '',
  isAdmin: false
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
  })

  users.isAdmin = isAdminFn()
}

const searchEnter = (e: KeyboardEvent) => {
  const search = users.search.trim();
  if(search.length > 0 && e.key == 'Enter'){
    users.list = users.list.filter(item => item.group_user.nickname ? item.group_user.nickname.includes(search) : item.name.includes(search))
  }
  search.length == 0 && (users.list = old.value)
}

const isAdminFn = () => {
  return users.myset.user_id == users.base.user_id
    ? true
    : users.base.admin_ids 
      ? (users.base.admin_ids as Array<number>).includes(users.myset.id) 
      : false
}

export {
  users,
  getUserList,
  searchEnter,
  isAdminFn
}