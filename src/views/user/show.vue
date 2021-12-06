<template>
  <app-header header-bg-color iconBack iconMore></app-header>

  <!-- 好友 -->
  <article class="user" v-if="roomId">
    <section class="info">
      <img :src="user.avatar" class="img" alt="">
      <ul>
        <h4>
          <span>{{user.name}}</span>
          <van-icon :style="{color: user.sex ? '#f73808' : '#1260fe'}" name="manager" />
        </h4>
        <li v-if="user.Contact.rname">昵称：{{user.Contact.rname}}</li>
        <li>微信号：{{user.self_id}}</li>
        <li v-if="user.region">地区：{{user.region}}</li>
      </ul>
      <van-icon v-if="user.Contact.star" class="star" name="star" />
    </section>

    <ul class="set">
      <li>
        <span style="width: 100px;">设置备注和标签</span>
        <van-icon class="arrow" name="arrow" />
      </li>
      <li v-if="user.Contact.rphone">
        <span>电话号码</span>
        <section>{{user.Contact.rphone}}</section>
        <van-icon class="arrow" name="arrow" />
      </li>
      <li>
        <span>标签</span>
        <section>家，她</section>
        <van-icon class="arrow" name="arrow" />
      </li>
      <li>
        <span>描述</span>
        <section>爱人</section>
        <van-icon class="arrow" name="arrow" />
      </li>
      <li style="height: 88px;">
        <span>朋友权限</span>
        <section>
          <div>不让她看朋友圈和状态</div>
          <div>不看她的朋友圈和状态</div>
        </section>
        <van-icon class="arrow" name="arrow" />
      </li>
    </ul>

    <div class="space"></div>

    <ul class="show">
      <li>
        <span>朋友圈</span>
        <van-icon class="arrow" name="arrow" />
      </li>
      <li>
        <span>视频号</span>
        <van-icon class="arrow" name="arrow" />
      </li>
      <li>
        <span>更多信息</span>
        <van-icon class="arrow" name="arrow" />
      </li>
    </ul>

    <ul class="tel">
      <li @click="wechatBtn">
        <van-icon class="arrow" name="chat-o" />
        <span>发消息</span>
      </li>
      <li @click="show = true">
        <van-icon class="arrow" name="phone-circle-o" />
        <span>音视频通话</span>
      </li>
    </ul>
  </article>

  <!-- 陌生人 -->
  <article class="user" v-else>
    <section class="info">
      <img :src="user.avatar" class="img" alt="">
      <ul>
        <h4>
          <span>{{user.name}}</span>
          <van-icon :style="{color: user.sex ? '#f73808' : '#1260fe'}" name="manager" />
        </h4>
        <li v-if="user.region">地区：{{user.region}}</li>
      </ul>
    </section>
    <ul class="set">
      <li>
        <span style="width: 100px;">设置备注和标签</span>
        <van-icon class="arrow" name="arrow" />
      </li>
    </ul>
    <div class="space"></div>
    <div class="from">
      <span>来源</span>
      <span>{{from}}</span>
    </div>
    <ul class="tel">
      <router-link :to='`/user/${user.id}/create?name=${user.name}&from=${$route.query.from}`'>
        <li>
          <span>添加到通讯录</span>
        </li>
      </router-link>
    </ul>
  </article>


  <van-popup v-model:show="show" position="bottom" round :style="{ height: '20%' }">
    <ul class="popup-list">
      <li>视频通话</li>
      <li>音频通话</li>
      <li></li>
      <li @click="show = false">取消通话</li>
    </ul>
  </van-popup>
</template>

<script lang='ts' setup>
import AppHeader from '../layout/header.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { getUser } from '../../api/user';
import { IUser } from './types'

const route = useRoute(),
      router = useRouter()

const user = ref<IUser>({
  id: 0,
  name: '',
  avatar: '',
  sex: false,
  self_id: '',
  Contact: {},
})

const show = ref(false)
// f = 1 是朋友，0为陌生人 2为群友
let id = route.params.id as string
let fromStr = route.query.from
let roomId = ref('')

let from = computed(() => {
  switch(fromStr){
    case 'phone':
      return '来自手机号搜索';
    case 'self_id':
      return '来自微信号搜索';
    default:
      return '未知方式搜索'
  }
});

getUser(id).then(data => {
  let ret = data.data
  if(ret.friend) {
    user.value = ret.friend
    roomId.value = ret.room
  } else {
    user.value = ret
  }
})

const wechatBtn = () => {
  router.push(`/room/${roomId.value}`)
}

</script>

<style lang='less' scoped>
.user {
  background-color: #ededed;
  margin-top: 45px;
  position: absolute;
  inset: 0;
  .info{
    padding: 10px 10px 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background-color: white;
    .img{
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin-right: 20px;
    }
    ul{
      flex: 1;
      h4{
        margin-bottom: 8px;
        span{ margin-right: 8px;}
      }
      li{
        color: #666;
        font-size: 12px;
        line-height: 20px;
      }
    }
    .star{
      color: #ffc000;
    }
  }
  .from{
    font-size: 15px;
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    span:first-of-type{
      width: 80px;
    }
    span:last-of-type{
      flex: 1;
      color: #777;
    }
  }
  .set{
    padding: 0 10px;
    box-sizing: border-box;
    background-color: white;
    li{
      display: flex;
      height: 44px;
      font-size: 14px;
      border-top: 1px solid #eee;
      justify-content: space-between;
      line-height: 44px;
      span{
        width: 80px;
      }
      section{
        flex: 1;
        color: #666;
        div:nth-child(2){
          border-top: solid 1px #eee;
        }
      }
      .arrow{
        margin-top: 16px;
        color: #666;
      }
    }
  }
  .space{
    width: 100%;
    height: 10px;
  }
  .show{
    padding: 10px 10px 0;
    box-sizing: border-box;
    background-color: white;
    font-size: 14px;
    li{
      display: flex;
      height: 50px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
      justify-content: space-between;
      line-height: 50px;
      .arrow{
        margin-top: 16px;
        color: #666;
      }
    }
    li:first-of-type{
      height: 80px;
      line-height: 80px;
      .arrow{
        margin-top: 30px;
      }
    }
    li:last-of-type{
      height: 45px;
      line-height: 45px;
      border-bottom: none;
      .arrow{
        margin-top: 14px;
      }
    }
  }
  .tel{
    padding: 0 10px;
    margin-top: 10px;
    background-color: white;
    font-size: 15px;
    text-align: center;
    li{
      height: 45px;
      color: #606994;
      display: flex;
      justify-content: center;
      align-items: center;
      .arrow{
        font-size: 18px;
      }
      span{
        margin-left: 8px;
      }
    }
    li:last-of-type{
      border-top: 1px solid #eee;
    }
  }
}
.popup-list{
  height: 100%;
  li{
    height: 31%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-of-type{
      border-bottom: 1px solid #eee;
    }
    &:nth-last-of-type(2){
      height: 3%;
      background-color: #eee;
    }
  }
}
</style>