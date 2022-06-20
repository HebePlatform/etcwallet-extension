<template>
    <div class="send" v-loading="sendloading">
        <van-nav-bar
                :title="$t('l.account.send.title')"
                @click-left="onClickLeft"
                left-arrow
                :fixed="true"
                :placeholder="true"/>
        <div>
            <van-cell class="walletxt" :border="false" :title="$t('l.account.send.txt')"/>
            <van-field
                    v-model="model.to"
                    rows="1"
                    type="textarea"
                    :placeholder="$t('l.account.send.txt1')"/>
            <van-cell class="walletxt" :border="false"
                      :title="'Amount（ Balance: '+$g.coin.sum+' '+$g.coin.symbol +'）'"/>
            <van-field
                    v-model="model.sum"
                    :placeholder="$t('l.account.send.txt2')"/>

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
            <van-cell v-if="$g.coin.contract==''" class="walletxt" :border="false" title="Msg"/>
            <van-field
                    v-if="$g.coin.contract==''"
                    :border="true"
                    v-model="model.msg"
                    rows="1"
                    type="textarea"
                    :placeholder="$t('l.account.send.txt3')"/>
            <van-cell class="walletxt" style="visibility: hidden" :border="false" title=""/>

        </div>
        <div style="margin: 16px;padding-bottom: 40px">
            <van-button @click="save" round block type="info">{{$t('l.account.send.txt4')}}</van-button>
        </div>
        <van-popup
                v-loading="loading"

                v-model="payshow"
                closeable
                position="bottom"
                :style="{ height: '60%' }"
        >
            <div style="text-align: center;font-size: 18px;height: 56px;line-height: 56px">
                {{$t('l.account.send.title')}}
            </div>
            <div v-if="sendis">
                <div style="text-align: center;color: rgb(100, 101, 102);font-size: 14px;padding-top:18px">
                    {{$t('l.account.send.txt5')}} ({{$g.coin.symbol}})
                </div>
                <div style="text-align: center;margin-top: 18px;font-size: 38px;font-family: DINPro-Medium,DIN Alternate,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;letter-spacing: -2px;">
                    {{model.sum}}
                </div>
                <div style="padding-left: 16px;">
                    <el-button v-clipboard:copy="hex"
                               v-clipboard:success="onCopy"
                               v-clipboard:error="onError" style="padding: 0" type="text">
                        {{$t('l.account.send.txt6')}}
                    </el-button>
                </div>
                <van-cell-group style="margin:20px 0">
                    <van-cell title="Total">
                        <template slot="extra">
                            <span v-if="$g.coin.contract==''">{{(parseFloat(model.sum)+parseFloat(model.fee)).toFixed(6)}}</span>
                            <span v-if="$g.coin.contract!=''">{{parseFloat(model.sum).toFixed(6)}}</span>
                        </template>
                        <template slot="label">
                            {{$t('l.account.send.txt7')}}:{{model.fee}} {{$store.state.wallet.list[0].symbol}}
                        </template>
                    </van-cell>
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button @click="send" round block type="info">{{$t('l.account.send.title')}}</van-button>
                </div>
            </div>
            <div v-if="send200">
                <el-result style="word-break: break-all;" icon="success" title="Success">
                    <template slot="subTitle">
                        <el-link :href="$store.state.network.blockExplorerUrls[0]+'/tx/'+hash+'/token-transfers'"
                                 target="_blank"
                                 type="primary">
                            {{hash}}
                        </el-link>
                    </template>
                    <template slot="extra">
                        <el-button
                                v-clipboard:copy="hash"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError" type="primary" size="medium">
                            {{$t('l.account.send.txt8')}}
                        </el-button>
                    </template>
                </el-result>
            </div>
            <div v-if="send400">
                <el-result style="word-break: break-all;" icon="error" title="Error"
                           :subTitle="$t('l.account.send.txt9')">
                </el-result>
            </div>
        </van-popup>
    </div>
</template>

