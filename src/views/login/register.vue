<template>
  <div class="register">
    <van-icon class="chat-o" name="chat-o" size="3rem" />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="user.name"
          type="text"
          name='name'
          label="用户名"
          placeholder="请填写用户名"
          label-width='3.5em'
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="user.phone"
          type="tel"
          name='phone'
          label="手机号"
          placeholder="请填写手机号码"
          label-width='3.5em'
          :rules="[{ pattern: isPhone, message: '请填写正确手机号码' }]"
        />
        <van-field
          v-model="user.password"
          type="password"
          name='password'
          label="密码"
          placeholder="请填写密码"
          label-width='3.5em'
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="user.sms"
          name='sms'
          type="number"
          center
          clearable
          label="验证码"
          placeholder="请输入短信验证码"
          label-width='3.5em'
        >
          <template #button>
            <van-button size="small" type="success"
              :disabled='!user.codeSend'
              @click='sendPhoneCode'
            >
              <span v-if="user.codeSend">发送验证码</span>
              <span v-else>{{user.timer}} 秒后重新发送</span>
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button size="small" round block type="success" native-type="submit"
          :disabled='user.sms.length != 4'
        >
          提交
        </van-button>
      </div>
    </van-form>
    <router-link class="login" :to='{path: "/login"}'>已有账户，直接登录</router-link>
  </div>
  <div class="agree">注册及代表阅读并同意服务条款</div>
</template>

<script lang='ts' setup>
  import { reactive, inject, ref } from 'vue';
  import type { AxiosStatic } from 'axios';
  import { Toast } from 'vant';
  import { USER } from '../../libs/vuex';
  import { useRouter } from 'vue-router';
  import { register, postSMS } from '../../api/user';

  type dataInfo = {
    code: number,
    msg: string,
    data?: any
  }

  interface IUser {
    name: string;
    phone: string;
    password: string;
    sms: string;
    codeSend: boolean;
    timer: number;
  }
  
  const axios = inject('axios') as AxiosStatic;
  const router = useRouter()
  
  const user = reactive<IUser>({
    name: 'admin',
    phone: '18081990075',
    password: '123456',
    sms: '',
    codeSend: true,
    timer: 60
  })

  const isPhone = /^1[3-9]{1}\d{9}$/;

  const onSubmit = async (values: IUser) => {
    let ret = await register(values)
    USER.value = ret.data
    router.push('/')
  }

  const sendPhoneCode = async () => {
    if(!isPhone.test(user.phone)) return Toast('请输入正确的手机号码')
    user.codeSend = false;
    await postSMS(user.phone)
    timer()
  }

  const timer = () => {
    user.timer--
    setTimeout(() => {
      if(user.timer <= 0 ) {
        user.codeSend = true
        user.timer = 60;
        return
      }
      timer()
    }, 1000)
  }

  
</script>

<style lang='less' scoped>
.register{
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 96%;
  .chat-o{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    color: #07c160;
  }
  .login{
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