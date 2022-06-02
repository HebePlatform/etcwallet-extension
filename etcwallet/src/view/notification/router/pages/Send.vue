<template>
    <div class="send" v-loading="sendloading">
        <van-nav-bar
                title="Send"
                :fixed="true"
                :placeholder="true"/>
        <div>
            <van-cell class="walletxt" :border="false" title="To"/>
            <van-field
                    v-if="model.to!='0x'"
                    v-model="model.to"
                    rows="1"
                    type="textarea"
                    placeholder="Please enter to address"/>
            <van-field
                    v-if="model.to=='0x'"
                    readonly
                    value="New Contract"
                    rows="1"
                    type="textarea"
                    placeholder="Please enter to address"/>
            <van-cell class="walletxt" :border="false"
                      :title="'Amount（ Balance: '+balance+' '+network.nativeCurrency.symbol+' ）'"/>
            <van-field
                    v-model="model.sum"
                    placeholder="Please enter Amount"/>

            <div style="position: relative">
                <el-row>
                    <el-col :span="12">
                        <van-cell class="walletxt" :border="false" title="Gas Price (Gwei)"/>
                        <van-field
                                v-model="model.feegasprice"
                                placeholder="Please enter Gas Price"/>
                    </el-col>
                    <el-col :span="12">
                        <van-cell class="walletxt" :border="false" title="Gas Limit"/>
                        <van-field
                                v-model="model.feegaslimit"
                                placeholder="Please enter Gas Limit"/>
                    </el-col>
                </el-row>
                <div class="vanline"></div>
            </div>
            <van-cell class="walletxt" :border="false" title="Msg"/>
            <van-field
                    :border="true"
                    v-model="model.msg"
                    rows="1"
                    type="textarea"
                    placeholder="Please enter Msg"/>
            <van-cell class="walletxt" style="visibility: hidden" :border="false" title=""/>

        </div>
        <div style="margin: 16px;padding-bottom: 40px">
            <van-button @click="save" round block type="info">Next</van-button>
        </div>
        <van-popup
                v-loading="loading"

                v-model="payshow"
                closeable
                position="bottom"
                :style="{ height: '60%' }"
        >
            <div style="text-align: center;font-size: 18px;height: 56px;line-height: 56px">
                Send
            </div>
            <div v-if="sendis">
                <div style="text-align: center;color: rgb(100, 101, 102);font-size: 14px;padding-top:18px">
                    Payment amount({{network.nativeCurrency.symbol}})
                </div>
                <div style="text-align: center;margin-top: 18px;font-size: 38px;font-family: DINPro-Medium,DIN Alternate,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;letter-spacing: -2px;">
                    {{model.sum}}
                </div>
                <div style="padding-left: 16px;">
                    <el-button v-clipboard:copy="hex"
                               v-clipboard:success="onCopy"
                               v-clipboard:error="onError" style="padding: 0" type="text">Copy Hex
                    </el-button>
                </div>
                <van-cell-group style="margin:20px 0">
                    <van-cell title="Total">
                        <template slot="extra">
                            {{(parseFloat(model.sum)+parseFloat(model.fee)).toFixed(6)}}
                        </template>
                        <template slot="label">
                            Fee:{{model.fee}}
                        </template>
                    </van-cell>
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button @click="send" round block type="info">Send</van-button>
                </div>
            </div>
            <div v-if="send200">
                <el-result style="word-break: break-all;" icon="success" title="Success">
                    <template slot="subTitle">
                        <el-link :href="'https://blockscout.com/etc/mordor/tx/'+hash+'/token-transfers'"
                                 target="_blank"
                                 type="primary">
                            {{hash}}
                        </el-link>
                    </template>
                    <template slot="extra">
                        <el-button
                                v-clipboard:copy="hash"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError" type="primary" size="medium">Copy Hash
                        </el-button>
                    </template>
                </el-result>
            </div>
            <div v-if="send400">
                <el-result style="word-break: break-all;" icon="error" title="Error" subTitle="Please try again">
                </el-result>
            </div>
        </van-popup>
    </div>
</template>

