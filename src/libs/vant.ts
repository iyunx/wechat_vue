import type { App } from 'vue'

import {
  Button,
  Tabbar, TabbarItem,
  Icon,
  Swipe, SwipeItem,
  ConfigProvider,
  Form, Field, CellGroup,
  Toast,
  Popup,
  Switch,
  ImagePreview,
  PullRefresh
} from 'vant'

const vants = [
  Button,
  Tabbar, TabbarItem,
  Icon,
  Swipe, SwipeItem,
  ConfigProvider,
  Form, Field, CellGroup,
  Toast,
  Popup,
  Switch,
  ImagePreview,
  PullRefresh
]

export default {
  install(App: App){
    vants.forEach(item => App.use(item))
  }
}