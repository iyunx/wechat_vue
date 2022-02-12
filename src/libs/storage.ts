const info = {
  token: 'token',
  user: 'user'
}

const getInfo = (key = info.token) => {
  let ret = localStorage.getItem(key)
  if(ret) {
    return typeof ret === 'string' ? ret : JSON.parse(ret)
  } else {
    return null
  }
}

const setInfo = (key = info.token, value: string) => {
  localStorage.setItem(key, value)
}

const removeStorage = () => {
  localStorage.removeItem(info.token)
  localStorage.removeItem(info.user)
}

export {
  info,
  getInfo,
  setInfo,
  removeStorage
}