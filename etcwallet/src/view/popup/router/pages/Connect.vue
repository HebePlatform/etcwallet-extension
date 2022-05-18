<template>
    <div class="Connect">
        <div style="text-align: center;margin-top: 40px">
            <van-button
                    type="default"
                    plain
            >
                <template #icon>
                    <img :src="tab.favIconUrl"
                         class="van-icon__image">
                </template>
                {{tab.url}}
            </van-button>
        </div>
        <div style="text-align: center;font-weight: 500;padding:20px;font-size: 24px;">
            Connect With Wallet
        </div>
        <div style="color: rgb(100, 101, 102);text-align: center;padding:0px 20px;font-size: 16px;padding-bottom: 20px">
            All accounts used on this Site
        </div>
        <el-alert
                title="You will authorize the following permissions:
            See address, account balance, activity and suggest transactions to approve"
                type="warning"
                :closable="false"
                effect="dark">
        </el-alert>

        <!--        <div style="padding-top: 20px">-->
        <!--            <div style="height: 340px;overflow-y: scroll">-->
        <!--                <van-checkbox-group v-model="result">-->
        <!--                    <van-cell-group>-->
        <!--                        <van-cell-->
        <!--                                v-for="(item, index) in accountlist"-->
        <!--                                clickable-->
        <!--                                :key="item.key"-->
        <!--                                @click="toggle(index)"-->
        <!--                        >-->
        <!--                            <template #title>-->
        <!--                                {{item.value.name}} &nbsp; ({{$g.subname(item.value.addr)}})-->
        <!--                            </template>-->
        <!--                            <template #label>-->
        <!--                                {{item.value.list[0].sum}}-->
        <!--                                {{item.value.list[0].symbol}}-->
        <!--                            </template>-->
        <!--                            <template #right-icon>-->
        <!--                                <van-checkbox :name="item" ref="checkboxes"/>-->
        <!--                            </template>-->
        <!--                        </van-cell>-->
        <!--                    </van-cell-group>-->
        <!--                </van-checkbox-group>-->
        <!--            </div>-->
        <!--        </div>-->
        <div
                style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
            <el-row>
                <el-col :span="12">
                    <div style="width: 80%;margin-left: 10%">
                        <van-button round block type="default">Cancel</van-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="width: 80%;margin-left: 10%">
                        <van-button @click="save" round block type="info">Connect</van-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Connect',
    data() {
      return {
        tab: {
          url: '',
          favIconUrl: '',
        },
        result: [],
        accountlist: [],
        list: [],
      };
    },
    methods: {
      async save() {
        let model = {
          key: this.tab.url,
          val: [],
        };
        this.result.forEach(item => {
          model.val.push(item.key);
        });
        this.list = await this.$g.select('connectlist');
        if(this.list==''){
          this.list=[]
        }
        let t = -1;
        this.list.forEach((item, index) => {
          if (item.key == model.key) {
            t = index;
          }
        });
        if (t == -1) {
          this.list.push(model);
        } else {
          this.list[t] = model;
        }
        await this.$g.save({
          key: 'connectlist',
          value: this.list,
        });
      },
      toggle(index) {
        this.$refs.checkboxes[index].toggle();
      },
    },
    async created() {
      this.tab = await this.$g.tabsUrl();
      this.accountlist = await this.$g.account.selectAll();
      this.list = await this.$g.select('connectlist');

      this.list.forEach(item => {
        if (item.key == this.tab.url) {
          item.val.forEach(item => {
            this.accountlist.forEach(items => {
              if (item == items.key) {
                this.result.push(items);
              }
            });
          });
        }
      });
      console.log(this.result);
    },
  };
</script>

<style scped>
    .Connect .el-alert {
        border-radius: 0px !important;
    }
</style>
