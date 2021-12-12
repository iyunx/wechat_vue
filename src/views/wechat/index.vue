<template>
  <ul class="init wechat" @touchmove="touchMove">
    <li 
      v-for="room in roomlistArr.lists"
      :data-room_id="room.id"
      :class="{bg: room.roomset.top}"
      @touchstart="touchStart"
      @touchend="touchEnd($event, room.id)">
      <section>
        <img class="avatar" :src="room.user.avatar" :alt="room.user.name">
        <aside v-if="room.roomset.disturb" :class="{'notify1': room.roomset.num}"></aside>
        <aside v-else :class="{'notify2' : room.roomset.num}">
          {{room.roomset.num ? (room.roomset.num < 999 ? room.roomset.num : '···'): ''}}
        </aside>
      </section>
      <article>
        <h4>{{room.user.name}}</h4>
        <p v-if='room.roomset.disturb'>{{room.roomset.num ? `[${room.roomset.num}条]`: ''}} {{room.chat.type < 2 ? room.chat.content.slice(0, 40) : room.chat.msg}}</p>
        <p v-else>{{room.roomset.num ? `[${room.roomset.num}条]`: ''}} {{room.chat.type < 2 ? room.chat.content.slice(0, 40) : room.chat.msg}}</p>
      </article>
      <aside>
        <span>{{room.chat.created_at ? moment(room.chat.created_at).format('H:mm') : moment(room.user.created_at).format('H:mm')}}</span>
        <van-icon v-if="room.roomset.disturb" name="failure" />
      </aside>
    </li>
  </ul>
  <msg-box></msg-box>
</template>

<script lang='ts' setup>
import msgBox from '../../components/msgbox/index.vue';
import { touchStart, touchEnd, touchMove } from './wechat';
import { roomIndex } from '../../api/room';
import moment from '../../libs/moment'
import { roomlistArr, roomListSort } from '../../api/socket';

roomIndex()
  .then(data => {
    // 先初始化为0 ，再叠加未读信息总数
    roomlistArr.count = 0
    data.rooms.forEach((room: any) => {
      !room.roomset.disturb && (roomlistArr.count += room.roomset.num)
      switch(room.chat.type){
        case 2:
          room.chat.msg = '[图片]';
          break;
        case 3:
          room.chat.msg = '[视频]';
          break;
        case 4:
          room.chat.msg = '[文件]';
          break;
      }
    })
    roomlistArr.lists = data.rooms
    roomListSort()
  })
</script>

<style lang='less' scoped>
.wechat{
  touch-action: none;
  li{
    position: relative;
    display: flex;
    padding: 10px 0 0 10px;
    &.bg{
      background-color: #f7f7f7;
    }
    section{
      position: relative;
      img{
        width: 50px;
        height: 50px;
        border-radius: 6px;
        margin-right: 10px;
      }
      aside{
        position: absolute;
        top: -.2rem;
        right: .5rem;
        border-radius: 1rem;
        background-color: rgba(255, 0, 0, .8);
        &.notify1{
          width: 8px;
          height: 8px;
        }
        &.notify2{
          min-width: .8rem;
          height: .8rem;
          padding: .2rem;
          font-size: 12px;
          color: white;
          text-align: center;
        }
      }
    }
    article{
      flex: 1;
      border-bottom: 1px solid #eee;
      padding-top: .2rem;
      padding-right: .4rem;
      h4{
        font-size: 15px;
        font-weight: 500;
      }
      p{
        font-size: 13px;
        margin: 4px 0 16px 0;
        color: #aaa;
        word-break: break-all;
      }
    }
    aside{
      position: absolute;
      color: #aaa;
      font-size: 12px;
      right: 10px;
      top: 18px;
      display: flex;
      flex-direction: column;
      text-align: right;
      span{
        margin-bottom: 8px;
      }
    }
  }
}
</style>