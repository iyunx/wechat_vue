import router from '../../router'
import { reactive, ref } from 'vue'
import moment from '../../libs/moment'
import { getStyle } from '../../utils'
import { roomlistArr } from '../../api/socket'

const isBox = reactive({
  show: false,
  timer: null,
  isMove: false,
  startTime: 0,
  bodyWidth: getStyle(document.body, 'width'),
  bodyHeight: getStyle(document.body),
  boxWidth: 110,
  boxHeight: 130,
  x: 0,
  y: 0,
  roomId: '',
  roomset: {}
})

const touchStart = (e: TouchEvent) => {
  if(e.touches.length > 1) return

  // if(isBox.show) {
  //   isBox.show = false;
  //   console.log(123)
  //   return
  // }

  isBox.isMove = false
  isBox.startTime = moment().valueOf()
  // @ts-ignore
  isBox.timer = setTimeout(() => {
    isBox.show = true;

    let clientX = e.touches[0].clientX
    let clientY = e.touches[0].clientY
    isBox.x = clientX + isBox.boxWidth >= isBox.bodyWidth ? clientX - isBox.boxWidth : clientX
    isBox.y = clientY + isBox.boxHeight >= isBox.bodyHeight ? clientY - isBox.boxHeight : clientY
    
    let li = findLiDom(e.touches[0].target as HTMLElement) as HTMLLIElement
    isBox.roomId = li.dataset.room_id as string

    roomlistArr.lists.forEach(item => item.id === isBox.roomId && (isBox.roomset = item.roomset))
  }, 1000)
}

const touchEnd = (e: TouchEvent, id: string, isGroup: boolean) => {
  // 触摸结束时间
  let endTime = moment().valueOf();
  /**阻止浏览器默认事件*/
  e.preventDefault()
  if(endTime - isBox.startTime < 1000) {
    !isBox.isMove && (isGroup ? router.push(`/group/${id}`) : router.push(`/room/${id}`))
    isBox.timer && clearTimeout(isBox.timer)
  }
}

const touchMove = () => {
  isBox.isMove = true
  isBox.show = false
  isBox.timer && clearTimeout(isBox.timer)
}

const findLiDom = (dom: HTMLElement, tagName = 'LI') => {
  if(dom.tagName === tagName) return dom
  while(dom = dom.parentNode as HTMLElement){
    if(dom.tagName === tagName) return dom
  }
}

export {
  isBox,
  touchStart,
  touchEnd,
  touchMove
}