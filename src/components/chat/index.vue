<template>
  <ul class="chat init" ref='chatDom' id='chatlist'>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <template v-for="item in lists" :key="item.id">
        <div v-if='!item.type' class="notify">
          <span>{{moment(item.created_at).locale('zh-tw').fromNow()}}</span>
          <span v-html='item.content'></span>
        </div>
        <li v-else :class="{current: item.user_id === me.id}">
          <aside>
            <router-link to='/'><van-image class="avatar" :src="item.user.avatar" /></router-link>
          </aside>
          <section>
            <article v-if="item.type === 1" v-html='item.content'></article>
            <div v-else>
              <van-image v-if="item.type === 2" :src="item.content" @click="imgOpenBtn(item.content)">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <video v-if="item.type === 3" :src="item.content" controls></video>
              <a :href='item.content.url' class="file" v-if="item.type === 4">
                <div class="file-flex">
                  <span>{{item.content.name.slice(0, 42)}}</span>
                  <i>1mb</i>
                </div>
                <img :src="fileUrl" />
              </a>
              <div v-if="item.type === 5">
                <article class="audio-btn" v-if="item.user_id === me.id">
                  5“ <van-icon name="volume-o" style="transform: rotate(180deg);" />
                </article>
                <article class="audio-btn" v-else>
                  <van-icon name="volume-o" /> 5“
                </article>
              </div>
            </div>
          </section>
        </li>
      </template>
    </van-pull-refresh>
  </ul>
  
  <van-image-preview v-model:show="swiper.show" :start-position='index' :images="swiper.images" @change="imgCloseBtn">
  </van-image-preview>

</template>

<script lang='ts' setup>
import { onMounted, PropType, ref } from 'vue'
import { TLists } from '../../views/wechat/types';
import moment from '../../libs/moment'
import { USER } from '../../libs/vuex';
import fileUrl from '../../assets/files.png'

const props = defineProps({
  lists: {
    type: Array as PropType<TLists[]>,
    default: []
  },
  count: {
    type: Number,
    default: 0
  },
  swiper: {
    type: Object,
    default: {
        show: false,
        images: [],
        index: 0
      }
  },
  swiperShow: {
    type: Boolean,
    defalut: false
  },
  swiperIndex: {
    type: Number,
    default: 0
  }
});

const emits = defineEmits(['onRefresh', 'domRef', 'swiper'])

const chatDom = ref<HTMLUListElement>(),
      me = USER.value as any,
      loading = ref(false),
      index = ref(0)

// 下拉加载
const onRefresh = () => {
  emits('onRefresh')
  setTimeout(() => loading.value = false, 1000)
}

const imgCloseBtn = (newIndex: number) => index.value = newIndex
// 聊天图片 全屏轮播
const imgOpenBtn = (img: string) => {
  let i = props.swiper.images.findIndex((item: any) => item.includes(img))
  index.value = i
  emits('swiper', true)
}

onMounted(() => {
  emits('domRef', chatDom.value)
})
</script>


<style lang='less' scoped>
.chat{
  width: 100%;
  padding: 0 10px 8px;
  box-sizing: border-box;
  background-color: #ededed;
  li{
    display: flex;
    padding-top: 13px;
    aside{
      margin-right: 10px;
      a{
        width: 44px;
        height: 44px;
        display: block;
        .avatar{
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 6px;
          margin-right: 10px;
        }
      }
    }
    section{
      width: 70%;
      position: relative;
      h4{
        font-weight: 100;
        margin-bottom: 3px;
      }
      div{
        display: inline-block;
        img{
          max-width: 60%;
        }
        video{
          max-width: 100%;
        }
        .file{
          background-color: white;
          height: 4.4rem;
          width: 14rem;
          display: flex;
          padding: .5rem;
          box-sizing: border-box;
          border-radius: .5rem;
          .file-flex{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            span{
              font-size: .8rem;
            }
            i{
              font-size: .6rem;
              font-style: normal;
              color: #666;
            }
          }
          img{
            margin: .4rem 0 0 .6rem;
            width: 3rem;
            height: 2.6rem;
          }
        }
        .audio-btn{
          display: inline-block;
          background-color: white;
          border-radius: 5px;
          padding: 10px;
          margin-top: 2px;
        }
      }
      article{
        display: inline-block;
        background-color: white;
        border-radius: 5px;
        padding: 10px;
        font-size: 14px;
        margin-top: 2px;
        line-height: 21px;
        word-break: break-all;
      }
    }
    &.current {
      flex-direction: row-reverse;
      aside{
        margin-right: 0;
        margin-left: 10px;
      }
      section{
        justify-content: end;
        h4{
          text-align: right;
        }
        div{
          overflow: hidden;
          float: right;
          img, video, .file{
            float: right;
          }
        }
        article{
          float: right;
          background-color: #9eea6a;
        }
        .audio-btn{
          float: right;
          background-color: #9eea6a;
        }
      }
    }
  }
  .notify{
    font-size: .8rem;
    text-align: center;
    color: #999;
    span{
      display: block;
      margin-bottom: 1rem;
    }
  }
}
</style>