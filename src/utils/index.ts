import { reactive } from 'vue'

export const getStyle = (el: HTMLElement, opt: string = 'height') => {
  // @ts-ignore
  return parseInt(getComputedStyle(el)[opt])
}

export const trimStr = (str: string) => {
  return str.replace(/&nbsp;/ig, '')
}

// 防抖
export const debounce = (fn: Function, daley: number = 600) => {
  let timer: any = null;
  return (e: InputEvent) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, daley)
  }
}

// 百分比计算
export const GetPercent = (num: number, total: number) => {
  return total <= 0 ? 0 : Math.floor(Math.round(num / total * 10000) / 100);
}

export interface IMessage {
  code: number,
  msg: string,
  data?: any
}