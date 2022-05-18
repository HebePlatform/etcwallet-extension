<template>
    <div class="Transaction">
        <van-nav-bar
                :title="$t('l.account.transaction.title')"
                @click-left="onClickLeft"
                left-arrow
                :fixed="true"
                :placeholder="true">
            <template #right>
                <el-dropdown style="height: 60px; width: 60px;line-height: 60px;text-align: right;"
                             @command="handleCommand" trigger="click">
                      <span style="cursor: pointer;font-size: 20px;" class="el-dropdown-link">
                       <i class="el-icon-more"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="accountDetails" icon="el-icon-user">
                            {{$t('l.account.transaction.txt')}}
                        </el-dropdown-item>
                        <el-dropdown-item command="viewAsset" icon="el-icon-paperclip">
                            {{$t('l.account.transaction.txt1')}}
                        </el-dropdown-item>
                        <el-dropdown-item v-if="$g.coin.contract!=''" command="hide" icon="el-icon-delete">
                            {{$t('l.account.transaction.txt2')}} {{$g.coin.symbol}}
                        </el-dropdown-item>
                        <el-dropdown-item v-if="$g.coin.contract!=''" command="tokenDetails"
                                          icon="el-icon-warning-outline">
                            {{$t('l.account.transaction.txt3')}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </van-nav-bar>
        <div>
            <div style="text-align: center;margin-top: 14px">
                <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                     :src="$g.coin.logo"/>
            </div>
            <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 28px">
                {{$g.coin.sum}} {{$g.coin.symbol}}
            </div>
            <div @click="accountSend"
                 style="text-align: center;margin-top: 14px;padding-bottom: 14px;border-bottom: 1px solid #ebedf0;">
                <el-button type="primary" icon="el-icon-top-right" circle></el-button>
                <div style="color: #037dd6;font-size: 14px;margin-top: 6px">Send</div>
            </div>
            <div style="min-height: 200px" v-loading="loading">
                <div v-if="list.length!=0" v-for="item in list" @click="txfn(item)"
                     style="margin-top: 10px;height: 78px;border-bottom: 1px solid #efeff4;cursor: pointer">
                    <div v-if="item.isError=='0'" style="float: left;margin-left: 16px;margin-top: 20px;">
                        <i v-if="item.is"
                           class="el-icon-top-right"
                           style="font-size: 18px;color: #037dd6;padding: 6px;border: 1px solid #037dd6;border-radius: 50%"></i>
                        <i v-if="!item.is"
                           class="el-icon-bottom-left"
                           style="font-size: 18px;color: #037dd6;padding: 6px;border: 1px solid #037dd6;border-radius: 50%"></i>
                    </div>
                    <div v-if="item.isError=='1'" style="float: left;margin-left: 16px;margin-top: 20px;">
                        <i class="el-icon-close"
                           style="font-size: 18px;color: #ff7986;padding: 6px;border: 1px solid #ff7986;border-radius: 50%"></i>
                    </div>
                    <div style="float: left;margin-left: 20px;margin-top: 10px">
                        <div style="font-size: 18px;font-weight: 400">
                            <span v-if="item.contractAddress==''">Send</span>
                            <span v-if="item.contractAddress!=''">Contract</span>
                        </div>
                        <div style="margin-top: 8px;color: #6a737d;">From:{{$g.subname(item.from)}}</div>
                    </div>
                    <div style="float: right;margin-right: 10px;margin-top: 14px">
                        <div style="font-size: 14px;font-weight: 400;text-align: right">
                            <span v-if="!item.is">+</span><span v-if="item.is">-</span>{{parseFloat(item.value).toLocaleString()}}
                            {{$g.coin.symbol}}
                        </div>
                        <div style="margin-top:8px;color: #6a737d;text-align: right;">{{item.time}}</div>
                    </div>
                </div>
                <el-empty v-if="list.length==0" description="No data"></el-empty>

                <div v-if="pageIs" style="text-align: center;padding: 20px">
                    <el-button @click="addtx" type="text">Load More</el-button>
                </div>
            </div>

        </div>
        <van-popup
                class="popup"
                v-model="txshow"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }"
        >
            <div style="padding:16px 10px;color: #4d4d4d;font-size: 18px;font-weight: bold;">
                Send
            </div>
            <div style="overflow: hidden;padding:0px 14px;padding-top: 20px">
                <div style="overflow: hidden;">
                    <div style="color: #24292e;float: left;font-size: 14px;font-weight: bold;height: 32px;line-height: 32px;">
                        Status
                    </div>
                    <div style="float: right">
                        <el-link :href="$store.state.network.blockExplorerUrls[0]+'/tx/'+txmodel.hash+'/token-transfers'"
                                 target="_blank" :underline="false" style="font-weight: normal; padding:8px 0px;"
                                 type="primary">View on block explorer
                        </el-link>
                    </div>
                </div>
                <div style="overflow: hidden;">
                    <div style="color: #219e37;float: left;font-size: 14px;font-weight: bold;height: 32px;line-height: 32px;">
                        Confirmed
                    </div>
                    <div style="float: right">
                        <el-button v-clipboard:copy="txmodel.hash"
                                   v-clipboard:success="onCopy"
                                   v-clipboard:error="onError"
                                   style="font-weight: normal; padding:8px 0px;" type="text">Copy Transaction ID
                        </el-button>
                    </div>
                </div>
                <div style="overflow: hidden;">
                    <div style="color: #24292e;float: left;font-size: 14px;font-weight: bold;height: 32px;line-height: 32px;">
                        From
                    </div>
                    <div style="color: #24292e;float: right;font-size: 14px;font-weight: bold;height: 32px;line-height: 32px;">
                        To
                    </div>
                </div>
                <div style="overflow: hidden;margin-top: 10px">
                    <div style="width: 40%;float: left;cursor: pointer">
                        <div style="float: left">
                            <img src="../../../../../assets/icon_48.png"
                                 style="width: 32px; height: 32px; border-radius: 50%;">
                        </div>
                        <div style="float: left;line-height: 32px;margin-left: 10px;color: #6a737d">
                            {{$g.subname(txmodel.from)}}
                        </div>
                    </div>
                    <div style="width: 14%;text-align: center;float: left;margin-left: 10px;    margin-top: 2px;">
                        <i class="el-icon-right"
                           style="font-size: 14px;border: 1px solid #6a737d;color: #6a737d;padding: 6px;border-radius: 50%"></i>
                    </div>
                    <div style="width: 40%;float: left;cursor: pointer">
                        <div style="float: left;margin-left: 10px">
                            <img src="../../../../../assets/icon_48.png"
                                 style="width: 32px; height: 32px; border-radius: 50%;">
                        </div>
                        <div style="float: left;line-height: 32px;margin-left: 10px;color: #6a737d">
                            {{$g.subname(txmodel.to)}}
                        </div>
                    </div>
                </div>
                <div style="padding:16px 0px;color: #4d4d4d;font-size: 18px;font-weight: bold;">
                    Transaction
                </div>
                <div style="overflow: hidden;border-bottom: 1px solid rgb(239, 239, 244);height: 32px;line-height: 32px;">
                    <div style="color:#6a737d;float: left;font-size: 14px;">
                        Nonce
                    </div>
                    <div style="color:#6a737d;float: right">
                        {{txmodel.nonce}}
                    </div>
                </div>
                <div style="overflow: hidden;height: 32px;line-height: 32px;">
                    <div style="color: #6a737d;float: left;font-size: 14px;">
                        Amount
                    </div>
                    <div style="color: #24292e;float: right;font-weight: bold">
                        <span v-if="!txmodel.is">+</span><span v-if="txmodel.is">-</span>{{parseFloat(txmodel.value).toLocaleString()}}
                        {{$g.coin.symbol}}
                    </div>
                </div>
                <div style="overflow: hidden;height: 32px;line-height: 32px;">
                    <div style="color: #6a737d;float: left;font-size: 14px;">
                        Gas Limit (Units)
                    </div>
                    <div style="color: #6a737d;float: right">
                        {{txmodel.gas}}
                    </div>
                </div>
                <div style="overflow: hidden;height: 32px;line-height: 32px;">
                    <div style="color: #6a737d;float: left;font-size: 14px;">
                        Gas Used (Units)
                    </div>
                    <div style="color:#6a737d;float: right">
                        {{txmodel.gasUsed}}
                    </div>
                </div>
                <div style="overflow: hidden;height: 32px;line-height: 32px;">
                    <div style="color: #6a737d;float: left;font-size: 14px;">
                        Gas price
                    </div>
                    <div style="color: #6a737d;float: right">
                        {{txmodel.gasPrice}} (Gwei)
                    </div>
                </div>
                <div style="overflow: hidden;height: 32px;line-height: 32px;">
                    <div style="color: #6a737d;float: left;font-size: 14px;">
                        Total
                    </div>
                    <div style="color: #24292e;float: right;font-weight: bold">
                        <span v-if="$g.coin.contract==''">{{parseFloat(txmodel.sum)+parseFloat(txmodel.value)}}</span>
                        <span v-if="$g.coin.contract!=''">{{parseFloat(txmodel.sum)}}</span>
                    </div>
                </div>


            </div>
            <div style="margin-top: 20px">
                <van-collapse v-model="activeNames">
                    <van-collapse-item style="word-break: break-word;" title="Transaction Data" name="1">
                        {{txmodel.input}}
                    </van-collapse-item>
                </van-collapse>
            </div>

        </van-popup>
        <van-popup
                class="popup"
                v-model="tokenDetails"
                closeable
                position="right"
                :style="{ height: '100%',width:'100%' }">
            <div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    Token Details
                </div>
                <div style="text-align: center;margin-top: 14px">
                    <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                         :src="$g.coin.logo"/>
                </div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 28px">
                    {{parseFloat($g.coin.sum).toLocaleString()}} {{$g.coin.symbol}}
                </div>
                <div>
                    <div style="color: #646566;font-size: 18px;padding-left: 10px;padding-top:40px; ">
                        Token Contract Address:
                    </div>
                    <div style="position: relative;font-size: 18px;padding-left: 10px;padding-right:100px;padding-top: 20px;
                    word-break: break-word; ">
                        {{$g.coin.contract}}
                        <div style="text-align: center;cursor: pointer;position: absolute;height: 100%;
                        width: 40px;top: 0;right: 10px;">
                            <el-button style="margin-top: 20px;"
                                       v-clipboard:copy="$g.coin.contract"
                                       v-clipboard:success="onCopy"
                                       v-clipboard:error="onError"
                                       icon="el-icon-document-copy" circle>
                            </el-button>
                        </div>
                    </div>
                    <div style="color: #646566;font-size: 18px;padding-left: 10px;padding-top: 20px; ">
                        Token Decimal:
                    </div>
                    <div style="font-size: 18px;padding-left: 10px;padding-top: 20px; ">
                        {{$g.coin.decimals}}
                    </div>
                    <div style="color: #646566;font-size: 18px;padding-left: 10px;padding-top: 20px; ">
                        Network:
                    </div>
                    <div style="font-size: 18px;padding-left: 10px;padding-top: 20px; ">
                        {{$g.coin.network}}
                    </div>
                </div>
                <div style="position: absolute;bottom: 0;width: 100%">
                    <div style="margin: 16px;">
                        <van-button @click="tokenDetailsfn" round block type="info">Hide Token</van-button>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="popup"
                v-model="hide"
                closeable
                position="right"
                :style="{ height: '100%',width:'100%' }">
            <div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{$t('l.account.transaction.txt4')}}?
                </div>
                <div style="text-align: center;margin-top: 14px">
                    <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                         :src="$g.coin.logo"/>
                </div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 28px">
                    {{$g.coin.symbol}}
                </div>
                <div style="    font-size: 18px;padding: 20px 16px;">
                    {{$t('l.account.transaction.txt5')}}
                </div>
                <div style="position: absolute;bottom: 0;width: 100%">
                    <div style="margin: 16px;">
                        <van-button @click="hidefn" round block type="info">{{$t('l.account.transaction.txt4')}}
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="popup"
                v-model="accountDetails"
                closeable
                position="right"
                :style="{ height: '100%',width:'100%' }">
            <div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{$t('l.account.transaction.txt')}}
                </div>
                <div style="text-align: center;margin-top: 14px">
                    <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                         :src="$g.coin.logo"/>
                </div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 18px">
                    <div v-if="!walletnameis">
                        {{$store.state.wallet.name}}
                        <el-button @click="walletnamefn" style="font-size: 14px;;margin-left: 10px" :size="'mini'"
                                   icon="el-icon-edit-outline"
                                   circle>
                        </el-button>
                    </div>
                    <div v-if="walletnameis" style="position: relative;width: 74%;margin: 0 auto">
                        <el-input v-model="walletname"></el-input>
                        <div style="position: absolute;top: 4px;right: -40px;">
                            <el-button @click="walletnamesavefn" style="font-size: 14px;;margin-left: 10px"
                                       :size="'mini'"
                                       icon="el-icon-check"
                                       circle>
                            </el-button>
                        </div>
                    </div>
                </div>
                <div style="text-align: center">
                    <canvas id="canvas"></canvas>
                </div>
                <div style="height:64px;padding-bottom: 40px;background: #fff;width: 100%;border-bottom: 1px solid #ebedf0;">
                    <van-col span="4"></van-col>
                    <van-col span="16" class="addrcopy" style="text-align: center;height: 100%;cursor: pointer"
                             v-clipboard:copy="$store.state.wallet.addr"
                             v-clipboard:success="onCopy"
                             v-clipboard:error="onError">
                        <el-tooltip class="item" effect="dark" :content="copytxt" placement="bottom">
                            <div>
                                <div style="margin-top: 4px;font-size: 16px;word-break: break-word;">
                                    {{$store.state.wallet.addr}}
                                    <img style="width: 10px" src="../../../../../assets/copy.png"></div>
                            </div>
                        </el-tooltip>
                    </van-col>
                    <van-col span="4"></van-col>
                </div>

                <div style="position: absolute;bottom: 20px;width: 100%">
                    <div style="margin: 16px;">
                        <van-button @click="openblock" round block type="info">View account at blockscout.com
                        </van-button>
                    </div>
                    <div style="margin: 16px;">
                        <van-button @click="exportprivate" round block type="info">
                            {{$t('l.account.transaction.txt6')}}
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="popup"
                v-model="showprv"
                closeable
                position="right"
                :style="{ height: '100%',width:'100%' }">
            <div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{$t('l.account.transaction.txt7')}}
                </div>
                <div style="text-align: center;margin-top: 14px">
                    <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                         :src="$g.coin.logo"/>
                </div>
                <el-alert
                        style="margin-bottom: 40px;margin-top: 40px"
                        :title="$t('l.account.transaction.txt8')"
                        type="info"
                        effect="dark">
                </el-alert>

                <div style="height:86px;padding-bottom: 40px;background: #fff;width: 100%">
                    <van-col span="2"></van-col>
                    <van-col span="20" class="addrcopy"
                             style="border: 1px solid #ebedf0;;text-align: center;height: 100%;cursor: pointer"
                             v-clipboard:copy="wif.plaintext"
                             v-clipboard:success="onCopy"
                             v-clipboard:error="onError">
                        <el-tooltip class="item" effect="dark" :content="copytxt" placement="bottom">
                            <div>
                                <div style="padding: 10px;;margin-top: 4px;font-size: 16px;word-break: break-word;">
                                    {{wif.plaintext}}
                                    <img style="width: 10px" src="../../../../../assets/copy.png"></div>
                            </div>
                        </el-tooltip>
                    </van-col>
                    <van-col span="2"></van-col>
                </div>
                <el-alert
                        :title="$t('l.account.transaction.txt9')"
                        type="warning"
                        effect="dark">
                </el-alert>
            </div>
        </van-popup>

    </div>
