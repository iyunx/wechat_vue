<template>
  <app-header name='添加好友' icon-back></app-header>
  <article class="base search">
    <div class="search-btn" @click="inputShowBtn">
      <van-icon name="add-o" />
      <span>微信号/手机号</span>
    </div>
    <div class="my-chatId">我的微信号：{{USER?.self_id}}</div>
    <div>

    </div>
  </article>

  <article class="search-bg" v-show='inputShow'>
    <section class="search-wapper">
      <input type="text" v-model='searchValue' ref='inputRef' placeholder="微信号/手机号" @keyup="searchEnter">
      <span @click="cancleBtn">取消</span>
    </section>
    <section class="search-list" v-show='searchValue.length && !userIsNull' @click="searchBtn">
      <aside class="search-list-icon"><van-icon name="manager" /></aside>
      <div class="search-text">
        <span>搜索：</span>
        <span v-text='searchValue'></span>
      </div>
    </section>
    <section class="search-info" v-show='userIsNull'>
      此用户不存在
    </section>
    <section v-show='userIsNull' class="search-more">
      <van-icon class="search-more-l" name="expand" />
      <div class="search-more-r">
        <div>搜一搜 <span>{{searchValue}}</span></div>
        <aside>小程序、公众号、文章、朋友圈和表情等</aside>
      </div>
    </section>
  </article>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import appHeader from '../layout/header.vue'
import { USER } from '../../libs/vuex'
import { searchUser } from '../../api/user';
import { Toast } from 'vant';
const inputRef = ref<HTMLInputElement>(),
      inputShow = ref(false),
      searchValue = ref(''),
      userIsNull = ref(false),
      router = useRouter()

const inputShowBtn = () => {
  inputShow.value = true;
  setTimeout(() => inputRef.value?.focus(), 300)
}

const cancleBtn = () => {
  inputShow.value = false
  searchValue.value = ''
  userIsNull.value = false
}

const searchEnter = async (e: KeyboardEvent) => {
  if(e.key === 'Enter') searchBtn()
  else userIsNull.value = false
}

const searchBtn = async () => {
  if(!/^\w+$/.test(searchValue.value)){
    return Toast('请输入字母数字下划线')
  }
  const user = await searchUser(searchValue.value)
  if(!user.data) {
    userIsNull.value = true;
    return
  }
  let from = 'self_id';
  if(/^\d{11}$/.test(searchValue.value)) from = 'phone';
  router.replace(`/user/${user.data.id}?from=${from}`)
}
</script>

<style lang='less' scoped>
.search{
  background-color: #eee;
  position: absolute;
  inset: 0;
  padding-top: 50px;
  .search-btn{
    background-color: white;
    width: 90%;
    height: 30px;
    margin-left: 5%;
    border-radius: 5px;
    margin-bottom: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      margin-left: 5px;
    }
  }
  .my-chatId{
    font-size: 12px;
    text-align: center;
  }
}

.search-bg{
  position: absolute;
  inset: 0;
  z-index: 101;
  background-color: #eee;
  .search-wapper{
    display: flex;
    align-items: center;
    padding: 0.6rem 3% 0.5rem;
    box-sizing: border-box;
    height: 3.2rem;
    input{
      flex: 1;
      border: none;
      border-radius: 0.3rem;
      font-size: 0.9rem;
      padding: 0 .5rem;
      height: 100%;
    }
    span{
      margin-left: 0.8rem;
      color: rgb(116, 157, 245);
      font-size: 14px;
    }
  }
  .search-list{
    background-color: white;
    display: flex;
    margin-top: 0.5rem;
    .search-list-icon{
      background-color: rgb(50, 168, 99);
      color: white;
      font-size: 26px;
      padding: 0.3rem 0.5rem;
    }
    .search-text{
      display: flex;
      align-items: center;
      margin-left: 0.5rem;
      font-size: 0.95rem;
      span:last-of-type{
        color: rgb(50, 168, 99);
      }
    }
  }
  .search-info{
    background-color: white;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa;
    font-size: 0.8rem;
  }
}
.search-more{
  margin-top: 0.7rem;
  background-color: white;
  padding: 2%;
  display: flex;
  align-items: center;
  .search-more-l{
    font-size: 3.5rem;
    margin-right: .5rem;
    color: rgb(50, 168, 99);
  }
  .search-more-r{
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    span{
      color: rgb(50, 168, 99);
    }
    aside{
      font-size: .8rem;
      color: #777;
      margin-top: .45rem;
    }
  }
}
</style>