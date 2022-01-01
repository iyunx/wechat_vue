import axios from 'axios';
import { Toast } from 'vant';
import { TOKEN, USER } from './vuex';
import router from '../router'

axios.defaults.baseURL = 'http://192.168.2.3:8000/';
axios.defaults.timeout = 2500;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if(TOKEN.value){
      //@ts-ignore
      config.headers['authorization'] = TOKEN.value
    }
    return config;
  }, error => {
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if(response.headers && response.headers['authorization']) {
      TOKEN.value = response.headers['authorization']
    }
    return response;
  }, err => {
    if(err.response){
      switch(err.response.status){
        case 401:
          TOKEN.value = null;
          USER.value = null;
          router.push('/login')
          return
        case 400:
          Toast(err.response.data.msg)
          return
        default:
          
          break;
      }
    }
    // return Promise.reject(err);
});

export default axios