</template>

<script>
  var QRCode = require('qrcode');

  export default {
    name: 'Transaction',
    data() {
      return {
        showprv: false,
        wif: '',
        walletnameis: false,
        walletname: '',
        copytxt: 'Click to copy address',
        accountDetails: false,
        hide: false,
        tokenDetails: false,
        activeNames: ['1'],
        page: 1,
        pageIs: false,
        list: [],
        loading: true,
        txshow: false,
        txmodel: {},
      };
    },
    methods: {
      async exportprivate() {
        let prv = await this.$g.account.getprv();
        this.wif = await this.$g.decrypt(this.$store.state.wallet.encrypt, prv.pass);
        this.showprv = true;
      },
      async walletnamesavefn() {
        if (this.walletname != '') {
          this.$store.state.wallet.name = this.walletname;
          this.walletnameis = false;
          this.accountDetails = false;
          await this.$g.save({
            key: this.$store.state.wallet.addr,
            value: this.$store.state.wallet,
          });
          this.$message({
            showClose: true,
            message: 'Save Success',
            type: 'success',
          });
        }
      },
      walletnamefn() {
        this.walletname = '';
        this.walletname = this.$store.state.wallet.name;
        this.walletnameis = true;
      },
      openblock() {
        window.open(this.$store.state.network.blockExplorerUrls[0] + this.$store.state.wallet.addr);
      },
      async hidefn() {
        this.$store.state.wallet.list.splice(this.$g.coinindex, 1);
        await this.$g.save({
          key: this.$store.state.wallet.addr,
          value: this.$store.state.wallet,
        });
        this.$router.push({ path: '/' });
      },
      tokenDetailsfn() {
        this.tokenDetails = false;
        this.hide = true;
      },
      handleCommand(command) {
        if (command == 'hide') {
          this.hide = true;
        }
        if (command == 'accountDetails') {
          this.accountDetails = true;
          this.$nextTick(() => {
            var canvas = document.getElementById('canvas');

            QRCode.toCanvas(canvas, this.$store.state.wallet.addr, function(error) {
              if (error) console.error(error);
            });
          });
        }
        if (command == 'tokenDetails') {
          this.tokenDetails = true;
        }
        if (command == 'viewAsset') {
          if (this.$g.coin.contract != '') {
            window.open(this.$store.state.network.blockExplorerUrls[0] + this.$g.coin.contract);
          } else {
            window.open(this.$store.state.network.blockExplorerUrls[0] + this.$store.state.wallet.addr);
          }
        }
      },
      accountSend() {
        this.$router.push({ path: '/AccountSend' });
      },
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
      txfn(item) {
        this.txmodel = item;
        this.txshow = true;
      },
      addtx() {
        this.page++;
        if (this.$g.coin.contract == '') {
          this.getTx();
        } else {
          this.getTokenTx();
        }
      },
      onClickLeft() {
        this.$router.back(-1);
      },
      getTx() {
        this.loading = true;
        let charAtxt = this.$store.state.network.blockExplorerUrls[0].charAt(this.$store.state.network.blockExplorerUrls[0].length - 1);
        let txt = '/';
        if (charAtxt == '/') {
          txt = '';
        }
        this.$axios.get(this.$store.state.network.blockExplorerUrls[0] + txt + 'api?module=account&action=txlist&address=' + this.$store.state.wallet.addr + '&page=' + this.page + '&offset=10')
          .then(res => {
            this.loading = false;
            let list = res.data.result;
            if (list.length == 10) {
              this.pageIs = true;
            } else {
              this.pageIs = false;
            }
            let decimals = this.$store.state.network.nativeCurrency.decimals;
            res.data.result.forEach(item => {
              let is = true;
              if (item.from.toLocaleLowerCase() != this.$store.state.wallet.addr.toLocaleLowerCase()) {
                is = false;
              }
              let time = this.$g.formatDateTime(parseInt(item.timeStamp) * 1000);

              let model = {
                from: item.from,
                to: item.to,
                contractAddress: item.contractAddress,
                confirmations: item.confirmations,
                hash: item.hash,
                isError: item.isError,
                is: is,
                time: time,
                value: Math.floor(item.value / Math.pow(10, decimals) * 10000) / 10000,
                nonce: item.nonce,
                gas: item.gas,
                gasPrice: this.$g.fromWei(item.gasPrice, 'gwei'),
                gasUsed: item.gasUsed,
                sum: this.$g.fromWei((item.gasUsed * item.gasPrice).toString(), 'ether'),
                input: item.input,
              };
              this.list.push(model);
            });
          });
      },
      getTokenTx() {
        this.loading = true;
        let charAtxt = this.$store.state.network.blockExplorerUrls[0].charAt(this.$store.state.network.blockExplorerUrls[0].length - 1);
        let txt = '/';
        if (charAtxt == '/') {
          txt = '';
        }

        this.$axios.get(this.$store.state.network.blockExplorerUrls[0] + txt + 'api?module=account&action=tokentx&address=' + this.$store.state.wallet.addr + '&contractaddress=' + this.$g.coin.contract + '&page=' + this.page + '&offset=10')
          .then(res => {
            this.loading = false;
            let list = res.data.result;
            console.log(list.length);
            if (list.length == 10) {
              this.pageIs = true;
            } else {
              this.pageIs = false;
            }
            let decimals = this.$store.state.network.nativeCurrency.decimals;
            res.data.result.forEach(item => {
              let is = true;
              if (item.from.toLocaleLowerCase() != this.$store.state.wallet.addr.toLocaleLowerCase()) {
                is = false;
              }
              let time = this.$g.formatDateTime(parseInt(item.timeStamp) * 1000);

              let model = {
                from: item.from,
                to: item.to,
                contractAddress: item.contractAddress,
                confirmations: item.confirmations,
                hash: item.hash,
                isError: 0,
                is: is,
                time: time,
                value: Math.floor(item.value / Math.pow(10, decimals) * 10000) / 10000,
                nonce: item.nonce,
                gas: item.gas,
                gasPrice: this.$g.fromWei(item.gasPrice, 'gwei'),
                gasUsed: item.gasUsed,
                sum: this.$g.fromWei((item.gasUsed * item.gasPrice).toString(), 'ether'),
                input: item.input,
              };
              this.list.push(model);
            });
          });
      },
    },
    async created() {
      console.log(this.$store.state.network.blockExplorerUrls[0]);
      this.$g.coin = this.$store.state.wallet.list[this.$g.coinindex];
      if (this.$g.coin.contract == '') {
        this.getTx();
      } else {
        this.getTokenTx();
      }
      this.$g.loadbalance(this);

    },
  };
</script>

<style>
    .Transaction .el-alert {
        border-radius: 0px !important;
    }


    .Transaction .popup .el-button i {
        font-size: 14px !important;
    }

    .addrcopy:hover {
        background: #f2f3f4;
    }


</style>
