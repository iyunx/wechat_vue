import { io } from 'socket.io-client';
import { TOKEN } from './vuex';
import router from '../router';
import config from '../config'

const socket = io(config.url, {
  transports: ['websocket'],
  reconnectionDelayMax: 5000,
  auth: {
    token: TOKEN.value
  }
  // query: {
  //   "token": TOKEN.value || ''
  // }
})

socket.on('connect', () => {
  console.log('socketId: ' + socket.id)
})

socket.on('connect_error', (err: Error) => {
  console.log(err)
  if(err.message == 'not authorized'){
    TOKEN.value = null
    router.push(`/login?reload=true`)
  }
})

export default socket