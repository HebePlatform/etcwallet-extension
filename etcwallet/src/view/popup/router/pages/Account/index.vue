<template>
    <div>
        <div @click="accountCreate" class="account_list">
            <img src="../../../../../assets/add.png"/>
            <div class="title" style="color: #fff">{{$t('l.account.index.txt')}}</div>
            <div class="txt" style="color: #fff">{{$t('l.account.index.txt1')}}</div>
        </div>

        <div @click="accountImport" class="account_list"
             style="margin-top: 10%;background-color: #fff;">
            <img src="../../../../../assets/import.png"/>
            <div class="title txtCr">{{$t('l.account.index.txt2')}}</div>
            <div class="txt txtCr">{{$t('l.account.index.txt3')}}</div>
        </div>
        <van-button @click="language=true"
                    style="border-radius: 50%;width: 52px;padding: 0px;height: 52px;position: absolute;bottom: 2%;left: 2%;"
                    icon="setting-o" type="info">
        </van-button>
        <van-popup
                v-model="language"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="">
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{$t('l.account.index.txt4')}}
                </div>
                <div style="margin-top: 20px">
                    <div @click="languageFn(item)" v-for="item in lang" style="overflow: hidden;cursor: pointer;background-color: #fff;display: flex;flexDirection: row;align-items: center;position: relative;
            margin: 14px;margin-top: 4px;border-radius: 5px;padding-bottom: 0;padding-top: 0;position: relative;box-shadow: 0 0 9px rgba(14, 61, 118, .16);">
                        <div style="padding: 20px 0px;overflow: hidden;height: 100%;width: 100%;margin-left: 4px;margin-right: 14px">
                            <div style="overflow: hidden">
                                <div class="txtCr" style="margin-left: 8px;font-size: 14px;float: left">
                                    {{item}}
                                </div>
                            </div>
                        </div>
                        <div v-if="item==$store.state.lang"
                             style="position: absolute;top:0;left: 0;background-color: #3C7BFF;width: 26px;height: 20px;border-top-left-radius: 6px;border-bottom-right-radius: 20px">
                            <img style="width: 20px;height: 20px;margin-left: 2px" src="../../../../../assets/select.png"/>
                        </div>
                    </div>

                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        language: false,
        lang: [
          'en-US',
          'zh-CN',
        ],
      };
    },
    methods: {
      languageFn(item) {
        this.$store.commit('setLang', item);
        this.$i18n.locale = item;
        this.language = false;
      },
      accountImport() {
        this.$router.push({ path: '/AccountImport' });
      },
      accountCreate() {
        this.$router.push({ path: '/AccountCreate' });
      },
    },
  };
</script>

<style>
    .account_list {
        cursor: pointer;
        box-shadow: 0 0 9px rgba(14, 61, 118, .16);
        border-radius: 16px;
        background-color: #3574FA;
        height: 250px;
        width: 90%;
        margin-top: 10%;
        margin-left: 5%;
        text-align: center;
    }

    .account_list img {
        width: 48px;
        margin-top: 20%;
    }

    .account_list .title {
        font-size: 18px;
        font-weight: bold;
        margin-top: 6%;
    }

    .account_list .txt {
        margin-top: 4%;
        font-size: 14px;
        margin-bottom: 10%;
    }
</style>
