<template>
    <div>
        <van-nav-bar
                :title="$t('l.account.import.title')"
                @click-left="onClickLeft"
                left-arrow
                :fixed="true"
                :placeholder="true"/>
        <div>
            <van-tabs v-model="active">
                <van-tab :title="$t('l.account.import.txt')">
                    <van-cell-group>
                        <van-cell class="walletxt" :border="false" :title="$t('l.account.import.txt')"/>
                        <van-field
                                v-model="privatekey.key"
                                rows="2"
                                type="textarea"
                                :placeholder="$t('l.account.import.txt1')"/>
                        <van-cell class="walletxt" :border="false" :title="$t('l.account.import.txt2')"/>
                        <van-field v-model="privatekey.name"
                                   :placeholder="$t('l.account.import.txt3')"/>
                        <div v-if="passshow">
                            <van-cell class="walletxt" :border="false" :title="$t('l.account.import.txt4')"/>
                            <van-field v-model="privatekey.pass1" type="password"
                                       :placeholder="$t('l.account.import.txt5')"/>

                            <van-cell class="walletxt" :border="false"
                                      :title="$t('l.account.import.txt6')"/>
                            <van-field v-model="privatekey.pass2" type="password"
                                       :placeholder="$t('l.account.import.txt7')"/>

                        </div>

                    </van-cell-group>
                    <div style="margin: 16px;">
                        <van-button @click="privatekeySave" round block type="info">{{$t('l.account.import.btn')}}
                        </van-button>
                    </div>
                </van-tab>
                <!--                <van-tab title="Mnemonic">Mnemonic</van-tab>-->
                <!--                <van-tab title="Address">Address</van-tab>-->
            </van-tabs>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Import',
    data() {
      return {
        active: 0,
        privatekey: {
          key: '',
          name: '',
          pass1: '',
          pass2: '',
        },
        passshow: true,
      };
    },
    methods: {
      onClickLeft() {
        this.$router.back(-1);
      },
      async privatekeySave() {
        if (this.privatekey.name.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Wallet Name cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.privatekey.pass1.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Wallet Password cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.privatekey.pass1.trim() != this.privatekey.pass2.trim()) {
          this.$message({
            showClose: true,
            message: 'The wallet password is different twice',
            type: 'error',
          });
          return;
        }
        if (this.privatekey.pass1.length < 9) {
          this.$message({
            showClose: true,
            message: 'Password length must be greater than 9 digits',
            type: 'error',
          });
          return;
        }
        if (this.privatekey.key.indexOf('0x') == 0) {
          this.privatekey.key = this.privatekey.key.slice(2);
        }

        let img = 'data:image/png;base64,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';
        let addr = this.$g.address(this.privatekey.key);
        if(addr==''){
          this.$message({
            showClose: true,
            message: 'Wrong privatekey',
            type: 'error',
          });
         return
        }
        let model = {
          name: this.privatekey.name,
          addr: addr,
          imgis:true,
          img:img,
          encrypt: this.$g.encrypt(this.privatekey.key, this.privatekey.pass1),
          list: [
            {
              sum: 0,
              logo: img,
              decimals: 18,
              symbol: 'ETC',
              contract: '',
            },
          ],
        };
        await this.$g.save({
          key: addr,
          value: model,
        });
        await this.$g.save({
          key: 'addr',
          value: {
            addr: addr,
          },
        });

        this.$g.account.transferdata({
          addr: addr,
          pass: this.privatekey.pass1,
        });
        this.$store.commit('setWallet', model);
        this.$router.push({ path: '/' });

      },
    },
    async created() {
      let wallet = await this.$g.account.login(this);
      let accountlist = await this.$g.account.selectAll();
      this.privatekey.name = 'wallet' + (accountlist.length + 1);

      if (wallet != '') {
        this.$store.commit('setWallet', wallet);
        let prv = await this.$g.account.getprv();
        if (prv == '') {
          alert('error');
        } else {
          this.privatekey.pass1 = prv.pass;
          this.privatekey.pass2 = prv.pass;
          this.passshow = false;
        }
      } else {
        await this.$g.network.init(this);
      }
    },
  };
</script>

<style scoped>

</style>
