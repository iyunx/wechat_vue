<template>
  <app-header icon-back header-bg-color icon-more></app-header>
  <article class="sure" v-if="remind">
    <section class="user">
      <div class="info">
        <img :src="remind.content.avatar" alt="">
        <section>
          <h3>{{remind.content.name.length < 14 ? remind.content.name : remind.content.name.substr(0, 14)+'...'}}</h3>
          <div>
            <span @click="setMark.remarkShow = true">设置备注和标签</span>
            <span @click="setMark.promise = true">朋友权限</span>
          </div>
        </section>
      </div>
      <section class="box">
        {{remind.content.name}}：你好，{{remind.content.add_name}}
      </section>
    </section>
    <ul class="sure-list">
      <li v-if="remind.content.sign">
        <aside>个性签名</aside>
        <span>{{remind.content.sign}}</span>
      </li>
      <li>
        <aside>朋友圈</aside>
        <span>待开发</span>
        <van-icon name="arrow" />
      </li>
      <li>
        <aside>来源</aside>
        <span>对方通过{{remind.content.fromer}}添加</span>
      </li>
    </ul>
    <section v-if="remind.time" style="margin:0 1rem; padding-top: 1rem;">
      <van-button type="success" block @click="sureBtn">确认通过</van-button>
    </section>
    <section class="add" v-else>
      <span>已过期</span>
    </section>

    <section class="other">
      <span><router-link to=''>加入黑名单</router-link></span>
      <span><router-link to=''>投诉</router-link></span>
    </section>
  </article>

  <app-remark
    v-model='setMark.remarkShow'
    v-model:rname='rname'
    v-model:rphone='rphone'
    v-model:text='text'
    @change="remarkBtn"
  >
  </app-remark>

  <app-promise
    v-model='setMark.promise'
    @change="promiseBtn"
  >
  </app-promise>
</template>

<script lang='ts' setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../../layout/header.vue'
import { getRemindShow, postSureFriend } from '../../../api/user'
import { IRemindShow } from './types'
import appRemark from '../../../components/remark/index.vue'
import appPromise from '../../../components/remark/promise.vue'
import { roomListBtn } from '../../../api/socket'

const remind = ref<IRemindShow>(),
      contact = reactive({
        fid: 0,
        rname: '',
        rphone: '',
        remark: {
          from: '',
          fromer: '',
          text: '',
          img: ''
        },
        permission: {
          circle: true,
          seeme: false,
          seeyou: false
        }
      }),
      route = useRoute(),
      router = useRouter(),
      uid = Number(route.params.uid as string),
      id = Number(route.params.id as string),
      setMark = reactive({
        remarkShow: false,
        promise: false
      }),
      rname = ref(contact.rname),
      rphone = ref(contact.rphone),
      text = ref(contact.remark.text)

getRemindShow(uid, id).then(ret => {
  let res: IRemindShow = ret.data;
  switch(res.content.from){
    case 'phone':
      res.content.fromer = '手机号'
      break;
    case 'self_id':
      res.content.fromer = '微信号'
      break;
  }
  // 259200000 三天
  if(new Date(res.created_at).getTime() + 259200000 > new Date().getTime()) {
    res.time = true
  } else {
    res.time = false
  }
  return res
}).then(ret => {
  remind.value = ret
  contact.fid = ret.content.id;
  contact.rname = ret.content.add_name;
  contact.remark.from = ret.content.from
  
  rname.value = ret.content.add_name;
})

const remarkBtn = () => {
  contact.rname = rname.value,
  contact.rphone = rphone.value;
  contact.remark.text = text.value
}
const promiseBtn = (val: any) => {
  contact.permission = {
    circle: val.circle,
    seeme: val.seeme,
    seeyou: val.seeyou
  }
}

const sureBtn = async () => {
  let ret = await postSureFriend({contact, remind_id: id})
  if(ret.id) {
    // socket私信对方
    roomListBtn(ret.id, uid)
    router.replace(`/room/${ret.id}`)
  }
}

</script>

<style lang='less' scoped>
.sure{
  background-color: #f7f7f7;
  position: fixed;
  inset: 0;
  .user{
    background-color: white;
    padding: 3.3rem 4% 1rem;
    .info{
      display: flex;
      align-items: center;
      img{
        width: 3.2rem;
        height: 3.2rem;
        border-radius: .3rem;
      }
      section{
        flex: 1;
        margin: 0 1rem;
        h3{
          font-size: 1.1rem;
          margin-bottom: .3rem;
          font-weight: 600;
        }
        div{
          margin-top: .5rem;
          span{
            font-size: .88rem;
            color: rgb(13, 11, 148);
            &:first-child{
              margin-right: 1.5rem;
            }
          }
        }
      }
    }
    .box{
      margin-top: 1rem;
      background-color: #f7f7f7;
      padding: .7rem;
      font-size: .85rem;
      color: #777;
      line-height: 1.4rem;
    }
  }
  .sure-list{
    margin-top: .7rem;
    background-color: white;
    padding: 1rem 4%;
    li{
      display: flex;
      align-items: center;
      font-size: .95rem;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #f7f7f7;
      aside{
        width: 5rem;
      }
      span{
        flex: 1;
        color: #777;
      }
      &:last-of-type{
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }
  .add{
    margin-top: .7rem;
    background-color: white;
    padding: 1rem 4%;
    font-size: .95rem;
    text-align: center;
    color: #999;
  }
  .other{
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    span{
      font-size: .9rem;
      a{
        color: rgb(13, 11, 148);
      }
      &:first-of-type{
        border-right: 1px solid #ccc;
        padding-right: 1rem;
        margin-right: 1rem;
      }
    }
  }
}
</style>