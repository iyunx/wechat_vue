<template>
  <section class="box-overly" v-if="isBox.show" @touchstart.stop="closeBtn">
    <ul class='box' :style="{left: isBox.x + 'px', top: isBox.y + 'px'}">
      <li @click.stop="readBtn">{{isRead ? '标记已读' : '标记未读'}}</li>
      <li @click.stop="topBtn">{{isTop ? '置顶该聊天' : '取消置顶'}}</li>
      <li @click="stateBtn">不显示该聊天</li>
      <li>删除该聊天</li>
    </ul>
  </section>
</template>

<script lang='ts' setup>
import { ref, computed } from 'vue';
import { isBox, touchMove } from '../../views/wechat/wechat';
import { roomlistArr, roomListSort } from '../../api/socket';
import { contactUpdate } from '../../api/room';
import { groupUserUpdate } from '../../api/group';

const closeBtn = () => isBox.show && setTimeout(() => touchMove(), 200)

const findRoom = () => {
  return roomlistArr.lists.find(item => item.id === isBox.roomId)
}

const isRead = computed(() => findRoom().roomset.num)

const isTop = computed(() => !findRoom().roomset.top)

const readBtn = async () => {
  let num = isRead.value > 0 ? 0 : 1;
  isBox.isGroup ? await groupUserUpdate(isBox.roomId, {num}) : await contactUpdate(isBox.roomId, {num})
  let room = findRoom()
  !room.roomset.disturb && num ? (roomlistArr.count += num) : (roomlistArr.count -= isRead.value)
  room.roomset.num = num
}

const topBtn = async () => {
  let room = findRoom()
  isBox.isGroup ? await groupUserUpdate(isBox.roomId, {top: !room.roomset.top}) : await contactUpdate(isBox.roomId, {top: !room.roomset.top})
  room.roomset.top = room.roomset.top ? false: true
  roomListSort()
}

const stateBtn = async () => {
  let index = roomlistArr.lists.findIndex(item => item.id === isBox.roomId)
  roomlistArr.count -= roomlistArr.lists[index].roomset.num
  roomlistArr.lists.splice(index, 1)
  isBox.isGroup ? await groupUserUpdate(isBox.roomId,  {state: false}) : await contactUpdate(isBox.roomId,  {state: false})
}

</script>

<style lang='less' scoped>
.box-overly{
  position: absolute;
  inset: 0;
  z-index: 100;
  // background-color: rgba(0, 0, 0, .3);
}
.box{
  position: absolute;
  z-index: 101;
  background-color: white;
  box-shadow: 0 0 10px black;
  border-radius: 5px;
  font-size: 15px;
  width: 110px;
  height: 130px;
  box-sizing: border-box;
  padding: 10px;
  li{
    padding-top: 10px;
    &:first-of-type{
      padding-top: 0;
    }
  }
}
</style>