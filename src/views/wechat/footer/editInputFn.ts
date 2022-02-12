import { reactive } from 'vue'

// 输入框
const editInputValue = reactive({
  input: '',
  sendBtnShow: false,
})
// 输入框
const editInputChange = (bool: boolean) => editInputValue.sendBtnShow = bool
// 图标植入input
const emoChange = (str: string, i: number) => {
  editInputValue.input += `<img src='${str}'>`
  editInputValue.sendBtnShow = true
}

export {
  editInputValue,
  editInputChange,
  emoChange
}