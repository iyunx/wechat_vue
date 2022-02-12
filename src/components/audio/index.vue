<template>
  <audio
    ref='audioRef'
    :src="src"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedmetadata"
  >
  </audio>
  <div class="audio" :class="{'audio-current': code === 1}">
    <van-icon @click="playBtn" class="audio-play" v-if="audio.playing" name="pause-circle-o" />
    <van-icon @click="playBtn" class="audio-play" v-else name="play-circle-o" />
    <div class="audio-author">
      <span>万疆</span>
      <span>李玉刚</span>
    </div>
    <img src="https://y.qq.com/music/photo_new/T002R300x300M000000LNpPn0efhTG.jpg?max_age=2592000" alt="">
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'

const props = defineProps({
  src: { type: String, default: ''},
  code: { type: Number, default: 1 },
  controls: { type: Boolean, default: true }
})

const audioRef = ref<HTMLAudioElement>()
const audio = reactive({
  playing: false, // 当前是否播放
  currentTime: 0, // 当前播放时长
  maxTime: 0 // 音频最大播放时长
})
// 播放与暂停 控制按钮
const playBtn = () => audio.playing ? pause() : play();
// 播放音乐
const play = () => audioRef.value && audioRef.value.play();
// 暂停音乐
const pause = () => audioRef.value && audioRef.value.pause();
// 音频播放状态
const onPlay = () => audio.playing = true;
// 音频暂停状态
const onPause = () => audio.playing = false;
// 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
const onTimeUpdate = (e: Event) => {
  let tar = e.target as HTMLAudioElement;
  audio.currentTime = parseInt(tar.currentTime + '')
}
// 当加载语音流元数据完成后，会触发该事件的回调函数
// 语音元数据主要是语音的长度之类的数据
const onLoadedmetadata = (e: Event) => {
  let tar = e.target as HTMLAudioElement
  audio.maxTime = parseInt(tar.duration + '')
}

onMounted(() => {
})
</script>

<style lang='less' scoped>
.audio{
  display: flex;
  background: linear-gradient(to right, #ebebeb, #c6cbc4);
  height: 80px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  .audio-play{
    margin-left: 10px;
    font-size: 24px;
  }
  .audio-author{
    display: flex;
    flex-direction: column;
    margin: 0 30px;
    &:first-of-type{
      font-size: 16px;
    }
    &:last-of-type{
      font-size: 12px;
    }
  }
  img{
    max-height: 100%;
    max-width: 100%;
  }
  &.audio-current{
    flex-direction: row-reverse;
    background: linear-gradient(to right, #c6cbc4, #ebebeb);
    .audio-play{
      margin-right: 10px;
    }
  }
}
</style>