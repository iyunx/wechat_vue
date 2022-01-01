<template>
  <app-header icon-back :name="`聊天信息(${users.list.length})`" />
  <main class="init font">
    <ul class="users">
      <li v-for="user in lists" :key="user.id">
        <img :src="user.avatar" :alt="user.name">
        <span>{{user.group_user.nickname ? (user.group_user.nickname.length > 3 ? user.group_user.nickname.slice(0, 3) + '...' : user.group_user.nickname) : user.name}}</span>
      </li>
      <router-link :to='`/group/${routeId}/uchange?action=add`'><li class="icon-plus"><van-icon name="plus" /></li></router-link>
      <router-link :to='`/group/${routeId}/uchange?action=remove`'><li v-if="users.myset.id == users.base.admin_id" class="icon-plus"><van-icon name="minus" /></li></router-link>
    </ul>
    <div class="more">
      <router-link :to='`/group/${routeId}/list`'>查看更多群成员 <van-icon name="arrow" /> </router-link>
    </div>
    <ul class="base">
      <li class="flex">
        <span>群聊名称</span>
        <span>{{ users.base.name }} <van-icon name="arrow" /></span>
      </li>
      <router-link :to='`/group/${routeId}/erwei`'>
        <li class="flex">
          <span>群二维码</span>
          <aside>
            <van-icon name="qr" /> 
            <van-icon name="arrow" />
          </aside>
        </li>
      </router-link>
      <li class="flex">
        <article>
          <span>群公告</span>
          <p>{{users.base.notice}}</p>
        </article>
        <van-icon name="arrow" />
      </li>
      <li class="flex" v-if="users.myset.id == users.base.admin_id">
        <span>群管理</span>
        <van-icon name="arrow" />
      </li>
      <li class="flex none">
        <span>备注</span>
        <van-icon name="arrow" />
      </li>
    </ul>
    <div class="search">
      <span>查找聊天记录</span>
      <van-icon name="arrow" />
    </div>
    <ul class="set">
      <li class="flex">
        <span>消息免打扰</span>
        <van-switch v-model="users.myset.disturb" size='1rem' />
      </li>
      <li class="flex" v-if="users.myset.disturb">
        <span><van-icon name="minus" /> 折叠该群聊（待定）</span>
        <van-switch v-model="users.myset.disturb" size='1rem' />
      </li>
      <li class="flex" v-if="users.myset.disturb">
        <span><van-icon name="minus" /> 关注的群成员</span>
        <van-icon name="arrow" />
      </li>
      <li class="flex">
        <span>置顶聊天</span>
        <van-switch v-model="users.myset.top" size='1rem' />
      </li>
      <li class="flex none">
        <span>保存到通讯录（待定）</span>
        <van-switch v-model="checked" size='1rem' />
      </li>
    </ul>
    <ul class="nickname">
      <li class="flex">
        <span>我在群内的昵称</span>
        <aside>
          <span>{{users.myset.nickname ? users.myset.nickname : users.myset.name}}</span>
          <van-icon name="arrow" />
        </aside>
      </li>
      <li class="flex none">
        <span>显示群成员昵称</span>
        <van-switch v-model="users.myset.shownick" size='1rem' />
      </li>
    </ul>
    <ul class="del">
      <li>清空聊天记录</li>
      <li>删除并退出</li>
    </ul>
  </main>
</template>

<script lang='ts' setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import AppHeader from '../../layout/header.vue';
import { users, getUserList } from './index';

const router = useRoute(),
      routeId = router.params.id,
      lists = computed(() => users.list.slice(0, 4)),
      checked = ref(false)

getUserList(routeId as string)

</script>

<style lang='less' scoped>
@size: .7rem;
@pr: 3%;
@plr: 0 @pr;
@white: white;
.init{
  overflow-y: scroll;
  margin: 45px 0 0;
  position: absolute;
  inset: 0;
  background-color: #eee;
}
.flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: .8rem 0;
}
.none{
  border-bottom: none;
}
.font{
  font-size: .9rem;
}
.users{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 1rem @pr;
  gap: 1rem;
  box-sizing: border-box;
  background-color: @white;
  li{
    font-size: .8rem;
    text-align: center;
    img{
      width: 100%;
      border-radius: .3rem;
    }
    &.icon-plus{
      border: 1px dashed #bbb;
      padding: .6rem;
      height: 2.2rem;
      border-radius: .3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
    }
  }
}
.more{
  text-align: center;
  background-color: @white;
  padding-bottom: @size;
}
.base{
  padding: @plr;
  background-color: @white;
  margin-top: @size;
  li{
    &:nth-of-type(2){
      p{
        margin-top: .5rem;
        color: #999;
      }
    }
  }
}
.search{
  padding: @size @pr;
  background-color: @white;
  display: flex;
  justify-content: space-between;
  margin: @size 0;
}
.set{
  margin: @size 0;
  padding: @plr;
  background-color: @white;
}
.nickname{
  padding: @plr;
  background-color: @white;
}
.del{
  margin: @size 0;
  padding: @plr;
  background-color: @white;
  li{
    text-align: center;
    padding: @size 0;
    border-bottom: 1px solid #eee;
    color: red;
    &:last-of-type{
      border-bottom: none;
    }
  }
}
</style>