<template>
    <div class="AddAsset">
        <van-nav-bar
                :title="$t('l.notification.addchain.title')"
                :fixed="true"
                :placeholder="true"/>
        <div v-loading="loading">
            <div style="color: rgb(100, 101, 102);padding:20px;font-size: 16px;">
                {{$t('l.notification.addchain.txt')}}
            </div>
            <el-alert
                    style="font-size: 14px"
                    :title="$t('l.notification.addchain.txt1')"
                    type="warning"
                    :closable="false"
                    effect="dark">
            </el-alert>
            <el-divider></el-divider>
            <div style="padding: 0 20px">
                <div style="color: rgb(100, 101, 102);font-size: 16px;line-height: 28px">
                    Network Name:
                </div>
                <div style="text-align: left;font-size: 16px;line-height: 28px">
                    {{model.params[0].chainName}}
                </div>
                <div style="color: rgb(100, 101, 102);font-size: 16px;line-height: 28px">
                    Network URL:
                </div>
                <div style="text-align: left;font-size: 16px;line-height: 28px">
                    {{model.params[0].rpcUrls[0]}}
                </div>
                <div style="color: rgb(100, 101, 102);font-size: 16px;line-height: 28px">
                    Chain ID:
                </div>
                <div style="text-align: left;font-size: 16px;line-height: 28px">
                    {{model.params[0].chainId}}
                </div>
                <div style="color: rgb(100, 101, 102);font-size: 16px;line-height: 28px">
                    Currency Symbol:
                </div>
                <div style="text-align: left;font-size: 16px;line-height: 28px">
                    {{model.params[0].nativeCurrency.symbol}}
                </div>
                <div style="color: rgb(100, 101, 102);font-size: 16px;line-height: 28px">
                    Explorer URL:
                </div>
                <div style="text-align: left;font-size: 16px;line-height: 28px">
                    {{model.params[0].blockExplorerUrls[0]}}
                </div>
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
                            <van-button @click="save" round block type="info">Approve</van-button>
                        </div>
                    </el-col>
                </el-row>

            </div>
        </div>
    </div>
</template>

<script>
  import Web3 from 'web3';

  let web3 = new Web3();
  export default {
    name: 'AddChain',
    data() {
      return {
        loading: false,
        model: {
          'method': 'wallet_addEthereumChain',
          'params': [{
            'chainId': 61,
            'rpcUrls': ['https://www.ethercluster.com/etc'],
            'chainName': 'Ethereum Classic',
            'nativeCurrency': { 'name': 'ETC', 'decimals': 18, 'symbol': 'ETC' },
            'blockExplorerUrls': ['https://blockscout.com/etc/mainnet'],
            'iconUrls': ['https://hebe.cc/assets/logo/etc_logo.png'],
          }],
          'time': 1649955867408,
          'network': {
            'chainId': '0x3f',
            'rpcUrls': ['https://ethercluster.com/mordor'],
            'chainName': 'Ethereum Classic Mordor',
            'nativeCurrency': { 'name': 'ETC', 'decimals': 18, 'symbol': 'ETC' },
            'blockExplorerUrls': ['https://blockscout.com/etc/mordor/'],
          },
        },

        wallet: {},
      };
    },
    methods: {
      async save() {

        if (this.model.params[0].chainId == '') {
          this.$message({
            showClose: true,
            message: 'ChainId cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.model.params[0].chainName.trim() == '') {
          this.$message({
            showClose: true,
            message: 'ChainName cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.model.params[0].blockExplorerUrls.trim() == '') {
          this.$message({
            showClose: true,
            message: 'BlockExplorerUrl cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.model.params[0].nativeCurrency.symbol.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Symbol cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.model.params[0].nativeCurrency.decimals.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Decimals cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.model.params[0].rpcUrls[0].trim() == '') {
          this.$message({
            showClose: true,
            message: 'RpcUrl cannot be empty',
            type: 'error',
          });
          return;
        }

        let list = await this.$g.select('networklist');
        let t = true;
        list.forEach(item => {
          if (item.chainId == web3.utils.numberToHex(this.model.params[0].chainId)) {
            t = false;
          }
        });
        if (t) {
          let img = '';
          if (this.model.params[0].iconUrls && this.model.params[0].iconUrls[0]) {
            img = await this.$g.imageToBase64(this.model.params[0].iconUrls[0]);
          } else {
            img = await this.$g.imageToBase64('');
          }
          let model = {
            'chainId': web3.utils.numberToHex(this.model.params[0].chainId),
            'rpcUrls': this.model.params[0].rpcUrls,
            'chainName': this.model.params[0].chainName,
            'nativeCurrency': this.model.params[0].nativeCurrency,
            'blockExplorerUrls': this.model.params[0].blockExplorerUrls,
            'icon': img,
          };
          list.push(model);
          await this.$g.save({
            key: 'networklist',
            value: list,
          });
        }
        this.$g.model.type='addChain'
        this.$router.push({ path: '/SwitchChain' });
      },
      async close() {
        chrome.runtime.sendMessage(
          { addAsset: { key: 'addChain', val: '' } },
          function(response) {
            window.close();
          },
        );
      },
    },
    async created() {
      this.model = this.$g.model;

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
