<template>
    <div>
        <van-nav-bar
                :title="title"
                :fixed="true"
                :placeholder="true"/>
        <div>
            <div style="color: rgba(69, 90, 100, 0.6);font-size: 18px;padding: 20px 10px 0 10px;text-align: center;">
                {{txt}}
            </div>
            <van-divider/>
            <div v-if="msgAfter!=''" style="padding: 0px 10px;">
                <div style="color: rgba(69, 90, 100, 0.6);font-size: 18px;">
                    {{$t('l.notification.sign.txt')}}:
                </div>
                <div style="line-height: 20px;;word-break: break-all;margin-top: 10px;font-size: 14px;margin-bottom: 20px">
                    {{msgAfter}}
                </div>
            </div>
            <div v-if="msgBefore!=''" style="padding: 0px 10px;">
                <div style="color: rgba(69, 90, 100, 0.6);font-size: 18px;">
                    {{$t('l.notification.sign.txt1')}}:
                </div>
                <div style="line-height: 20px;;word-break: break-all;margin-top: 10px;font-size: 14px;margin-bottom: 20px">
                    {{JSON.stringify(msgBefore)}}
                </div>
            </div>

            <div v-if="msg!=''" style="padding: 0px 10px;">
                <div style="color: rgba(69, 90, 100, 0.6);font-size: 18px;">
                    {{$t('l.notification.sign.txt2')}}:
                </div>
                <div style="line-height: 20px;;word-break: break-all;margin-top: 10px;font-size: 14px;margin-bottom: 100px">
                    {{JSON.stringify(msg)}}
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
            <el-row>
                <el-col :span="12">
                    <div style="width: 80%;margin-left: 10%">
                        <van-button @click="close" round block type="default">Cancel</van-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="width: 80%;margin-left: 10%">
                        <van-button @click="save" round block type="info">Agree</van-button>
                    </div>
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
  import Web3 from 'web3';

  let web3 = new Web3();
  const sig = require('@metamask/eth-sig-util');

  export default {
    name: 'Sign',
    data() {
      return {
        msg: '',
        wallet: '',
        network: '',
        title: '',
        txt: '',
        msgAfter: '',
        msgBefore: '',

      };
    },
    methods: {
      async save() {
        let prv = await this.$g.account.getprv();
        let wif = await this.$g.decrypt(this.wallet.encrypt, prv.pass);
        let key = '';
        if (this.$g.model.method == 'eth_getEncryptionPublicKey') {
          key = this.eth_getEncryptionPublicKey(wif.plaintext);
        }
        if (this.$g.model.method == 'eth_decrypt') {
          key = this.msgAfter;
        }
        if (this.$g.model.method == 'personal_sign') {
          key = this.personal_sign(wif.plaintext, this.msg);
        }
        if (this.$g.model.method == 'personal_ecRecover') {
          key = sig.recoverPersonalSignature({
            data: this.$g.model.params[0],
            signature: this.$g.model.params[1],
          });
        }
        if (this.$g.model.method == 'eth_signTypedData') {
          key = this.eth_signTypedData(wif.plaintext, this.msg);
        }
        if (this.$g.model.method == 'eth_signTypedData_v3') {
          key = this.eth_signTypedData_v3(wif.plaintext, this.msg);
        }
        if (this.$g.model.method == 'eth_signTypedData_v4') {
          key = this.eth_signTypedData_v4(wif.plaintext, this.msg);
        }
        chrome.runtime.sendMessage(
          { sendsign: { key: 'sign', val: key } },
          function(response) {
            window.close();
          },
        );
      },
      async close() {
        chrome.runtime.sendMessage(
          { sendsign: { key: 'sign', val: '' } },
          function(response) {
            window.close();
          },
        );
      },
      eth_getEncryptionPublicKey(wif) {
        return (sig.getEncryptionPublicKey(wif));
      },
      eth_decrypt(wif, txt) {
        let encryptedData = JSON.parse(web3.utils.hexToString(txt));
        return sig.decrypt({
          encryptedData: encryptedData,
          privateKey: wif,
        });
      },
      personal_sign(wif, txt) {
        let msg = `0x${Buffer.from(txt, 'utf8').toString('hex')}`;
        return sig.personalSign({
          privateKey: Buffer.from(wif, 'hex'),
          data: web3.utils.hexToString(msg),
        });
      },
      eth_signTypedData(wif, txt) {
        return sig.signTypedData({
          privateKey: Buffer.from(wif, 'hex'), data: txt, version: 'V1',
        });
      },
      eth_signTypedData_v3(wif, txt) {
        return sig.signTypedData({
          privateKey: Buffer.from(wif, 'hex'), data: txt, version: 'V3',
        });
      },
      eth_signTypedData_v4(wif, txt) {
        return sig.signTypedData({
          privateKey: Buffer.from(wif, 'hex'), data: txt, version: 'V4',
        });
      },
    },
    async created() {
      console.log(this.$g.model, 'this.$g.model');
      this.network = await this.$g.network.getnetwork(this);
      if (web3.utils.toHex(this.$g.model.network.chainId) != this.network.chainId) {
        this.$notify({
          title: 'Prompt',
          message: 'Wrong network',
          duration: 0,
        });
        return;
      }
      this.wallet = await this.$g.account.login(this);
      if (this.$g.model.method == 'eth_getEncryptionPublicKey') {
        this.title = this.$t('l.notification.sign.txt3');
        this.txt = this.$t('l.notification.sign.txt4');
      }
      if (this.$g.model.method == 'eth_decrypt') {
        this.title = this.$t('l.notification.sign.txt5');
        this.txt = this.$t('l.notification.sign.txt6');
        this.msgBefore = this.$g.model.params[0];
        let prv = await this.$g.account.getprv();
        let wif = await this.$g.decrypt(this.wallet.encrypt, prv.pass);
        this.msgAfter = this.eth_decrypt(wif.plaintext, this.msgBefore);
      }
      if (this.$g.model.method == 'personal_sign'
        || this.$g.model.method == 'eth_signTypedData_v4'
        || this.$g.model.method == 'eth_signTypedData_v3'
        || this.$g.model.method == 'eth_signTypedData') {
        this.title = this.$t('l.notification.sign.txt7');
        this.txt = this.$t('l.notification.sign.txt8');
        this.msg = this.$g.model.params[0];
        if (this.$g.model.method == 'eth_signTypedData_v4' || this.$g.model.method == 'eth_signTypedData_v3') {
          this.msg = JSON.parse(this.$g.model.params[1]);
        }
      }
      if (this.$g.model.method == 'personal_ecRecover') {
        this.title = this.$t('l.notification.sign.txt9');
        this.txt = this.$t('l.notification.sign.txt10');
        this.msg = this.$g.model.params[0];
      }
    },
  };
</script>

<style scoped>

</style>
