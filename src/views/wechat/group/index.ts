import { reactive, ref } from 'vue'
import { guIndex } from '../../../api/group';
import { USER } from '../../../libs/vuex';
const me = USER.value

type TUser = {
  list: any[]
  myset: any
  base: any,
  search: string
}
const users = reactive<TUser>({
  list: [],
  myset: {},
  base: {},
  search: ''
})

const old = ref<any[]>([])

const getUserList = async (id: string) => {
  const ret = await guIndex(id)
  users.base = {
    id: ret.data.id,
    name: ret.data.name,
    notice: ret.data.notice,
    qrcode: ret.data.qrcode,
    admin_id: ret.data.user_id,
    admin_ids: ret.data.admin_ids,
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
}

const searchEnter = (e: KeyboardEvent) => {
  const search = users.search.trim();
  if(search.length > 0 && e.key == 'Enter'){
    users.list = users.list.filter(item => item.group_user.nickname ? item.group_user.nickname.includes(search) : item.name.includes(search))
  }
  search.length == 0 && (users.list = old.value)
}

export {
  users,
  getUserList,
  searchEnter
}