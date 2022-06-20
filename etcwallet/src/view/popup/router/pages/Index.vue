<template>
    <div>
        <div style="padding:10px 0px;background: #f7f8fa">
            <van-row>
                <van-col span="4">

                </van-col>
                <van-col @click="switchChain=true" span="16"
                         style="text-align: center;line-height: 40px;cursor: pointer">
                    <div style="color: #2F4266;font-size:14px;height: 30px;width: 80%;margin-left: 10%;margin-top: 8px;line-height: 30px;">
                        {{$store.state.network.chainName}}
                        <van-icon color="#2F4266" name="arrow-down"/>
                    </div>
                </van-col>
                <van-col span="4" @click="switchaccountshowfn">
                    <div style="overflow: hidden;position: relative;border: 2px solid #037dd6;cursor: pointer;width: 40px;height: 40px;border-radius: 50%">
                        <img v-if="$store.state.wallet.img&&!$store.state.wallet.imgis"
                             style="position: absolute;top: -20px;width: 80px;left: -20px;"
                             :src="$store.state.wallet.img"/>
                        <img v-if="$store.state.wallet.img&&$store.state.wallet.imgis"
                             style="position: absolute;width: 40px;"
                             :src="$store.state.wallet.img"/>
                    </div>
                </van-col>
            </van-row>
        </div>
        <div style="height:64px;background: #fff;width: 100%;border-bottom: 1px solid #ebedf0;">
            <van-col @click="connectListfn" span="6" class="addrcopy"
                     style="text-align: center;height: 100%;cursor: pointer">
                <div style="margin-top: 18px;">
                    <i v-if="isconnect"
                       style="color: rgb(33, 158, 55);float: left; margin-top: 2px;margin-right: 4px; margin-left: 30px;font-size: 22px;"
                       class="el-icon-connection"></i>
                    <!--                    <div style="word-break:break-all;color: rgb(100, 101, 102);float: left;width: 54px;">-->
                    <!--                        Connected-->
                    <!--                    </div>-->
                    <!--                    <i style="color: #646566;float: left; margin-top: 6px;margin-right: 4px; margin-left: 8px;font-size: 18px;"-->
                    <!--                       class="el-icon-connection"></i>-->
                    <i v-if="!isconnect"
                       style="color: #646566;float: left; margin-top: 2px;margin-right: 4px; margin-left: 30px;font-size: 22px;"
                       class="el-icon-connection"></i>
                    <!--                                        <div style="word-break:break-all;color: rgb(100, 101, 102);float: left;width: 54px">-->
                    <!--                                            Not Connected-->
                    <!--                                        </div>-->
                </div>

            </van-col>
            <van-col span="12" class="addrcopy" style="text-align: center;height: 100%;cursor: pointer"
                     v-clipboard:copy="$store.state.wallet.addr"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">
                <el-tooltip class="item" effect="dark" :content="copytxt" placement="bottom">
                    <div>
                        <div style="color: #323233;font-size: 18px;margin-top: 10px">{{$store.state.wallet.name}}</div>
                        <div style="margin-top: 4px">{{$g.subname($store.state.wallet.addr)}}
                            <img style="width: 10px" src="../../../../assets/copy.png"></div>
                    </div>
                </el-tooltip>

            </van-col>
            <van-col span="6" style="text-align: right;">
                <el-dropdown @command="handleCommand"
                             style="height: 60px;width: 60px; line-height: 60px;text-align: center;" trigger="click">
                      <span style="cursor: pointer;font-size: 20px;" class="el-dropdown-link">
                       <i class="el-icon-more"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="lock" icon="el-icon-lock">
                            {{ $t('l.index.txt4')}}
                        </el-dropdown-item>
                        <el-dropdown-item command="accountDetails" icon="el-icon-user">
                            {{ $t('l.index.txt5')}}
                        </el-dropdown-item>
                        <el-dropdown-item command="viewAsset" icon="el-icon-paperclip">
                            {{ $t('l.index.txt6')}}
                        </el-dropdown-item>
                        <el-dropdown-item command="hide" icon="el-icon-delete">
                            {{ $t('l.index.txt7')}}
                        </el-dropdown-item>
                        <el-dropdown-item command="language" icon="el-icon-setting">
                            Language
                        </el-dropdown-item>

                        <el-dropdown-item v-if="faucet!=''" command="faucet" icon="el-icon-share">
                            Faucet
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </van-col>
        </div>
        <div v-if="$store.state.wallet.list">
            <div style="text-align: center;margin-top: 14px">
                <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                     :src="$store.state.wallet.list[0].logo"/>
            </div>
            <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 28px">
                <span v-if="$store.state.wallet.list">{{$store.state.wallet.list[0].sum}}</span>
                {{$store.state.wallet.list[0].symbol}}
            </div>
            <div @click="accountSend" style="text-align: center;margin-top: 14px">
                <el-button type="primary" icon="el-icon-top-right" circle></el-button>
                <div style="color: #037dd6;font-size: 14px;margin-top: 6px">
                    Send
                </div>
            </div>
        </div>
        <div v-if="$store.state.wallet.list" style="margin-top: 20px;">
            <van-tabs :title-active-color="'#037dd6'" v-model:active="activeName">
                <van-tab title="Assets">
                    <div v-for="(item,index) in $store.state.wallet.list"
                         @click="accountTransaction(index,item)"
                    >
                        <div class="addrcopy"
                             style="cursor: pointer;position: relative;display: flex;align-items: center;height: 80px;border-bottom: 1px solid #f2f2f2"
                             v-if="item.contract==''">
                            <img style="width: 46px;margin-left: 16px;border-radius: 50%"
                                 :src="item.logo">
                            <div style="margin-left: 16px;position: relative;font-size: 18px;">
                                {{item.sum}} {{item.symbol}}
                            </div>
                            <div style="position: absolute;right: 12px">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="addrcopy"
                             style="cursor: pointer;position: relative;display: flex;align-items: center;height: 80px;border-bottom: 1px solid #f2f2f2"
                             v-if="item.contract!=''&&item.chainId==$store.state.network.chainId">
                            <img style="width: 46px;margin-left: 16px;border-radius: 50%"
                                 :src="item.logo">
                            <div style="margin-left: 16px;position: relative;font-size: 18px;">
                                {{parseFloat(item.sum).toLocaleString()}} {{item.symbol}}
                            </div>
                            <div style="position: absolute;right: 12px">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center;margin-top: 20px">
                        <div style="color: #646566;font-size: 14px">
                            {{$t('l.index.txt')}}
                        </div>
                        <div>
                            <el-button @click="importToken" style="font-size: 16px;    margin-top: 10px;" type="text">
                                {{$t('l.token.import.title')}}
                            </el-button>
                        </div>
                        <div>
                            {{$t('l.index.txt1')}}
                            <a href="mailto:hebeblock@gmail.com">
                                <el-button type="text" style="font-size: 16px">Hebe Support</el-button>
                            </a>
                        </div>
                        <div style="height: 20px;width: 100%">

                        </div>
                    </div>

                </van-tab>
                <van-tab title="NFT">
                    <van-collapse v-model="activeNames" v-if="nftlist.length!=0">
                        <van-collapse-item
                                v-for="item in nftlist"
                                :key="item.contract"
                                :title="item.name" :name="item.contract">
                            <div @click="selectnftfn(item,index)" style="cursor: pointer;float: left;overflow: hidden"
                                 v-for="(items,index) in item.list">
                                <el-image
                                        :key="items.image"
                                        style="width: 100px; height: 100px;padding-right: 15px;"
                                        :src="items.image"
                                        :error="'error'">
                                    <div slot="error" style="height: 100px;line-height: 100px;text-align: center;"
                                         class="image-slot">
                                        Error
                                    </div>
                                </el-image>
                                <div style="cursor: pointer;padding-bottom: 10px;">
                                    # {{items.nftname}}
                                </div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                    <div style="text-align: center;margin-top: 20px">
                        <div style="color: #646566;font-size: 14px">
                            Don't see your NFT?
                        </div>
                        <div>
                            <el-button @click="addnft=true" style="font-size: 16px;    margin-top: 10px;" type="text">
                                Add NFT
                            </el-button>
                        </div>
                        <div style="height: 20px;width: 100%">
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <Loginshow :windowis="is" :show="show"></Loginshow>
        <van-popup
                class="popup"
                v-model="switchaccountshow"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="margin-top: 50px;position: relative">
                <div style="height: 502px;overflow-y: scroll">
                    <div v-for="item in accountlist" @click="switchaccount(item)" :key="item.key" style="overflow: hidden;cursor: pointer;background-color: #fff;display: flex;flexDirection: row;align-items: center;position: relative;
            margin: 14px;margin-top: 4px;height: 80px;border-radius: 5px;padding-bottom: 0;padding-top: 0;position: relative;box-shadow: 0 0 9px rgba(14, 61, 118, .16);">
                        <div style="float: left;overflow: hidden;position: relative;margin-left: 14px;cursor: pointer
                        ;width: 70px;height: 52px;
                        border-radius: 50%">
                            <img v-if="!item.value.imgis"
                                 style="position: absolute;top: -24px;width: 100px;left: -24px;"
                                 :src="item.value.img"/>
                            <img v-if="item.value.imgis" style="position: absolute;width: 40px;"
                                 :src="item.value.img"/>
                        </div>
                        <div style="height: 100%;width: 100%;margin-left: 4px;margin-right: 14px">
                            <div style="margin-top:12px;overflow: hidden">
                                <div class="txtCr" style="width: 40%;float: left">
                                    {{item.value.name}}
                                </div>
                                <div class="txtCr" style="margin-top: 3px;width: 60%;float: left;text-align: right;">
                                    {{item.value.list[0].sum}} {{item.value.list.symbol}}
                                </div>
                            </div>
                            <div style="font-size: 12px;color: #b4b4b4;text-align: left;margin-top: 8px;word-break: break-all;">
                                {{item.value.addr}}
                            </div>
                        </div>

                        <div v-if="$store.state.wallet.addr==item.value.addr"
                             style="position: absolute;top:0;left: 0;background-color: #3C7BFF;width: 26px;height: 20px;border-top-left-radius: 6px;border-bottom-right-radius: 20px">
                            <img style="width: 20px;height: 20px;margin-left: 2px" src="../../../../assets/select.png"/>
                        </div>
                    </div>
                </div>
                <div style="font-size: 16px;width:100%;bottom: 0;height: 48px; border-top:1px solid #efeff4;line-height: 48px;text-align: center;">
                    <div @click="accountImport"
                         style="cursor: pointer;width: 50%;background-color: #fff;float: left;height: 100%;color: #3C7BFF">
                        {{ $t('l.index.txt2')}}
                    </div>
                    <div @click="accountCreate"
                         style="cursor: pointer;width: 50%;background-color: #3C7BFF;float: left;height: 100%;color: #fff;">
                        {{ $t('l.index.txt3')}}
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="Transaction popup"
                v-model="accountDetails"
                closeable
                position="right"
                :style="{ height: '100%',width:'100%' }">
            <div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{ $t('l.index.txt5')}}
                </div>
                <div v-if="$store.state.wallet.list" style="text-align: center;margin-top: 14px">
                    <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                         :src="$store.state.wallet.list[0].logo"/>
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
                                    <img style="width: 10px" src="../../../../assets/copy.png"></div>
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
                        <van-button @click="exportprivate" round block type="info">{{
                            $t('l.account.transaction.txt6')}}
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
                    {{ $t('l.account.transaction.txt7')}}
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
                                    <img style="width: 10px" src="../../../../assets/copy.png"></div>
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
        <van-popup
                class="popup"
                v-model="hide"
                closeable
                position="right"
                :style="{ height: '100%',width:'100%' }">
            <div>
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{ $t('l.index.txt7')}}?
                </div>
                <div v-if="$store.state.wallet.list" style="text-align: center;margin-top: 14px">
                    <img style="cursor: pointer;width: 40px;height: 40px;border-radius: 50%"
                         :src="$store.state.wallet.list[0].logo"/>
                </div>
                <div style="text-align: center;padding: 20px 16px;font-weight: 500;font-size: 18px;word-break: break-word;">
                    {{$store.state.wallet.name}}
                </div>
                <div style="text-align: center;padding: 20px 16px;font-weight: 500;font-size: 16px;word-break: break-word;">
                    {{$store.state.wallet.addr}}
                </div>
                <div style="color: rgb(100, 101, 102);font-size: 16px;padding: 20px 16px;word-break: break-word;">
                    {{ $t('l.index.txt8')}}
                </div>
                <div style="position: absolute;bottom: 0;width: 100%">
                    <div style="margin: 16px;">
                        <van-button @click="hidefn" round block type="info">{{ $t('l.index.txt7')}}</van-button>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="popup"
                v-model="switchChain"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="margin-top: 50px;position: relative">
                <div style="height: 502px;overflow-y: scroll">
                    <div @click="switchChainfn(item)" v-for="(item,index) in networklist" :key="index" style="overflow: hidden;cursor: pointer;background-color: #fff;display: flex;flexDirection: row;align-items: center;position: relative;
            margin: 14px;margin-top: 4px;height: 80px;border-radius: 5px;padding-bottom: 0;padding-top: 0;position: relative;box-shadow: 0 0 9px rgba(14, 61, 118, .16);">
                        <img style="width: 52px;margin-left: 14px;border-radius: 50%"
                             :src="item.icon"/>
                        <div style="height: 100%;width: 100%;margin-left: 4px;margin-right: 14px">
                            <div style="margin-top:22px;overflow: hidden">
                                <div class="txtCr" style="font-size: 14px;float: left">
                                    {{item.chainName}}
                                </div>
                            </div>
                            <div style="font-size: 12px;color: #b4b4b4;text-align: left;margin-top: 8px;word-break: break-all;">
                                ChainId: {{item.chainId}}
                            </div>
                        </div>
                        <div v-if="item.chainId==$store.state.network.chainId"
                             style="position: absolute;top:0;left: 0;background-color: #3C7BFF;width: 26px;height: 20px;border-top-left-radius: 6px;border-bottom-right-radius: 20px">
                            <img style="width: 20px;height: 20px;margin-left: 2px" src="../../../../assets/select.png"/>
                        </div>
                        <div style="position: absolute;top: 20px;right: 10px;">
                            <el-button @click.stop="chainfn(index)" style="font-size: 14px;;margin-left: 10px"
                                       :size="'mini'"
                                       icon="el-icon-edit-outline"
                                       circle>
                            </el-button>
                        </div>
                    </div>
                </div>
                <div style="font-size: 16px;width:100%;bottom: 0;height: 48px; border-top:1px solid #efeff4;line-height: 48px;text-align: center;">
                    <div @click="addChain=true"
                         style="cursor: pointer;width: 100%;background-color: #3C7BFF;float: left;height: 100%;color: #fff;">
                        {{ $t('l.index.txt9')}}
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="addChain"
                v-model="addChain"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="">
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    {{ $t('l.index.txt9')}}
                </div>
                <div style="margin-top: 10px">
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt10')"/>
                    <van-field v-model="addChainModel.chainName" :placeholder="$t('l.index.txt11')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt12')"/>
                    <van-field v-model="addChainModel.chainId" :placeholder="$t('l.index.txt13')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt14')"/>
                    <van-field v-model="addChainModel.rpcUrls[0]" :placeholder="$t('l.index.txt15')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt16')"/>
                    <van-field v-model="addChainModel.nativeCurrency.symbol" :placeholder="$t('l.index.txt17')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt18')"/>
                    <van-field v-model="addChainModel.blockExplorerUrls[0]"
                               :placeholder="$t('l.index.txt19')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt20')"/>
                    <van-field v-model="addChainModel.nativeCurrency.decimals" :placeholder="$t('l.index.txt21')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt22')"/>
                    <van-field v-model="addChainModel.iconUrls[0]" :placeholder="$t('l.index.txt23')"/>
                    <van-cell style="visibility: hidden;padding: 0 !important;" class="walletxt" :border="false"
                              title=""/>
                </div>
                <div>
                    <div style="margin: 0px 16px;">
                        <van-button @click="saveChain" round block type="info">Save</van-button>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="addChain"
                v-model="updateChain"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="">
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    Update Chain
                </div>
                <div v-if="updateChainModel.chainId" style="margin-top: 10px">
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt10')"/>
                    <van-field v-model="updateChainModel.chainName" :placeholder="$t('l.index.txt11')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt12')"/>
                    <van-field v-model="updateChainModel.chainId" :placeholder="$t('l.index.txt13')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt14')"/>
                    <van-field v-model="updateChainModel.rpcUrl" :placeholder="$t('l.index.txt15')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt16')"/>
                    <van-field v-model="updateChainModel.symbol" :placeholder="$t('l.index.txt17')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt18')"/>
                    <van-field v-model="updateChainModel.blockExplorerUrl"
                               :placeholder="$t('l.index.txt19')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt20')"/>
                    <van-field v-model="updateChainModel.decimals" :placeholder="$t('l.index.txt21')"/>
                    <van-cell class="walletxt" :border="false" :title="$t('l.index.txt22')"/>
                    <van-field v-model="updateChainModel.iconUrl" :placeholder="$t('l.index.txt23')"/>
                    <van-cell style="visibility: hidden;padding: 0 !important;" class="walletxt" :border="false"
                              title=""/>
                </div>
                <div style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
                    <el-row v-if="updateChainModel.chainId!=$store.state.network.chainId">
                        <el-col :span="12">
                            <div style="width: 80%;margin-left: 10%">
                                <van-button @click="delchain" round block type="default">Delete</van-button>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div style="width: 80%;margin-left: 10%">
                                <van-button @click="update" round block type="info">Update</van-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row v-if="updateChainModel.chainId==$store.state.network.chainId">
                        <el-col :span="24">
                            <div style="width: 80%;margin-left: 10%">
                                <van-button @click="update" round block type="info">Update</van-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </van-popup>
        <van-popup
                class="Transaction"
                v-model="connectmodel"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="">
                <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                    Connect List
                </div>
                <div style="margin-top: 20px">
                    <div v-if="taburl!=''" style="overflow: hidden;cursor: pointer;background-color: #fff;display: flex;flexDirection: row;align-items: center;position: relative;
            margin: 14px;margin-top: 4px;border-radius: 5px;padding-bottom: 0;padding-top: 0;position: relative;box-shadow: 0 0 9px rgba(14, 61, 118, .16);">
                        <div style="padding: 20px 0px;overflow: hidden;height: 100%;width: 100%;margin-left: 4px;margin-right: 14px">
                            <div style="overflow: hidden">
                                <div class="txtCr" style="margin-left: 8px;font-size: 14px;float: left">
                                    {{taburl}}
                                </div>
                            </div>
                        </div>
                        <div style="position: absolute;top: 12px;right: 10px;">
                            <el-button @click.stop="connectaddfn()" style="font-size: 14px;;margin-left: 10px"
                                       :size="'mini'"
                                       icon="el-icon-connection"
                                       circle>
                            </el-button>
                        </div>
                    </div>
                    <div v-for="(item,index) in connectlist" :key="index" style="overflow: hidden;cursor: pointer;background-color: #fff;display: flex;flexDirection: row;align-items: center;position: relative;
            margin: 14px;margin-top: 4px;border-radius: 5px;padding-bottom: 0;padding-top: 0;position: relative;box-shadow: 0 0 9px rgba(14, 61, 118, .16);">
                        <div style="padding: 20px 0px;overflow: hidden;height: 100%;width: 100%;margin-left: 4px;margin-right: 14px">
                            <div style="overflow: hidden">
                                <div class="txtCr" style="margin-left: 8px;font-size: 14px;float: left">
                                    {{item.key}}
                                </div>
                            </div>
                        </div>
                        <div style="position: absolute;top: 12px;right: 10px;">
                            <el-button @click.stop="connectdelfn(index)" style="font-size: 14px;;margin-left: 10px"
                                       :size="'mini'"
                                       icon="el-icon-delete"
                                       circle>
                            </el-button>
                        </div>
                    </div>
                    <el-empty v-if="connectlist.length==0" description="No Connect"></el-empty>
                </div>
            </div>
        </van-popup>
        <van-popup
                v-loading="nftloading"
                v-model="addnft"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                Import NFT
            </div>
            <div style="margin-top: 10px">
                <van-cell class="walletxt" :border="false" title="Contract"/>
                <van-field v-model="nft.contract" placeholder="0x..."/>
                <van-cell class="walletxt" :border="false" title="ID"/>
                <van-field v-model="nft.id" placeholder="ID"/>
                <van-cell style="visibility: hidden;padding: 0 !important;" class="walletxt" :border="false"
                          title=""/>
            </div>
            <div style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
                <el-row>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button @click="addnft=false" round block type="default">
                                Cancel
                            </van-button>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button @click="savenft" round block type="info">Add</van-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </van-popup>
        <van-popup
                v-model="selectnft"
                closeable
                position="right"
                :style="{ width: '100%',height: '100%' }">
            <div style="text-align: center;margin-top: 14px;font-weight: 500;font-size: 22px">
                {{nftmodel.name}}
            </div>

            <div v-if="nftmodel.list" style="margin-top: 10px">
                <div style="text-align: center">
                    <el-image
                            style="width: 200px; height: 200px;"
                            :src="nftmodel.list[nftmodelindex].image"
                            :preview-src-list="srclist"
                            :error="'error'">
                        <div slot="error" style="height: 100px;line-height: 100px;text-align: center;"
                             class="image-slot">
                            Error
                        </div>
                    </el-image>
                </div>
                <van-cell class="walletxt" :border="false" title="ID"/>
                <van-field readOnly v-model="nftmodel.list[nftmodelindex].id"/>
                <van-cell class="walletxt" :border="false" title="Nft Name"/>
                <van-field readOnly v-model="nftmodel.list[nftmodelindex].nftname||nftmodel.name"/>
                <van-cell class="walletxt" :border="false" title="contract"/>
                <van-field readOnly v-model="nftmodel.contract"/>
                <van-cell style="visibility: hidden;padding: 0 !important;" class="walletxt" :border="false"
                          title=""/>

            </div>
            <div style="border-top: 1px solid #ebedf0;background-color: #fff;height: 44px;padding: 10px 0;width: 100%;position: fixed;bottom: 0">
                <el-row>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button @click="delnft" round block type="default">
                                Delete
                            </van-button>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="width: 80%;margin-left: 10%">
                            <van-button @click="shownftis=true" round block type="info">Send</van-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </van-popup>
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
                            <img style="width: 20px;height: 20px;margin-left: 2px"
                                 src="../../../../assets/select.png"/>
                        </div>
                    </div>

                </div>
            </div>
        </van-popup>
        <van-dialog showCancelButton :cancelButtonText="'Cancel'" :confirmButtonText="'Send'" :beforeClose="sendNft"
                    v-model:show="shownftis" title="Send Nft">
            <van-cell :border="false" :title="$t('l.account.send.txt')"/>
            <van-field v-model="sendnftto" type="txt"
                       :placeholder="$t('l.account.send.txt1')"/>
        </van-dialog>
    </div>
