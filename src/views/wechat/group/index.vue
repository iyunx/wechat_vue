<template>
  <app-header :name="`聊天信息(${users.list.length})`">
    <template #left>
      <router-link :to="`/group/${routeId}`">
        <van-icon name="arrow-left" />
      </router-link>
    </template>
  </app-header>
  <main class="init font">
    <ul class="users">
      <li v-for="user in lists" :key="user.id">
        <img :src="user.avatar" :alt="user.name">
        <span>{{user.group_user.nickname ? (user.group_user.nickname.length > 3 ? user.group_user.nickname.slice(0, 3) + '...' : user.group_user.nickname) : user.name}}</span>
      </li>
      <router-link :to='`/group/${routeId}/uchange?action=add`'><li class="icon-plus"><van-icon name="plus" /></li></router-link>
      <router-link :to='`/group/${routeId}/uchange?action=remove`' v-if="users.myset.id == users.base.user_id"><li class="icon-plus"><van-icon name="minus" /></li></router-link>
    </ul>
    <div class="more">
      <router-link :to='`/group/${routeId}/list`'>查看更多群成员 <van-icon name="arrow" /> </router-link>
    </div>
    <ul class="base">
      <li class="flex" @click="users.base.user_id == users.myset.user_id && (changeGroup.nameShow = true)">
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
      <router-link :to='`/group/${routeId}/notice`' v-if="users.base.notice || users.isAdmin">
        <li class="flex">
          <article>
            <span>群公告</span>
            <p :style="{'margin-top': users.base.notice ? '.8rem' : ''}">{{users.base.notice ? users.base.notice.content : ''}}</p>
          </article>
          <van-icon name="arrow" />
        </li>
      </router-link>
      <li class="flex" v-else @click="changeGroup.notice = true">
        <article>
          <span>群公告</span>
          <p :style="{'margin-top': users.base.notice ? '.8rem' : ''}">{{users.base.notice ? users.base.notice.content : ''}}</p>
        </article>
        <van-icon name="arrow" />
      </li>
      <router-link to="/manage" v-if="users.base.user_id == users.myset.user_id">
        <li class="flex">
          <span>群管理</span>
          <van-icon name="arrow" />
        </li>
      </router-link>
      <li class="flex none" @click="changeGroup.beizhu = true">
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
        <van-switch v-model="users.myset.disturb" @change="guUpdateBtn('disturb')" size='1rem' />
      </li>
      <li class="flex" v-if="users.myset.disturb">
        <span><van-icon name="minus" /> 折叠该群聊（待定）</span>
        <van-switch v-model="checked" size='1rem' />
      </li>
      <li class="flex" v-if="users.myset.disturb">
        <span><van-icon name="minus" /> 关注的群成员</span>
        <van-icon name="arrow" />
      </li>
      <li class="flex">
        <span>置顶聊天</span>
        <van-switch v-model="users.myset.top" @change="guUpdateBtn('top')" size='1rem' />
      </li>
      <li class="flex none">
        <span>保存到通讯录（待定）</span>
        <van-switch v-model="checked" size='1rem' />
      </li>
    </ul>
    <ul class="nickname">
      <li class="flex" @click="changeGroup.nicknameBool = true">
        <span>我在群内的昵称</span>
        <aside>
          <span>{{changeGroup.nickname}}</span>
          <van-icon name="arrow" />
        </aside>
      </li>
      <li class="flex none">
        <span>显示群成员昵称</span>
        <van-switch v-model="users.myset.shownick"  @change="guUpdateBtn('shownick')" size='1rem' />
      </li>
    </ul>
    <ul class="del">
      <li>清空聊天记录</li>
      <li>删除并退出</li>
    </ul>
  </main>

  <van-popup 
    v-model:show="changeGroup.nameShow"
    round
    :style="{ height: '30%', width: '80%' }"
    @open="changeGroup.name = users.base.name"
  >
    <div class="group-name" style="text-align: center;">
      <h3>修改群聊名称</h3>
      <span>只在此群显示，群内成员可见</span>
      <van-field v-model="changeGroup.name" clearable right-icon="clear-icon"></van-field>
      <van-button class="group-name-btn" type="success" @click="groupNameBtn">提交</van-button>
    </div>
  </van-popup>

  <van-popup 
    v-model:show="changeGroup.notice"
    round
    :style="{ height: '18%', width: '80%' }"
  >
    <div class="group-name">
      <h3>只有群主及管理员可以编辑群公告</h3>
      <van-button class="group-name-btn" type="success" @click="changeGroup.notice = false">知道了</van-button>
    </div>
  </van-popup>

  <van-popup 
    v-model:show="changeGroup.beizhu"
    round
    :style="{ height: '32%', width: '80%' }"
  >
    <div class="group-name">
      <h3>备注</h3>
      <span>群聊的备注仅自己可见</span>
      <van-field v-model="users.myset.remark" />
      <p style="text-align: left; margin-top: 1rem;">群聊名称: {{users.base.name}}</p>
      <div class="group-name-btn">
        <van-button type="success" @click="guUpdateBtn('remark')">提交</van-button>
      </div>
    </div>
  </van-popup>

  <van-popup 
    v-model:show="changeGroup.nicknameBool"
    round
    :style="{ height: '32%', width: '80%' }"
  >
    <div class="group-name">
      <h3>我在群内的昵称</h3>
      <span>群聊的备注仅自己可见</span>
      <van-field v-model="changeGroup.nickname" />
      <div class="group-name-btn">
        <van-button type="success" @click="guUpdateBtn('nickname')">提交</van-button>
      </div>
    </div>
  </van-popup>

</template>

<script lang='ts' setup>
import { Toast } from 'vant';
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router';
import AppHeader from '../../layout/header.vue';
import { users, getUserList } from './index';
import { groupUpdate, groupUserUpdate } from '../../../api/group'
console.log(users)
const router = useRoute(),
      routeId = router.params.id as string,
      lists = computed(() => users.list.slice(0, 4)),
      checked = ref(false),
      changeGroup = reactive({
        nameShow: false,
        name: '',
        notice: false,
        beizhu: false,
        nicknameBool: false,
        nickname: computed({
          get(){
            return users.myset.nickname || users.myset.name
          },
          set(val: string){
            users.myset.nickname = val
          }
        })
      })

setTimeout(() => getUserList(routeId as string), 300)

const groupNameBtn = async () => {
  if(users.base.user_id != users.myset.user_id) {
    return Toast('只有管理员可修改群名称')
  }
  if(!users.base.name.length || users.base.name.length >= 20) {
    return Toast('名称不能为空或长度不超过20')
  }
  await groupUpdate(routeId, {name: changeGroup.name})
  users.base.name = changeGroup.name
  changeGroup.nameShow = false
}

const guUpdateBtn = async (type: string) => {
  let value: string | boolean = false
  if(type == 'remark'){
    value = users.myset.remark
    changeGroup.beizhu = false
  }
  if(type == 'nickname'){
    value = users.myset.nickname
    changeGroup.nicknameBool = false
  }
  type == 'disturb' && (value = users.myset.disturb)
  type == 'top' && (value = users.myset.top)
  type == 'shownick' && (value = users.myset.shownick)
  await groupUserUpdate(routeId, { [type]: value})
}
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
  p{
    color: #666;
  }
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

.group-name{
  padding: 3%;
  h3{
    text-align: center;
    margin: 4% 0;
  }
  span{
    font-size: .6rem;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
  }
  .group-name-btn{
    margin-top: 2rem;
    text-align: center;
  }
  p{
    text-align: center;
    font-size: .8rem;
  }
}
</style>