import { computed, ref } from 'vue';
import { info, getInfo, setInfo, removeStorage } from './storage';

type TUser = {
  id: number,
  avatar: string,
  name: string,
  phone: number,
  self_id: string,
  sex: boolean,
  initial: string
}

let iToken = ref<null | string>(getInfo(info.token))
let iUser = ref<string | null>(getInfo(info.user))

const TOKEN = computed({
  get(){
    return iToken.value;
  },
  set(val: string | null){
    iToken.value = val;
    if(val){
      setInfo(info.token, val)
    } else {
      removeStorage()
    }
  }
})

const USER = computed({
  get(){
    if(iUser.value) return JSON.parse(iUser.value)
    return iUser.value;
  },
  set(val: TUser | null){
    iUser.value = JSON.stringify(val);
    if(val){
      setInfo(info.user, JSON.stringify(val))
    }
  }
})

export {
  TOKEN,
  USER,
  removeStorage
}