<script>
  import Web3 from 'web3';
  import axios from 'axios';

  let web3 = new Web3();
  export default {
    name: 'Send',
    data() {
      return {
        sendloading: false,
        sendis: false,
        send200: false,
        send400: false,
        loading: false,
        payshow: false,
        model: {
          from: '',
          to: '0x',
          sum: 0,
          feegasprice: 1,
          feegaslimit: 26000,
          msg: '',
          fee: 0,
        },
        hex: '',
        hash: '',
        balance: 0,
        network: {},
        wallet: {},
      };
    },
    methods: {
      onCopy() {
        this.$message({
          message: 'Copy Success',
          type: 'success',
        });
      },
      onError() {
        this.$message.error('Copy Error');
      },
      verification() {

      },
      async send() {
        this.loading = true;
        let hash = await this.$g.account.eth_sendRawTransaction(this.network.rpcUrls[0], this.hex);
        this.loading = false;
        this.sendis = false;

        if (hash != '404') {
          this.send200 = true;
          this.hash = hash;

          chrome.runtime.sendMessage(
            { sendtx: hash.transaction },
            function(response) {
              console.log(response, 'notification');
              window.close();
            },
          );
        } else {
          this.send400 = true;
        }

      },
      async save() {
        try {
          if (this.model.to.trim() == '') {
            this.$message({
              showClose: true,
              message: 'To address cannot be empty',
              type: 'error',
            });
            return;
          }
          if (this.model.feegaslimit.trim() == '') {
            this.$message({
              showClose: true,
              message: 'Gas cannot be empty',
              type: 'error',
            });
            return;
          }
          if (this.model.feegasprice.trim() == '') {
            this.$message({
              showClose: true,
              message: 'GasPrice cannot be empty',
              type: 'error',
            });
            return;
          }
          if (this.model.sum.trim() == '') {
            this.$message({
              showClose: true,
              message: 'Amount to send cannot be empty',
              type: 'error',
            });
            return;
          }
          this.sendloading = true;
          this.model.fee = web3.utils.fromWei((web3.utils.toWei(this.model.feegasprice, 'Gwei') * this.model.feegaslimit).toString(), 'ether');
          let prv = await this.$g.account.getprv();

          let wif = await this.$g.decrypt(this.wallet.encrypt, prv.pass);
          let nonce = await this.$g.account.getNonce({
            rpc: this.network.rpcUrls[0],
            addr: this.wallet.addr,
          });

          let gas = {
            'from': this.model.from,
            'to': this.model.to,
            'data': web3.utils.toHex(this.model.msg),
            'value': web3.utils.toWei(this.model.sum, 'ether'),
          };
          if (gas.data == '0x0') {
            delete gas.data;
          }
          if (gas.value == '0' || gas.value == '0x0') {
            delete gas.value;
          }
          let feegaslimit = await this.$g.account.eth_estimateGas(this.network.rpcUrls[0], gas);
          if (this.model.feegaslimit < feegaslimit) {
            this.model.feegaslimit = feegaslimit;
          }
          let txs = {
            nonce: web3.utils.toHex(nonce),
            gas: web3.utils.toHex(this.model.feegaslimit),
            value: web3.utils.toHex(web3.utils.toWei(this.model.sum, 'ether')),
            gasPrice: web3.utils.toHex(web3.utils.toWei(this.model.feegasprice, 'Gwei')),
            common: {
              baseChain: 'mainnet',
              hardfork: 'petersburg',
              customChain: {
                name: this.network.chainName,
                chainId: web3.utils.hexToNumber(this.network.chainId),
                networkId: web3.utils.hexToNumber(this.network.chainId),
              },
            },
          };
          if (this.model.to != '0x') {
            txs.to = this.model.to;
          }
          if (this.model.msg != '' && this.model.msg.trim() != '') {
            txs.data = web3.utils.toHex(this.model.msg);
          }
          let tx = await web3.eth.accounts.signTransaction(txs, wif.plaintext);
          this.hex = tx.rawTransaction;
          this.sendloading = false;
          this.payshow = true;
          this.sendis = true;
          this.send200 = false;
          this.send400 = false;
        } catch (e) {
          this.sendloading = false;
          this.$message({
            showClose: true,
            message: e.toString(),
            type: 'error',
          });
        }

      },
      onClickLeft() {
        this.$router.back(-1);
      },
    },
    async created() {
      console.log(this.$g.model, 'this.$g.model');
      this.network = await this.$g.network.getnetwork(this);

      if (web3.utils.toHex(this.$g.model.network.chainId) != this.network.chainId) {
        //错误的网络
        this.$notify({
          title: 'Prompt',
          message: 'Wrong network',
          duration: 0,
        });
        return;
      }
      this.wallet = await this.$g.account.login(this);
      if (this.$g.model.params[0].from.toLocaleLowerCase() != this.wallet.addr.toLocaleLowerCase()) {
        this.$notify({
          title: 'Prompt',
          message: 'Wrong Address',
          duration: 0,
        });
        return;
      }
      this.sendloading = true;
      this.balance = await this.$g.account.get_balance({
        network: this.network,
        wallet: this.wallet,
      });
      this.model.from = this.wallet.addr.toLocaleLowerCase();
      if (this.$g.model.params[0].to && this.$g.model.params[0].to != '0x') {
        this.model.to = this.$g.model.params[0].to;
      }
      if (this.$g.model.params[0].value) {
        this.model.sum = web3.utils.fromWei(this.$g.model.params[0].value, 'ether');
      }
      if (this.$g.model.params[0].gasLimit && this.$g.model.gasPrice) {
        this.model.feegaslimit = web3.utils.hexToNumber(this.$g.model.params[0].gasLimit);
        this.model.feegasprice = web3.utils.hexToNumber(this.$g.model.params[0].gasPrice);
        this.model.feegasprice = web3.utils.fromWei(this.$g.model.gasPrice.toString(), 'gwei');
      }
      this.model.msg = this.$g.model.params[0].data || '';
      let value = this.$g.model.params[0].value;
      if (this.$g.model.params[0].value.indexOf('0x') == -1) {
        value = web3.utils.toHex(web3.utils.toWei(this.model.sum, 'ether'));
      }
      this.model.feegaslimit = await this.$g.account.eth_estimateGas(this.network.rpcUrls[0], {
        'from': this.model.from,
        'to': this.model.to,
        'data': this.$g.model.params[0].data,
        'value': value,
      });
      this.sendloading = false;

    },
  };
</script>

<style>
    .send .vanline {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 16px;
        bottom: 0;
        left: 16px;
        border-bottom: 1px solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
    }

    .send .van-field {
        padding-top: 0 !important;
    }

    .send textarea {
        min-height: 44px !important;
    }
</style>
