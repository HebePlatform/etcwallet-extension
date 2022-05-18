<template>
    <div class="AddAsset">
        <van-nav-bar
                :title="$t('l.notification.addasset.title')"
                :fixed="true"
                :placeholder="true"/>
        <div v-loading="loading">
            <div style="color: rgb(100, 101, 102);padding:20px;font-size: 16px;">
                {{$t('l.notification.addasset.txt')}}
            </div>
            <el-alert
                    style="font-size: 14px"
                    :title="$t('l.notification.addasset.txt1')"
                    type="warning"
                    :closable="false"
                    effect="dark">
            </el-alert>
            <el-divider></el-divider>
            <div style="padding: 0 20px">
                <el-row>
                    <el-col :span="12" style="color: rgb(100, 101, 102);font-size: 18px;line-height: 48px">
                        Token Logo:
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <img :src="coin.logo"
                             style="width: 48px; height: 48px;">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="color: rgb(100, 101, 102);font-size: 18px;line-height: 48px">
                        Token Name:
                    </el-col>
                    <el-col :span="12" style="text-align: right;font-size: 18px;line-height: 48px">
                        {{coin.name}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="color: rgb(100, 101, 102);font-size: 18px;line-height: 48px">Balance:
                    </el-col>
                    <el-col :span="12" style="text-align: right;font-size: 18px;line-height: 48px">
                        {{coin.balance.toLocaleString()}}
                    </el-col>
                </el-row>
            </div>
            <div v-if="!loading"
                 style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
                <el-row>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button @click="close" round block type="default">Cancel</van-button>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button @click="save" round block type="info">Add Token</van-button>
                        </div>
                    </el-col>
                </el-row>

            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'AddAsset',
    data() {
      return {
        loading: false,
        model: {},
        coin: {
          logo: '',
          name: '',
          decimals: '',
          contract: '',
          balance: 0,
        },
        wallet: {},
      };
    },
    methods: {
      async save() {
        if(this.coin.contract.trim()==''){
          this.$message({
            showClose: true,
            message: 'Contract cannot be empty',
            type: 'error',
          });
          return;
        }
        if(this.coin.decimals.trim()==''){
          this.$message({
            showClose: true,
            message: 'Decimal cannot be empty',
            type: 'error',
          });
          return;
        }
        if(this.coin.name.trim()==''){
          this.$message({
            showClose: true,
            message: 'Coin Name cannot be empty',
            type: 'error',
          });
          return;
        }
        let model = {
          contract: this.coin.contract,
          decimals: this.coin.decimals,
          logo: this.coin.logo,
          sum: this.coin.balance,
          symbol: this.coin.name,
          chainId: this.model.network.chainId,
        };
        let t = true;
        this.wallet.list.forEach(item => {
          if (item.contract.toLocaleLowerCase() == model.contract.toLocaleLowerCase()
            && item.chainId == model.chainId) {
            t = false;
          }
        });
        if (t) {
          this.wallet.list.push(model);
          await this.$g.save({
            key: this.wallet.addr,
            value: this.wallet,
          });
          // this.$router.push({ path: '/' });
        } else {

        }
        chrome.runtime.sendMessage(
          { addAsset: { key: 'addAsset', val: '' } },
          function(response) {
            window.close();
          },
        );
      },
      async close() {
        chrome.runtime.sendMessage(
          { addAsset: { key: 'addAsset', val: '' } },
          function(response) {
            window.close();
          },
        );
      },
    },
    async created() {
      this.model = this.$g.model;
      this.loading = true;
      this.coin.name = this.model.params.options.symbol;
      this.coin.decimals = this.model.params.options.decimals;
      this.coin.logo = await this.$g.imageToBase64(this.model.params.options.image);
      this.coin.contract = this.model.params.options.address;
      this.wallet = await this.$g.account.login(this);
      this.coin.balance = await this.$g.account.getToken_balance(this.model.network.rpcUrls[0], {
        addr: this.wallet.addr,
        contract: this.coin.contract,
        decimals: this.coin.decimals,
      });
      this.loading = false;

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
