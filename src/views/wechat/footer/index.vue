<template>
  <transition
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave">
  <div class="chat-footer" ref='footerDom'>
    <div class="chat-footer-t">
      <aside>
        <van-icon @click="isAudioBtn" v-show="state.isInput" name="volume-o" />
        <van-icon @click="isAudioBtn" v-show="!state.isInput" name="chat-o" />
      </aside>

      <section>
        <button v-if="state.isAudio">按住 说话</button>
        <edit-input
          v-model='editInputValue.input'
          v-show='state.isInput'
          @change='editInputChange'
        ></edit-input>
      </section>
      
      <div class="icon-right">
        <div class='icon-chat-smile' :class='{"icon-chat-smile-w": editInputValue.sendBtnShow}'>
          <van-icon @click="chatBtn" v-if="state.isChat" name="chat-o" />
          <van-icon @click="chatBtn" v-else name="smile-o" />
        </div>
        <transition name="addShow">
          <van-icon @click="moreBtn" v-if='!editInputValue.sendBtnShow' class="addBtn" name="add-o" />
          <button v-else @click="sendBtn" class="sendBtn">发送</button>
        </transition>
        <aside></aside>
      </div>
    </div>

    <div class="chat-footer-b">
      <div v-show='state.faceShow' class="chat-footer-height">
        <ul class="icon-type">
          <li v-for="(item, i) in state.bIconList" :class="{currentLi: state.bIconCurrent === i}"><van-icon :name="item" /></li>
        </ul>
        <emo-inco
          v-show='state.bIconCurrent == 1'
          @change='emoChange'
        ></emo-inco>
        <van-icon class="chat-footer-clear" name="close" />
      </div>

      <div v-show='state.moreShow' class="chat-footer-height">
        <ul class="icon-fun">
          <li v-for="item in state.funList" @click="funBtn(item.id)" :key="item.id">
            <div class="icon-fun-icon">
              <input v-model='value' :type="item.type" @change="inputChange($event, item.id)" multiple>
              <van-icon :name="item.name" />
            </div>
            <span>{{item.title}}</span>
          </li>
        </ul>
        <div class="icon-fun-swiper"></div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script lang='ts' setup>
import { onUnmounted, ref, watch, nextTick } from 'vue'
import emoInco from '../../../components/emoji/index.vue'
import editInput from '../../../components/editInput/index.vue'
import { state, isAudioBtn, chatBtn, moreBtn } from './radioOrInput'
import { editInputValue, editInputChange, emoChange } from './editInputFn'
import { getStyle } from '../../../utils'

const props = defineProps({
  dom: HTMLUListElement
})
const emits = defineEmits(['sendBtn'])
// 发送的信息类型 0系统，1文字 2图片 3路由。。。
const footerDom = ref(),
      value = ref();

const footerHeight = () => nextTick(() => {
  if(props.dom){
    props.dom.style.marginBottom = getStyle(footerDom.value, 'height') + 'px'
    props.dom.scrollTop = props.dom.scrollHeight
  }
})

watch(() => state.faceShow, () => footerHeight())
watch(() => state.moreShow, () => footerHeight())


const sendBtn = () => {
  const val = editInputValue.input.trim()
  if(val.length) emits('sendBtn', val, 1)
  editInputValue.input = ''
  editInputValue.sendBtnShow = false
}

const funBtn = (id: number) => {
  console.log(id)
}

const inputChange = (event: Event, id: number) => {
  let files = (event.target as HTMLInputElement).files
  if(!files) return
  emits('sendBtn', files, 2)
}


const beforeEnter = (el: Element) => {
  let om = el as HTMLElement
  om.style.transform = 'translateY(100%)';
  (el as HTMLElement).scrollHeight
}

const enter = (el: Element, done: Function) => {
  let om = el as HTMLElement
  om.offsetHeight
  om.style.transform = 'translateY(0)';
  om.style.transition = 'all 1s'
  setTimeout(() => done(), 3000)
  // om.style.transition = 'all .3s ease'
}

const afterEnter = () => {
  
}

const beforeLeave = (el: Element) => {
  let om = el as HTMLDivElement
  om.style.transform = 'translateY(0)';
}

const leave = (el: Element, done: Function) => {
  let om = el as HTMLElement
  om.offsetHeight
  om.style.transform = 'translateY(100%)';
  // om.style.transition = 'all 1s'
  done()
}

const afterLeave = (el: Element) => {
  let om = el as HTMLElement
  om.style.transform = 'translateY(100%)';
}

onUnmounted(() => {
  state.isAudio = false;
  state.isInput = true;
  state.isChat = true;
  state.faceShow = false;
})
</script>

<style lang='less' scoped>
.chat-footer{
  position: fixed;
  bottom: 0;
  width: 100vw;
  background-color: #f7f7f7;
  min-height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // transition: .3s ease all;
  .chat-footer-t{
    display: flex;
    align-items: center;
    padding: .3rem 0 0 .7rem;
    aside{
      font-size: 1.4rem;
    }
    section{
      flex: 1;
      margin: 0 .5rem;
    }
    .icon-right{
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      position: relative;
      .icon-chat-smile{
        width: 3.8rem;
        transition: .3s ease width;
        &.icon-chat-smile-w{
          width: 5.2rem;
          transition: .3s ease width;
        }
      }
      .addBtn{
        position: absolute;
        right: 0.7rem;
      }
      .sendBtn{
        position: absolute;
        right: 0.7rem;
        border: none;
        outline: none;
        background-color: #08c060;
        color: white;
        font-size: 14px;
        border-radius: 4px;
        padding: 3px 8px;
        z-index: 1;
      }
      aside{
        position: absolute;
        right: 0;
        width: 0.7rem;
        height: 1.6rem;
        background-color: #f7f7f7;
        z-index: 2;
      }
    }
  }
  .chat-footer-b{
    transition: .3s ease all;
    .chat-footer-height{
      height: 272px;
      box-sizing: border-box;
    }
    .icon-type{
      display: flex;
      font-size: 22px;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      align-items: center;
      li{
        margin-right: 14px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.currentLi{
          background-color: white;
          border-radius: 6px;
        }
      }
    }
    .icon-list{
      padding: 15px;
      height: 160px;
      background-color: #ededed;
      overflow-y: scroll;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 17px;
      font-size: 20px;
      padding-bottom: 50px;
    }
    .icon-fun{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.2rem;
      text-align: center;
      padding: 2.2rem 1rem 2rem ;
      li{
        // border: 1px solid red;
        position: relative;
        overflow: hidden;
        .icon-fun-icon{
          display: inline-block;
          font-size: 1.7rem;
          border-radius: .5rem;
          background-color: white;
          padding: .6rem .8rem;
          input{
            // display: none;
            position: absolute;
            z-index: 1;
            inset: 0;
            opacity: 0;
          }
        }
        span{
          display: block;
          margin-top: .3rem;
          font-size: .8rem;
        }
      }
    }
    .icon-fun-swiper{
      width: .5rem;
      height: .5rem;
      background-color: white;
      border-radius: 1rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .chat-footer-clear{
    position: absolute;
    right: 30px;
    bottom: 15px;
    z-index: 1;
    background-color: rgba(255, 255, 255, .9);
    padding: 8px 8px 8px 15px;
    border-radius: 10px;
    font-size: 20px;
  }
}
.smileShow-enter-from, .smileShow-leave-to{
  transform: translateY(100%);
}
.addShow-enter-from, .addShow-leave-to{
  transform: translateX(100%);
}
.addShow-enter-active, .addShow-leave-active, .smileShow-enter-active, .smileShow-leave-active{
  transition: all .3s ease;
}

</style>