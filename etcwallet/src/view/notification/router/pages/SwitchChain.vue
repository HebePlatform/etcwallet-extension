<template>
    <div class="AddAsset">
        <van-nav-bar
                title="Switch Chain"
                :fixed="true"
                :placeholder="true"/>
        <div v-loading="loading">
            <div style="color: rgb(100, 101, 102);padding:20px;font-size: 16px;">
                {{$t('l.notification.switchchain.txt')}}
            </div>
            <el-alert
                    style="font-size: 14px"
                    :title="$t('l.notification.switchchain.txt1')"
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
                        <img :src="chain.icon"
                             class="van-icon__image">
                    </template>
                    {{chain.chainName}}
                </van-button>
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
                            <van-button @click="save" round block type="info">Switch network</van-button>
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
        model: '',
        wallet: {},
        chain: {},
      };
    },
    methods: {
      async save() {
        if (this.chain.chainName != '') {
          await this.$g.save({
            key: 'network',
            value: this.chain,
          });
        } else {
          this.$message({
            showClose: true,
            message: 'nonexistent network',
            type: 'error',
          });
        }
        if (this.$g.model.type && this.$g.model.type == 'addChain') {
          chrome.runtime.sendMessage(
            { addChain: { key: 'addChain', val: '' } },
            function(response) {
              window.close();
            },
          );
        }
        chrome.runtime.sendMessage(
          { switchChain: { key: 'switchChain', val: '' } },
          function(response) {
            window.close();
          },
        );

      },
      async close() {
        if (this.$g.model.type && this.$g.model.type == 'addChain') {
          chrome.runtime.sendMessage(
            { addChain: { key: 'addChain', val: '' } },
            function(response) {
              window.close();
            },
          );
        }
        chrome.runtime.sendMessage(
          { switchChain: { key: 'switchChain', val: '' } },
          function(response) {
            window.close();
          },
        );
      },
    },
    async created() {
      this.model = this.$g.model;
      console.log(this.$g.model);
      let list = await this.$g.select('networklist');
      let chainId = web3.utils.numberToHex(this.model.params[0].chainId);
      list.forEach((item, index) => {
        if (item.chainId == chainId) {
          this.chain = item;
        }
      });
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
