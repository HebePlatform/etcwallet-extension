<template>
  <div style="width: 360px;height: 600px;overflow: scroll;">
    <router-view></router-view>
    <Loginshow :windowis="is" :show="show"></Loginshow>
  </div>
</template>

<script>
  import Web3 from 'web3';

  let web3 = new Web3();
  import axios from 'axios';
  import Loginshow from './../../components/loginshow';

  export default {
    name: 'App',
    components: {
      Loginshow,
    },
    data() {
      return {
        model: {
          to: '',
          value: '',
          fee: '',
          hash: '0x3938d81235e7ec09a859db3a263e7951dc984640a60fcd7a95174442d6669353',
          gasLimit: '',
          gasPrice: '',
          from: '',
          data: '',

        },
        is: true,
        show: false,
      };
    },
    methods: {
      save() {
        // chrome.runtime.sendMessage(
        //   { getprv: '3' },
        //   function(response) {
        //     console.log(response, 'notification');
        //   },
        // );
        chrome.runtime.sendMessage(
                { sendtx: this.model.hash },
                function(response) {
                  console.log(response, 'notification');
                  window.close();
                },
        );
      },
    },
    created() {

      let _this = this;

      async function updatePopup() {
        let model = await _this.$g.select('dataValue');
        let prv = await _this.$g.account.getprv();
        if (prv == '') {
          _this.show = true;
          return;
        }
        if (model.method == 'eth_sendTransaction') {
          _this.$g.model = model;
          _this.$router.push({ path: '/AccountSend' });
        }
        if (model.method == 'wallet_watchAsset') {
          _this.$g.model = model;
          _this.$router.push({ path: '/AddAsset' });
        }
        if (model.method == 'wallet_addEthereumChain') {
          _this.$g.model = model;
          let list = await _this.$g.select('networklist');
          let t = true;
          list.forEach(item => {
            if (item.chainId == web3.utils.numberToHex(model.params[0].chainId)) {
              t = false;
            }
          });
          if (t) {
            _this.$router.push({ path: '/AddChain' });
          } else {
            _this.$router.push({ path: '/SwitchChain' });
          }
        }
        if (model.method == 'wallet_switchEthereumChain') {
          _this.$g.model = model;
          _this.$router.push({ path: '/SwitchChain' });
        }
        if (model.method == 'Connect') {
          _this.$g.model = model;
          _this.$router.push({ path: '/Connect' });
        }
        if (model.method == 'eth_pass') {
          _this.show = true;
        }
        if (model.method == 'eth_signTypedData_v4'
                || model.method == 'eth_signTypedData_v3'
                || model.method == 'eth_signTypedData'
                || model.method == 'personal_sign'
                || model.method == 'eth_getEncryptionPublicKey'
                || model.method == 'eth_decrypt'
                || model.method == 'personal_ecRecover') {
          _this.$g.model = model;
          _this.$router.push({ path: '/Sign' });
        }
      }

      document.addEventListener('DOMContentLoaded', updatePopup);
    },
  };
</script>

<style scoped>
  p {
    font-size: 20px;
  }
</style>
