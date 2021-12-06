import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vant from './libs/vant'
import axios from './libs/axios'

const app = createApp(App)

app.use(router)
app.use(vant)
app.provide('axios', axios)

app.mount('#app')