<script>
  import Web3 from 'web3';
  import axios from 'axios';

  const { isConfusing, confusables, rectifyConfusion } = require('unicode-confusables');

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
          to: '',
          sum: 0,
          feegasprice: 1,
          feegaslimit: 26000,
          msg: '',
          fee: 0,
        },
        hex: '',
        hash: '',
      };
    },
    methods: {
      onCopy() {
        this.$message({
          showClose: true,
          message: 'Copy Success',
          type: 'success',
        });
      },
      onError() {
        this.$message({
          showClose: true,
          message: 'Copy Error',
          type: 'error',
        });
      },
      verification() {
      },
      async send() {
        this.loading = true;
        let hash = await this.$g.account.eth_sendRawTransaction(this.$store.state.network.rpcUrls[0], this.hex);

        if (hash != '404') {
          this.hash = hash.transaction;
          this.send200 = true;
        } else {
          this.send400 = true;
        }
        this.loading = false;
        this.sendis = false;
      },
      async save() {
        try
        {
          if (this.model.to.trim() == '') {
            this.$message({
              showClose: true,
              message: 'To address cannot be empty',
              type: 'error',
            });
            return;
          } else {
            let isAddress = this.$g.account.isAddress(this.model.to);
            if (!isAddress) {
              if (isConfusing(this.model.to)) {
                this.$message({
                  showClose: true,
                  message: this.$t('l.account.send.txt10'),
                  type: 'error',
                });
              }
              let hensjson = await this.$g.hens.getAllProperties(this.model.to, true);
              let addr = '';
              hensjson.listcoin.forEach(item => {
                if (item.val.toLocaleLowerCase() == this.$g.coin.symbol.toLocaleLowerCase()) {
                  addr = item.addr;
                }
              });
              if (addr == '') {
                addr = await this.$g.hens.getOwner(this.model.to);
              }
              isAddress = this.$g.account.isAddress(addr);
              if (!isAddress) {
                this.$message({
                  showClose: true,
                  message: 'Wrong address format',
                  type: 'error',
                });
                return;
              }
              this.model.to = addr;
            }
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
          let prv = await this.$g.account.getprv();

          let wif = await this.$g.decrypt(this.$store.state.wallet.encrypt, prv.pass);

          let nonce = await this.$g.account.getNonce({
            rpc: this.$store.state.network.rpcUrls[0],
            addr: this.$store.state.wallet.addr,
          });
          let model = {
            nonce: web3.utils.toHex(nonce),
            to: this.model.to,
            gas: this.model.feegaslimit,
            value: web3.utils.toWei(this.model.sum, 'ether'),
            gasPrice: web3.utils.toWei(this.model.feegasprice, 'Gwei'),
            data: web3.utils.toHex(this.model.msg),
            common: {
              baseChain: 'mainnet',
              hardfork: 'petersburg',
              customChain: {
                name: this.$store.state.network.chainName,
                chainId: web3.utils.hexToNumber(this.$store.state.network.chainId),
                networkId: web3.utils.hexToNumber(this.$store.state.network.chainId),
              },
            }
          };
          if (this.$g.coin.contract != '') {
            model.to = this.$g.coin.contract;
            delete model.value;
            let tokensum = BigInt(this.model.sum * Math.pow(10, this.$g.coin.decimals));
            let senddata = web3.eth.abi.encodeFunctionCall({
              name: 'transfer',
              type: 'function',
              inputs: [
                {
                  type: 'address',
                  name: '_to',
                },
                {
                  type: 'uint256',
                  name: '_value',
                },
              ],
            }, [this.model.to, tokensum]);
            model.data = senddata;
            this.model.msg = senddata;
          }
          let gas = {
            'from': this.model.from,
            'to': this.model.to,
            'data': web3.utils.toHex(this.model.msg),
            'value': web3.utils.toWei(this.model.sum, 'ether'),
          };
          if (gas.data == '0x0') {
            delete gas.data;
          }
          if (gas.value == '0'||gas.value == '0x0') {
            delete gas.value;
          }
          let feegaslimit = await this.$g.account.eth_estimateGas(this.$store.state.network.rpcUrls[0], gas);
          if (this.model.feegaslimit < feegaslimit) {
            this.model.feegaslimit = feegaslimit;
          }
          model.gas = this.model.feegaslimit;
          this.model.fee = web3.utils.fromWei((web3.utils.toWei(this.model.feegasprice, 'Gwei') * this.model.feegaslimit).toString(), 'ether');
          console.log(model);
          let tx = await web3.eth.accounts.signTransaction(model, wif.plaintext);
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
      this.$g.coin = this.$store.state.wallet.list[this.$g.coinindex];
      this.$g.loadbalance(this);
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
