<template>
  <van-overlay :show="modelValue" :z-index="zIndex">
    <section class="audio-box">
      <aside class="audio-func">
        <div class="audio-close">
          <aside v-show="show.close" style="color: white;">松开 取消</aside>
          <van-icon name="close" />
        </div>
        <div class="audio-written">
          <aside v-show="show.written" style="color: white;">未开发</aside>
          <span>文</span>
        </div>
      </aside>
      <span class="audio-send" v-show="show.send">松开 发送</span>
      <div class="audio-base">
        <van-icon name="volume-o" class="icon" />
      </div>
    </section>
    <section class="audio-track">
      <div class="track-red" v-track-directive="null" v-show="show.close"></div>
      <div class="track-green" v-track-directive="null" v-show="show.send"></div>
    </section>
    <audio ref="audioRef"></audio>
  </van-overlay>
</template>

<script lang='ts' setup>
import { watch, PropType, reactive, ref } from 'vue'
import { GetPercent } from '../../utils'
import vTrackDirective from './directives/track'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      defalut: false
    },
    audioXY: {
      type: Object as PropType<{pageX: number, pageY: number}>,
      defalut(){
        return {
          pageX: 0,
          pageY: 0
        }
      }
    },
    zIndex: {
      type: Number,
      default: 101
    },
  })

  const emits = defineEmits(['update:modelValue', 'getAudio'])
  const show = reactive({
          close: false,
          send: true,
          written: false
        }),
        color = reactive({
          close: 'white',
          written: 'white',
        }),
        stream = ref<MediaStream>(),
        recorder = ref<MediaRecorder>(),
        blobs = ref<Blob>(),
        chunks = ref([]),
        body = {x: document.body.offsetWidth, y: document.body.offsetHeight},
        audioRef = ref<HTMLAudioElement>()

  // 先获取权限
  navigator.mediaDevices.getUserMedia({audio: true})
    .then(str => stream.value = str)
    .catch(err => console.log(err))

  watch(() => props.modelValue, (newBool, oldBool) => {
    newBool && audioStart()
    !newBool && show.send && audioEnd()
  });

  watch(() => props.audioXY, (new1, old1) => {
    const perX = GetPercent(new1.pageX, body.x)
    const perY = GetPercent(new1.pageY, body.y)
    if(perX <= 50 && perY < 87) {
      color.close == 'white' && (color.close = 'red')
      color.written == 'red' && (color.written = 'white')
      show.send == true && (show.send = false)
      show.close == false && (show.close = true)
      show.written == true && (show.written = false)
    } else if (perX > 50 && perY < 87){
      color.close == 'red' && (color.close = 'white')
      color.written == 'white' && (color.written = 'red')
      show.send == true && (show.send = false)
      show.close == true && (show.close = false)
      show.written == false && (show.written = true)
    } else {
      color.close == 'red' && (color.close = 'white')
      color.written == 'red' && (color.written = 'white')
      show.send == false && (show.send = true)
      show.close == true && (show.close = false)
      show.written == true && (show.written = false)
    }
  }, {deep: true})

  const audioStart = () => {
    try {
      recorder.value = new MediaRecorder(stream.value)
      recorder.value.start()
      recorder.value.ondataavailable = e => chunks.value.push(e.data)
    } catch (error) {
      console.log(error)
    }
  }

  const audioEnd = () => {
    if(recorder.value){
      recorder.value.stop()
      setTimeout(() => {
        blobs.value = new Blob(chunks.value, { type: 'audio/webm;codecs=opus'})
        chunks.value = []
        emits('getAudio', blobs.value)
      }, 200)
    }
  }
  
</script>

<style lang='less' scoped>
.audio-box{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 26%;
  background-color: #393D49;
  color: white;
  .audio-base{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50%;
    background-color: #d2d2d2;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    .icon{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
    }
  }
  .audio-func{
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    font-size: 2.6rem;
    text-align: center;
    top: 14%;
    .audio-close{
      color: v-bind('color.close');
    }
    .audio-written{
      font-size: 2rem;
      margin-top: -.3rem;
      display: block;
      padding: .3rem;
      color: v-bind('color.written')
    }
    aside{
      position: absolute;
      font-size: .7rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .audio-send{
    position: absolute;
    left: 50%;
    bottom: 53%;
    transform: translateX(-50%);
  }
}
.audio-track{
  position: relative;
  top: 40%;
  .track-red{
    background-color: red;
    display: inline-block;
    position: absolute;
    left: 15%;
    width: 20%;
    height: 3rem;
    padding: 1rem 0;
    box-sizing: border-box;
    text-align: center;
    border-radius: .3rem;
  }
  .track-green{
    position: absolute;
    left: 50%;
    width: 30%;
    height: 3rem;
    padding: 1rem 0;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
    background-color: green;
    border-radius: .3rem;
  }
}
</style>