<template>
  <app-header icon-back name='新的朋友'>
    <!-- <template v-slot:right> -->
    <template #right>
      <router-link to='/user/search'>
        <span class="add-friend">添加朋友</span>
      </router-link>
    </template>
  </app-header>
  <article class="remind">
    <ul>
      <li v-for="list in lists" @click="lintBtn(list.id, list.content.id, list.is_friend)">
        <img :src="list.content.avatar" :alt="list.content.name">
        <section>
          <h3>{{list.content.name.substr(0, 10)}}</h3>
          <span>我是{{list.content.add_name}}</span>
        </section>
        <aside>
          <div v-if="new Date(list.created_at).getTime() + 259200000 > new Date().getTime()">
            <router-link :to='`/user/${list.content.id}/remind/${list.id}`' v-if='list.is_friend'><span>已添加</span></router-link>
            <van-button type="success" size="mini" v-else>添加</van-button>
          </div>
          <span v-else>已过期</span>
        </aside>
      </li>
    </ul>
  </article>
</template>

<script lang='ts' setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../../layout/header.vue'
import { getRemindIndex } from '../../../api/user';
import { remindArr } from '../../../api/socket';

const lists = ref<any[]>([]),
      router = useRouter()

getRemindIndex().then(ret => {
  lists.value = ret.data
})

const lintBtn = (id: number, user_id: number, firend: boolean) => {
  if(firend) {
    router.push(`/user/${user_id}`)
  } else {
    router.push(`/user/${user_id}/remind/${id}`)
  }
}

onUnmounted(() => {
  remindArr.value.clear()
})
</script>

<style lang='less' scoped>
.add-friend{
  font-size: 14px;
}
.remind{
  background-color: #eee;
  padding-top: 3rem;
  position: absolute;
  inset: 0;
  overflow-y: scroll;
  ul{
    background-color: white;
    padding: 1rem 3%;
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .7rem;
      padding-bottom: .7rem;
      border-bottom: 1px solid #eee;
      img{
        width: 3.2rem;
        height: 3.2rem;
        border-radius: .3rem;
      }
      section{
        flex: 1;
        margin: 0 2rem 0 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        h3{
          font-size: .93rem;
          margin-bottom: .3rem;
        }
        span{
          font-size: .75rem;
          color: #666;
        }
      }
      aside{
        span{
          font-size: .8rem;
          color: #666;
        }
      }
      &:last-of-type{
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
}
</style>