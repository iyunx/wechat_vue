export default {
  mounted(el: HTMLElement){
    setTimeout(() => el.scrollTop += el.scrollHeight, 100)
  }  
}