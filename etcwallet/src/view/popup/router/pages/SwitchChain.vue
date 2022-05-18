<template>
    <div class="AddAsset">
        <van-nav-bar
                title="Switch Chain"
                :fixed="true"
                :placeholder="true"/>
        <div v-loading="loading">
            <div style="color: rgb(100, 101, 102);padding:20px;font-size: 16px;">
                Allow this site to switch the network?

            </div>
            <el-alert
                    style="font-size: 14px"
                    title="This will switch the selected network within MetaMask to a previously added network:"
                    type="warning"
                    :closable="false"
                    effect="dark">
            </el-alert>
            <div style="text-align: center;margin-top: 40px">
                    <van-button
                            type="default"
                            plain
                    >
                        <template #icon>
                            <img src="https://hebeswap.com/assets/0x82A618305706B14e7bcf2592D4B9324A366b6dAd/logo.png" class="van-icon__image">
                        </template>
                        Ethereum Classic
                    </van-button>
            </div>

            <div v-if="!loading"
                 style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
                <el-row>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button round block type="default">Cancel</van-button>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button round block type="info">Switch network</van-button>
                        </div>
                    </el-col>
                </el-row>

            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'AddChain',
    data() {
      return {
        loading: false,
        model: '',

        wallet: {},
      };
    },
    methods: {
      async save() {
        // let model = {
        //   contract: this.coin.contract,
        //   decimals: this.coin.decimal,
        //   logo: this.coin.logo,
        //   sum: this.coin.balance,
        //   symbol: this.coin.name,
        //   network: this.model.network.chainName,
        // };
        // let t = true;
        // console.log(this.wallet);
        // this.wallet.list.forEach(item => {
        //   if (item.contract.toLocaleLowerCase() == model.contract.toLocaleLowerCase()
        //     && item.network == model.network) {
        //     t = false;
        //   }
        // });
        // if (t) {
        //   this.wallet.list.push(model);
        //   this.$g.save({
        //     key: this.wallet.addr,
        //     value: this.wallet,
        //   });
        //   // this.$router.push({ path: '/' });
        // } else {
        //   this.$message({
        //     showClose: true,
        //     message: 'The token is already listed',
        //     type: 'error',
        //   });
        // }
      },
      async close() {
        // chrome.runtime.sendMessage(
        //   { sendsign: { key: 'sign', val: '' } },
        //   function(response) {
        //     window.close();
        //   },
        // );
      },
    },
    async created() {
      // this.loading = true;
      // this.coin.name = this.model.params.options.symbol;
      // this.coin.decimals = this.model.params.options.decimals;
      // this.coin.logo = await this.$g.imageToBase64(this.model.params.options.image);
      // this.coin.contract = this.model.params.options.address;
      // this.wallet = await this.$g.account.login(this);
      //
      // this.coin.balance = await this.$g.account.getToken_balance(this.model.network.rpcUrls[0], {
      //   addr: this.wallet.addr,
      //   contract: this.coin.contract,
      //   decimals: this.coin.decimals,
      // });
      // this.loading = false;

    },
  };
</script>

<style>
    .AddAsset .el-alert {
        border-radius: 0px !important;
    }

    .AddAsset .el-alert__title {
        font-size: 16px;
    }
</style>
