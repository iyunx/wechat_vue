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
  PullRefresh,
  CheckboxGroup, Checkbox,
  Overlay,
  Image as VanImage,
  Loading,
  Lazyload
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
  PullRefresh,
  CheckboxGroup, Checkbox,
  Overlay,
  VanImage,
  Loading,
  Lazyload
]

export default {
  install(App: App){
    vants.forEach(item => App.use(item))
  }
}