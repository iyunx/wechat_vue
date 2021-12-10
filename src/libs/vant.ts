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
  ImagePreview
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
  ImagePreview
]

export default {
  install(App: App){
    vants.forEach(item => App.use(item))
  }
}