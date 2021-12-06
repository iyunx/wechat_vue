<template>
  <ul class="icon-list">
    <li v-for="i in 104" :key="i" @click="checkBtn(i, $event)">
      <img :src=" 'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + i + '.gif'">
    </li>
  </ul>
</template>

<script lang='ts' setup>
import {} from 'vue';
const emit = defineEmits(['change'])

const checkBtn = (i: number, e: MouseEvent) => {
  let img = e.target as HTMLImageElement
  img.src && emit('change', img.src, i)
}
</script>

<style lang='less' scoped>
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
</style>