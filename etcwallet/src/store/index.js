import Vue from 'vue';
import Vuex from 'vuex';
import $g from '../global/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    wallet: '',
    network: '',
    lang: '',
  },
  mutations: {
    ['setWallet'](state, model) {
      state.wallet = JSON.parse(JSON.stringify(model));
    },
    ['setNetwork'](state, model) {
      state.network = JSON.parse(JSON.stringify(model));
    },
    ['getLang'](state) {
      if (localStorage.getItem('lang') != null) {
        state.lang = localStorage.getItem('lang');
        localStorage.setItem('lang', state.lang);
      } else {
        state.lang = (navigator.systemLanguage ? navigator.systemLanguage : navigator.language);
        if (state.lang != 'zh-CN' && state.lang != 'en-US') {
          state.lang = 'en-US';
        }
        localStorage.setItem('lang', state.lang);
      }
    },
    ['setLang'](state, txt) {
      state.lang = txt;
      localStorage.setItem('lang', txt);
    },
  },
});
