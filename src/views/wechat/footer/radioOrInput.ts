import { reactive } from 'vue'
const state = reactive({
  // 录音按钮
  isAudio: false,
  isInput: true,
  isChat: true,
  faceShow: false,
  moreShow: false,
  faceList: [],
  // 底部表情包分类
  bIconList: ['search', 'smile-o', 'like-o', 'thumb-circle-o'],
  bIconCurrent: 1,
  funList: [
    {id: 1, title: '相册', name: 'photo', type: 'file'},
    {id: 2, title: '拍摄', name: 'photograph', type: 'text'},
    {id: 3, title: '视频', name: 'video', type: 'text'},
    {id: 4, title: '位置', name: 'map-marked', type: 'text'},
    {id: 5, title: '红包', name: 'bill', type: 'text'},
    {id: 6, title: '转款', name: 'sort', type: 'text'},
    {id: 7, title: '语音', name: 'volume', type: 'text'},
    {id: 8, title: '名片', name: 'manager', type: 'text'},
  ]
})

const isAudioBtn = () => {
  state.isAudio = !state.isAudio
  state.isAudio ? state.isInput = false : state.isInput = true
  state.faceShow = false
  state.isAudio && (state.isChat = true)
}

const chatBtn = () => {
  state.isChat = !state.isChat
  state.isInput = true
  state.isAudio = false
  state.moreShow = false
  state.isChat && (state.faceShow = false)
  !state.isChat && (state.faceShow = true)
};

const moreBtn = () => {
  state.faceShow = false
  state.moreShow = !state.moreShow
};

export {
  state,
  isAudioBtn,
  chatBtn,
  moreBtn
}