</template>

<script>
  import Loginshow from './../../../../components/loginshow';

  const { isConfusing, confusables, rectifyConfusion } = require('unicode-confusables');

  var QRCode = require('qrcode');
  import Web3 from 'web3';
  import axios from 'axios';

  let web3 = new Web3();
  export default {
    components: {
      Loginshow,
    },
    data() {
      return {
        sendnftto: '',
        shownftis: false,
        lang: [
          'en-US',
          'zh-CN',
        ],
        language: false,
        selectnft: false,
        activeNames: [],
        nftloading: false,
        addnft: false,
        updateChain: false,
        connectmodel: false,
        updateChainModel: {},
        addChainModel: {
          'chainId': 61,
          'rpcUrls': ['https://www.ethercluster.com/etc'],
          'chainName': 'Ethereum Classic',
          'nativeCurrency': { 'name': 'ETC', 'decimals': 18, 'symbol': 'ETC' },
          'blockExplorerUrls': ['https://blockscout.com/etc/mainnet'],
          'iconUrls': ['https://hebe.cc/assets/logo/etc_logo.png'],
        },
        addChain: false,
        switchChain: false,
        hide: false,
        showprv: false,
        wif: '',
        walletnameis: false,
        walletname: '',
        accountDetails: false,
        activeName: 'Assets',
        copytxt: 'Click to copy address',
        prv: '',
        show: false,
        is: false,
        switchaccountshow: false,
        accountlist: [],
        networklist: [],
        chainindex: 0,
        connectlist: [],
        taburl: '',
        isconnect: true,
        faucetlist: [
          {
            id: '0x3f',
            url: 'https://easy.hebeswap.com/#/faucet',
          },
        ],
        faucet: '',
        nft: {
          id: '',
          contract: '',
          url: '',
          name: '',
        },
        nftlist: [],
        nftmodel: '',
        nftmodelindex: -1,
        srclist: [],
      };
    },
    methods: {
      async sendNft(action, done) {
        if (action == 'cancel') {
          done();
          return;
        }
        try {
          if (this.sendnftto.trim() == '') {
            this.$message({
              showClose: true,
              message: 'To address cannot be empty',
              type: 'error',
            });
            return;
          } else {
            let isAddress = this.$g.account.isAddress(this.sendnftto);
            let addr = '';
            if (!isAddress) {
              if (isConfusing(this.sendnftto)) {
                this.$message({
                  showClose: true,
                  message: this.$t('l.account.send.txt10'),
                  type: 'error',
                });
                done();
              }
              let hensjson = await this.$g.hens.getAllProperties(this.sendnftto, true);
              hensjson.listcoin.forEach(item => {
                if (item.val.toLocaleLowerCase() == this.$g.coin.symbol.toLocaleLowerCase()) {
                  addr = item.addr;
                }
              });
              if (addr == '') {
                addr = await this.$g.hens.getOwner(this.sendnftto);
              }
              isAddress = this.$g.account.isAddress(addr);
              if (!isAddress) {
                this.$message({
                  showClose: true,
                  message: 'Wrong address format',
                  type: 'error',
                });
                done();
                return;
              }
              this.sendnftto = addr;
              done();
              setTimeout(() => {
                this.shownftis = true;
              });
              return;
            }
            addr = this.sendnftto;
            let safeTransferFrom = '';
            if (this.nftmodel.contract.toLowerCase() != '0x03f4a95d964d364614e514e8638d61cdeed4f8d4'.toLowerCase()) {

              safeTransferFrom = web3.eth.abi.encodeFunctionCall({
                name: 'transferFrom',
                type: 'function',
                inputs: [{
                  type: 'address',
                  name: '_from',
                },
                  {
                    type: 'address',
                    name: '_to',
                  }, {
                    type: 'uint256',
                    name: '_tokenId',
                  }],
              }, [this.$store.state.wallet.addr, addr, this.nftmodel.list[this.nftmodelindex].id]);
            } else {
              let getNameOfTokenId = web3.eth.abi.encodeFunctionCall({
                name: 'getNameOfTokenId',
                type: 'function',
                'inputs': [
                  {
                    'internalType': 'uint256',
                    'name': 'tokenId_',
                    'type': 'uint256',
                  },
                ],
              }, [this.nftmodel.list[this.nftmodelindex].id]);
              let getName = await axios.post(this.$store.state.network.rpcUrls[0], {
                'jsonrpc': '2.0',
                'method': 'eth_call',
                'params': [{
                  'to': this.nftmodel.contract,
                  'data': getNameOfTokenId,
                }, 'latest'],
                'id': 1,
              });

              function hex_to_ascii(str1) {
                let hex = str1.toString();
                let str = '';
                for (let n = 0; n < hex.length; n += 2) {
                  str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
                }
                return str;
              }

              let tt = web3.eth.abi.decodeLog(['bytes'], getName.data.result);
              let name = web3.utils.hexToString(tt[0]);
              if (isConfusing(name)) {
                name = hex_to_ascii(tt[0]);
                name = JSON.stringify(name);
                name = name.split('u0000')[1];
                name = name.split('"')[0];
              }
              name = name.toLowerCase();
              name=name.slice(0, -4)
              safeTransferFrom = web3.eth.abi.encodeFunctionCall({
                name: 'transfer',
                type: 'function',
                inputs: [{
                  type: 'address',
                  name: 'to',
                }, {
                  type: 'string',
                  name: 'name_',
                }],
              }, [addr, name]);
            }


            let prv = await this.$g.account.getprv();

            let wif = await this.$g.decrypt(this.$store.state.wallet.encrypt, prv.pass);

            let nonce = await this.$g.account.getNonce({
              rpc: this.$store.state.network.rpcUrls[0],
              addr: this.$store.state.wallet.addr,
            });
            let model = {
              nonce: web3.utils.toHex(nonce),
              to: this.nftmodel.contract,
              gas: 26000,
              value: '0x0',
              gasPrice: web3.utils.toWei('1', 'Gwei'),
              data: safeTransferFrom,
              common: {
                baseChain: 'mainnet',
                hardfork: 'petersburg',
                customChain: {
                  name: this.$store.state.network.chainName,
                  chainId: web3.utils.hexToNumber(this.$store.state.network.chainId),
                  networkId: web3.utils.hexToNumber(this.$store.state.network.chainId),
                },
              },
            };
            let gas = {
              'from': this.$store.state.wallet.addr,
              'to': model.to,
              'data': model.data,
            };
            if (gas.data == '0x0') {
              delete gas.data;
            }
            if (gas.value == '0' || gas.value == '0x0') {
              delete gas.value;
            }
            let feegaslimit = await this.$g.account.eth_estimateGas(this.$store.state.network.rpcUrls[0], gas);
            if (model.gas < feegaslimit) {
              model.gas = feegaslimit;
            }
            let tx = await web3.eth.accounts.signTransaction(model, wif.plaintext);

            let hash = await this.$g.account.eth_sendRawTransaction(this.$store.state.network.rpcUrls[0], tx.rawTransaction);

            if (hash != '404') {
              this.$message({
                showClose: true,
                message: 'Send Success:' + hash.transaction,
                type: 'success',
              });
              this.delnft();
            } else {
              this.$message({
                showClose: true,
                message: 'Send Error',
                type: 'error',
              });
            }
            done();
          }
        } catch (e) {

        }

      },
      languageFn(item) {
        this.$store.commit('setLang', item);
        this.$i18n.locale = item;
        this.language = false;
      },
      async delnft() {
        let nftlist = await this.$g.select('nftlist');
        if (nftlist == '') {
          nftlist = [];
        }
        let t = -1;
        nftlist.forEach((item, index) => {
          if (item.contract == this.nftmodel.contract && item.chainId == this.nftmodel.chainId
            && item.addr == this.nftmodel.addr) {
            t = index;
          }
        });
        if (t != -1) {
          nftlist[t].list.splice(this.nftmodelindex, 1);
          if (nftlist[t].list.length == 0) {
            nftlist.splice(t, 1);
          }
        }
        await this.$g.save({
          key: 'nftlist',
          value: nftlist,
        });
        this.loadnft();
        this.selectnft = false;

      },
      async selectnftfn(item, index) {
        this.selectnft = true;
        this.nftmodel = item;
        this.nftmodelindex = index;
        this.srclist = [item.list[index].image];
      },
      async savenft() {
        if (this.nft.contract.trim() == '') {
          this.$message({
            showClose: true,
            message: 'NFT contract cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.nft.id.trim() == '') {
          this.$message({
            showClose: true,
            message: 'NFT id cannot be empty',
            type: 'error',
          });
          return;
        }
        this.nftloading = true;

        let owner = await this.$g.getowner(this.$store.state.network.rpcUrls[0], this.nft.contract, this.$store.state.wallet.addr,
          this.nft.id);
        if (owner == 2) {
          this.$message({
            showClose: true,
            message: 'Wrong contract address',
            type: 'error',
          });
          this.nftloading = false;
          return;
        }
        if (!owner) {
          this.$message({
            showClose: true,
            message: this.$t('l.index.txt24'),
            type: 'error',
          });
          this.nftloading = false;
          return;
        }
        let tokenNAMEabi = web3.eth.abi.encodeFunctionCall({
          name: 'name',
          type: 'function',
          inputs: [],
        }, []);
        let res = await axios.post(this.$store.state.network.rpcUrls[0], {
          'jsonrpc': '2.0',
          'method': 'eth_call',
          'params': [
            {
              'to': this.nft.contract,
              'data': tokenNAMEabi,
            },
            'latest',
          ],
          'id': 1,
        });
        let name = web3.utils.hexToString(res.data.result);
        name = name.substring(33);
        this.nft.name = name;

        let tokenURIabi = web3.eth.abi.encodeFunctionCall({
          name: 'tokenURI',
          type: 'function',
          inputs: [
            {
              type: 'uint256',
              name: '_tokenId',
            }],
        }, [this.nft.id]);

        let ress = await axios.post(this.$store.state.network.rpcUrls[0], {
          'jsonrpc': '2.0',
          'method': 'eth_call',
          'params': [
            {
              'to': this.nft.contract,
              'data': tokenURIabi,
            },
            'latest',
          ],
          'id': 1,
        });
        let url = web3.utils.hexToString(ress.data.result);
        url = url.substring(33);
        if (url.indexOf('ipfs://') == 0) {
          url = 'https://ipfs.io/ipfs/' + url.split('ipfs://')[1];
        }
        this.nft.url = url;
        this.nft.chainId = this.$store.state.network.chainId;
        let imgurl = await axios.post('https://api.hebeswap.com/json', {
          json: this.nft.url,
        });
        if (imgurl.data == '') {
          this.$message({
            showClose: true,
            message: this.$t('l.index.txt25'),
            type: 'error',
          });
          this.nftloading = false;
        } else {
          if (imgurl.data.image.indexOf('ipfs://') == 0) {
            imgurl.data.image = 'https://ipfs.io/ipfs/' + imgurl.data.image.split('ipfs://')[1];
          }
          this.nft.image = imgurl.data.image;
          this.nft.nftname = imgurl.data.name;
        }


        let nftlist = await this.$g.select('nftlist');
        if (nftlist == '') {
          nftlist = [];
        }
        let t = '';
        nftlist.forEach(item => {
          if (item.contract == this.nft.contract && item.chainId == this.nft.chainId
            && item.addr == this.$store.state.wallet.addr) {
            t = item;
          }
        });
        if (t == '') {
          nftlist.push({
            name: this.nft.name,
            contract: this.nft.contract,
            chainId: this.nft.chainId,
            addr: this.$store.state.wallet.addr,
            list: [
              {
                id: this.nft.id,
                image: this.nft.image,
                nftname: this.nft.nftname,
              },
            ],
          });
        } else {
          t.list.push({
            id: this.nft.id,
            image: this.nft.image,
            nftname: this.nft.nftname,
          });
        }
        await this.$g.save({
          key: 'nftlist',
          value: nftlist,
        });
        this.nftloading = false;

        this.loadnft();
        this.addnft = false;
      },
      async accountCreate() {
        let accountlist = await this.$g.account.selectAll();
        let name = 'wallet' + (accountlist.length + 1);
        let account = await this.$g.account.create();
        let prv = await this.$g.account.getprv();
        if (prv == '') {
          this.show = true;
        } else {
          let img = 'data:image/png;base64,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';
          let model = {
            name: name,
            addr: account.address,
            encrypt: this.$g.encrypt(account.privateKey, prv.pass),
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
            key: account.address,
            value: model,
          });
          await this.$g.save({
            key: 'addr',
            value: {
              addr: account.address,
            },
          });

          this.$g.account.transferdata({
            addr: account.address,
            pass: prv.pass,
          });
          this.$store.commit('setWallet', model);
          this.accountlist = await this.$g.account.selectAll();

        }

      },
      async lock() {
        let _this = this;
        await this.$g.account.transferdata('');
        window.close();

      },
      async connectaddfn() {
        this.connectlist.unshift({
          key: this.taburl,
          val: [],
        });
        await this.$g.save({
          key: 'connectlist',
          value: this.connectlist,
        });
        this.taburl = '';
        this.connctlistfn1();

      },
      async connectdelfn(index) {
        this.connectlist.splice(index, 1);
        await this.$g.save({
          key: 'connectlist',
          value: this.connectlist,
        });
        this.connctlistfn1();

      },
      async connectListfn() {
        this.connectmodel = true;
        this.connctlistfn1();
      },
      async connctlistfn1() {
        this.connectlist = await this.$g.select('connectlist');
        if (this.connectlist == '') {
          this.connectlist = [];
        }
        this.taburl = '';
        let tab = await this.$g.tabsUrl();
        let taburl = tab.url;
        let listindex = -1;
        this.connectlist.forEach((item, index) => {
          if (item.key == taburl) {
            listindex = index;
          }
        });
        if (listindex != -1) {
          let item = this.connectlist.splice(listindex, 1);
          this.connectlist.unshift(item[0]);
          this.isconnect = true;
        } else {
          this.taburl = taburl;
          this.isconnect = false;
        }
      },
      async delchain() {
        let list = await this.$g.select('networklist');
        list.splice(this.chainindex, 1);
        await this.$g.save({
          key: 'networklist',
          value: list,
        });
        this.networklist = await this.$g.select('networklist');
        this.updateChain = false;
        this.$message({
          showClose: true,
          message: 'Delete Chain Success',
          type: 'success',
        });
      },
      async saveChain() {
        if (this.addChainModel.chainId.trim() == '') {
          this.$message({
            showClose: true,
            message: 'ChainId cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.addChainModel.chainName.trim() == '') {
          this.$message({
            showClose: true,
            message: 'ChainName cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.addChainModel.blockExplorerUrls[0].trim() == '') {
          this.$message({
            showClose: true,
            message: 'BlockExplorerUrl cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.addChainModel.nativeCurrency.symbol.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Symbol cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.addChainModel.nativeCurrency.decimals.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Decimals cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.addChainModel.rpcUrls[0].trim() == '') {
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
          if (item.chainId == web3.utils.numberToHex(this.addChainModel.chainId)) {
            t = false;
          }
        });
        if (t) {
          let img = await this.$g.imageToBase64(this.addChainModel.iconUrls[0]);
          let model = {
            'chainId': web3.utils.numberToHex(this.addChainModel.chainId),
            'rpcUrls': this.addChainModel.rpcUrls,
            'chainName': this.addChainModel.chainName,
            'nativeCurrency': this.addChainModel.nativeCurrency,
            'blockExplorerUrls': this.addChainModel.blockExplorerUrls,
            'icon': img,
          };


          list.push(model);
          await this.$g.save({
            key: 'networklist',
            value: list,
          });
          this.networklist = await this.$g.select('networklist');
          this.addChain = false;
          this.$message({
            showClose: true,
            message: 'Add Chain Success',
            type: 'success',
          });
        } else {
          this.$message({
            showClose: true,
            message: 'The network is already listed',
            type: 'error',
          });
        }

      },
      accountSend() {
        this.$g.coinindex = 0;
        this.$g.coin = this.$store.state.wallet.list[0];
        this.$router.push({ path: '/AccountSend' });

      },
      async update() {

        if (this.updateChainModel.chainId.trim() == '') {
          this.$message({
            showClose: true,
            message: 'ChainId cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.updateChainModel.chainName.trim() == '') {
          this.$message({
            showClose: true,
            message: 'ChainName cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.updateChainModel.blockExplorerUrl.trim() == '') {
          this.$message({
            showClose: true,
            message: 'BlockExplorerUrl cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.updateChainModel.symbol.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Symbol cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.updateChainModel.decimals.trim() == '') {
          this.$message({
            showClose: true,
            message: 'Decimals cannot be empty',
            type: 'error',
          });
          return;
        }
        if (this.updateChainModel.rpcUrl.trim() == '') {
          this.$message({
            showClose: true,
            message: 'RpcUrl cannot be empty',
            type: 'error',
          });
          return;
        }

        let list = await this.$g.select('networklist');
        let t = true;

        let img = this.updateChainModel.icon;
        img = await this.$g.imageToBase64(this.updateChainModel.iconUrl);

        let model = {
          'chainId': web3.utils.numberToHex(this.updateChainModel.chainId),
          'rpcUrls': [this.updateChainModel.rpcUrl],
          'chainName': this.updateChainModel.chainName,
          'nativeCurrency': {
            name: this.updateChainModel.symbol,
            decimals: this.updateChainModel.decimals,
            symbol: this.updateChainModel.symbol,
          },
          'blockExplorerUrls': [this.updateChainModel.blockExplorerUrl],
          'icon': img,
        };

        list[this.chainindex] = model;
        await this.$g.save({
          key: 'networklist',
          value: list,
        });
        this.networklist = await this.$g.select('networklist');
        this.addnetwork();

        this.updateChain = false;
        this.$message({
          showClose: true,
          message: 'Update Chain Success',
          type: 'success',
        });
      },
      chainfn(index) {
        this.chainindex = index;
        let updateChainModel = JSON.parse(JSON.stringify(this.networklist[index]));
        this.updateChainModel.chainName = updateChainModel.chainName;
        this.updateChainModel.chainId = updateChainModel.chainId;
        this.updateChainModel.rpcUrl = updateChainModel.rpcUrls[0];
        this.updateChainModel.symbol = updateChainModel.nativeCurrency.symbol;
        this.updateChainModel.blockExplorerUrl = updateChainModel.blockExplorerUrls[0];
        this.updateChainModel.decimals = updateChainModel.nativeCurrency.decimals;
        this.updateChainModel.iconUrl = '';
        this.updateChainModel = JSON.parse(JSON.stringify(this.updateChainModel));
        this.updateChain = true;
      },
      async switchChainfn(item) {
        await this.$g.save({
          key: 'network',
          value: item,
        });
        this.load();
        this.switchChain = false;
        chrome.runtime.sendMessage(
          { switchChain: { key: 'switchChain', val: '' } },
          function(response) {
          },
        );
      },
      async hidefn() {
        let prv = await this.$g.account.getprv();
        if (prv != '' && prv.pass) {
          this.$g.del({
            key: this.$store.state.wallet.addr,
          });
          let select = await this.$g.account.selectAll();
          if (select[0]) {
            let key = await this.$g.decrypt(select[0].value.encrypt, prv.pass);
            await this.$g.save({
              key: 'addr',
              value: {
                addr: select[0].key,
              },
            });
            this.$g.account.transferdata({
              addr: select[0].key,
              pass: prv.pass,
            });
            this.load();
            this.hide = false;
          } else {
            this.hide = false;
            this.$router.push({ path: '/AccountIndex' });
          }

        } else {
          alert('error');
        }


      },
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
        window.open(this.$store.state.network.blockExplorerUrls[0] + '/address/' + this.$store.state.wallet.addr);
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
        if (command == 'viewAsset') {
          this.openblock();
        }
        if (command == 'lock') {
          this.lock();
        }
        if (command == 'language') {
          this.language = true;
        }

        if (command == 'faucet') {
          window.open(this.faucet);
        }
      },
      async switchaccount(item) {
        let prv = await this.$g.account.getprv();
        if (prv != '' && prv.pass) {
          let key = await this.$g.decrypt(item.value.encrypt, prv.pass);
          await this.$g.save({
            key: 'addr',
            value: {
              addr: item.key,
            },
          });
          this.$g.account.transferdata({
            addr: item.key,
            pass: prv.pass,
          });
          this.load();
        } else {
          alert('error');
        }
        this.switchaccountshow = false;
      },
      async switchaccountshowfn() {
        this.accountlist = await this.$g.account.selectAll();
        this.switchaccountshow = true;
      },
      onCopy() {
        this.copytxt = 'Copy success';
        setTimeout(() => {
          this.copytxt = 'Click to copy address';
        }, 3000);
      },
      onError() {
        this.copytxt = 'Copy error';
        setTimeout(() => {
          this.copytxt = 'Click to copy address';
        }, 3000);
      },
      accountImport() {
        this.$router.push({ path: '/AccountImport' });
      },
      importToken() {
        this.$router.push({ path: '/ImportToken' });
      },
      accountTransaction(index, item) {
        this.$g.coin = item;
        this.$g.coinindex = index;
        this.$router.push({ path: '/AccountTransaction' });
      },
      async load() {
        let wallet = await this.$g.account.login(this);
        if (wallet != '') {
          this.$store.commit('setWallet', wallet);
          let prv = await this.$g.account.getprv();

          if (typeof (prv) == 'undefined' || prv == '') {
            this.show = true;
          }
          let network = await this.$g.network.getnetwork(this);
          this.$store.commit('setNetwork', network);
          await this.loadnft();
          this.hens();
          this.faucetlist.forEach(item => {
            if (item.id == network.chainId) {
              this.faucet = item.url;
            }
          });


          let balance = await this.$g.account.get_balance(this.$store.state);
          this.$store.state.wallet.list[0].sum = balance;
          this.$store.state.wallet.list[0].logo = network.icon;
          this.$store.state.wallet.list[0].symbol = network.nativeCurrency.symbol;

          await this.$g.save({
            key: this.$store.state.wallet.addr,
            value: this.$store.state.wallet,
          });
          this.$g.loadbalance(this);

        } else {
          this.$router.push({ path: '/AccountIndex' });
        }
      },
      async loadnft() {
        let nftlist = await this.$g.select('nftlist');
        if (nftlist == '') {
          nftlist = [];
        }
        this.nftlist = [];
        this.activeNames = [];

        nftlist.forEach(item => {
          if (item.addr == this.$store.state.wallet.addr && item.chainId == this.$store.state.network.chainId) {
            this.nftlist.push(item);
            this.activeNames.push(item.contract);
          }
        });
      },
      async hens() {
        let txt = await this.$g.hens.getNameOfOwner(this.$store.state.wallet.addr);
        if (txt == '') {
          let img = 'data:image/png;base64,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';
          this.$store.state.wallet.img = img;
          this.$store.state.wallet.imgis = true;
          await this.$g.save({
            key: this.$store.state.wallet.addr,
            value: this.$store.state.wallet,
          });
        } else {
          let number = await this.$g.hens.getTokenIdOfName(txt);
          if (number != '') {
            let img = await this.$g.imageToBase64('https://json.hens.domains/hens/' + number + '/hens.jpg');
            this.$store.state.wallet.img = img;
            this.$store.state.wallet.imgis = false;

            await this.$g.save({
              key: this.$store.state.wallet.addr,
              value: this.$store.state.wallet,
            });
          }
        }
      },
      addnetwork() {
        let list = [{
          chainId: '0x3f',
          rpcUrls: ['https://ethercluster.com/mordor'],
          chainName: 'Ethereum Classic Mordor',
          nativeCurrency: { name: 'ETC', decimals: 18, symbol: 'ETC' },
          blockExplorerUrls: ['https://blockscout.com/etc/mordor'],
          icon: 'data:image/png;base64,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',
        }];

        list.forEach(item => {
          let t = true;
          this.networklist.forEach(i => {
            if (item.chainId == i.chainId) {
              t = false;
            }
          });
          if (t) {
            this.networklist.push(item);
          }
        });

      },
    },
    async mounted() {

      this.load();

      this.networklist = await this.$g.select('networklist');

      this.addnetwork();

      this.connctlistfn1();
    },
  };

</script>

<style>
    .el-image-viewer__wrapper {
        z-index: 2100 !important;
    }

    .addChain .van-cell {
        padding: 6px 16px;
    }

    .addChain .van-field {
        padding: 0px 16px 6px 16px;

    }

    .Transaction .el-alert {
        border-radius: 0px !important;
    }

    .Transaction .el-button .el-icon-edit-outline {
        font-size: 14px !important;
    }

    .Transaction .el-button .el-icon-delete {
        font-size: 14px !important;
    }

    .Transaction .el-button .el-icon-check {
        font-size: 14px !important;
    }

    .Transaction .el-button .el-icon-connection {
        font-size: 14px !important;
    }

    .van-tabs__wrap {
        border-bottom: 1px solid #ebedf0;
    }

    .van-tabs__line {
        background: #037dd6 !important;

    }

    .el-button--primary {
        color: #FFF;
        background-color: #037dd6 !important;
        border-color: #037dd6f !important;
    }

    .addrcopy:hover {
        background: #f2f3f4;
    }
</style>
