import Vue from 'vue';
import App from '../view/notification/notification.vue'
import store from '../store';
import router from '../view/notification/router/index';

import $g from '../global/index';
Vue.$g = Vue.prototype.$g = $g
import axios from 'axios';
Vue.axios = Vue.prototype.$axios = axios

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

store.commit('getLang');

import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: store.state.lang,    // 语言标识
  messages: {
    'zh-CN': require('../lang/zh'),   // 中文语言包
    'en-US': require('../lang/en')    // 英文语言包x
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  i18n,
  router,
  render: h => h(App),
});
