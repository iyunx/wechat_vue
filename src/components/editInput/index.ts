import { DirectiveBinding } from "vue"

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<any>){
    // https://wangdoc.com/javascript/dom/mutationobserver.html
    // 聚焦，子类增改监听
    el.focus()
    let range = getSelection() as Selection
    let om = new MutationObserver(() => {
      range.selectAllChildren(el)
      range.collapseToEnd()
    })
    om.observe(el, { childList: true, subtree: true })
  }
}
