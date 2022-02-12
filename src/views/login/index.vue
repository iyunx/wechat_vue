<template>
  <div class="login">
    <van-icon class="chat-o" name="chat-o" size="3rem" />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="user.phone"
          name='phone'
          placeholder="手机号"
          left-icon="phone-o"
          type='tel'
          :rules="[
            { required: true, message: '手机号不能为空' },
            { pattern: /^1[3-9]\d{9}$/, message: '请填写正确的手机号' }
          ]"
        />
        <van-field
          v-model="user.password"
          type="password"
          name='password'
          placeholder="密码"
          left-icon="more-o"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button size="small" round block type="success" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <router-link class="register" :to='{path: "/register"}'>新用户注册</router-link>
    <section class="other">
      <span>找回密码？</span>
      <aside>
        <span>紧急冻结 | </span>
        <span>更多</span>
      </aside>
    </section>
  </div>
  <div class="agree">登录及代表阅读并同意服务条款</div>
</template>

<script lang='ts' setup>
  import { reactive, ref } from 'vue';
  import { USER } from '../../libs/vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { login } from '../../api/user';
  
  const router = useRouter(),
        route = useRoute()
  
  route.query.reload && router.push('/login').then(() => location.reload())

  const user = reactive({
    phone: '18081990075',
    password: ''
  })
  const onSubmit = async (values: any) => {
    let ret = await login(values)
    USER.value = ret.data
    router.push('/')
  }
</script>

<style lang='less' scoped>
.login{
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  .chat-o{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    color: #07c160;
  }
  .register{
    text-align: center;
    font-size: 13px;
    display: block;
    color: black;
  }
  .other{
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-top: 30px;
  }
}
.agree{
  position: absolute;
  bottom: 4rem;
  font-size: 14px;
  border: 1px solid #07c160;
  padding: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 54vw;
  text-align: center;
}
</style>