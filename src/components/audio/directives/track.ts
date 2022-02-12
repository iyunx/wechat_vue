import { DirectiveBinding } from "vue"

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding){
    let num = 7
    el.className == 'track-green' && (num = 12)
    const flag = document.createDocumentFragment()
    for(let i = 0; i <= num; i++) {
      const li = document.createElement('div')
      li.style.display = 'inline-block'
      li.style.width = '2px'
      li.style.height = '1rem'
      i != num && (li.style.marginRight = '.3rem')
      li.style.backgroundColor = 'white'
      flag.appendChild(li)
    }
    el.appendChild(flag)
  }
}