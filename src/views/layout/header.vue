<template>
  <article class="header">
    <aside>
      <van-icon v-if="iconBack" @click="backBtn" name="arrow-left" />
      <slot name="left"></slot>
    </aside>
    <span>{{props.name}}</span>
    <section>
      <van-icon v-if="iconSearch" class="icon-l" name="search" />
      <van-icon v-if="iconAdd" @click.stop="addMenuShow = true" class="icon-r" name="add-o" />
      <van-icon v-if="iconMore" name="ellipsis" />
      <slot name="right"></slot>
    </section>
  </article>

  <add-item v-model='addMenuShow'></add-item>
</template>

<script lang='ts' setup>
import { computed, ref} from 'vue';
import { useRouter } from 'vue-router';
import addItem from './addMenu.vue'

const router = useRouter(),
      addMenuShow = ref(false)

const props = defineProps({
  name: {
    type: String, default: ''
  },
  headerBgColor: Boolean,
  iconBack: Boolean,
  iconSearch: Boolean,
  iconAdd: Boolean,
  iconMore: Boolean
})

const backgroundColor = computed(() => props.headerBgColor ? 'white' : '#eee' )

const backBtn = () => router.back()

</script>

<style lang='less' scoped>
.header{
  position: fixed;
  top: 0;
  width: 100%;
  height: 45px;
  z-index: 100;
  background-color: v-bind(backgroundColor);
  aside{
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  span{
    display: block;
    text-align: center;
    line-height: 45px;
  }
  section{
    position: absolute;
    display: flex;
    font-size: 18px;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    .icon-l{
      margin-right: 10px;
      font-size: 20px;
    }
    .icon-r{
      font-size: 18px;
    }
  }
}
</style>