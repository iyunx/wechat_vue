<template>
  <app-header icon-back name="群二维码名片" icon-more />
  <div class="init">
    <section>
      <article>
        <ul>
          <li v-for="img in users.base.avatar"><img :src="img" alt=""></li>
        </ul>
        <router-link :to='`/group/${routeId}/join?uid=${users.myset.id}&uname=分手的借口&from=erweima`'><span>{{users.base.name || '房价肯定数据库'}}</span></router-link>
      </article>
      <img class="ewm" :src="`https://api.pwmqr.com/qrcode/create/?url=${path}&uid=${users.myset.id}&uname=分手的借口&from='erweima'`" alt="">
    </section>
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router';
import { users } from './index';

import AppHeader from '../../layout/header.vue';
const route = useRoute(),
      path = location.origin + route.fullPath.slice(0, -6),
      router = useRoute(),
      routeId = router.params.id

</script>

<style lang='less' scoped>
.init{
  overflow-y: scroll;
  margin: 45px 0 0;
  position: absolute;
  inset: 0;
  background-color: #eee;
  section{
    width: 90%;
    margin: 40% auto;
    background-color: white;
    padding: 3%;
    box-sizing: border-box;
    article{
      display: flex;
      align-items: center;
      padding: 2rem 0 0 .6rem;
      ul{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: .15rem;
        border: 1px solid #eee;
        padding: .3rem;
        border-radius: .3rem;
        margin-right: .5rem;
        img{
          width: 1rem;
        }
      }
      span{
        font-size: .9rem;
      }
    }
    .ewm{
      width: 100%;
    }
  }
}
</style>