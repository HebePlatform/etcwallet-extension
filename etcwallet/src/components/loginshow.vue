<template>
    <div>
        <van-dialog :beforeClose="passsave" v-model:show="showlogin" title="Welcome back">
            <van-cell :border="false" title="PassWord"/>
            <van-field v-model="pass" type="password"
                       placeholder="Please enter wallet password"/>
        </van-dialog>
    </div>
</template>

<script>
  export default {
    name: 'loginshow',
    props: ['windowis', 'show'],
    data() {
      return {
        pass: '',
        showlogin: false,
      };
    },
    watch: {
      show() {
        console.log(this.show);
        this.showlogin = this.show;
      },
    },
    methods: {
      async passsave(action, done) {
        new Promise(async (resolve) => {
          let wallet = await this.$g.account.login(this);
          let pass = await this.$g.decrypt(wallet.encrypt, this.pass);
          if (pass.plaintext == '') {
            done();
            this.$dialog.alert({
              message: 'Wrong Password',
            }).then(() => {
              this.showlogin = true;
            });
          } else {
            await this.$g.account.transferdata({
              addr: wallet.addr,
              pass: this.pass,
            });

            if (this.windowis) {
              window.close();
            }
            this.showlogin = false;
            done();
          }
        });
      },
    },
    mounted() {
    },
  };

</script>
