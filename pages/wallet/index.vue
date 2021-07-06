<template>
  <view class="container" v-if="hasLogin">
    <view class="space-upper">
      <view class="wallet-image">
        <image src="/static/wallet.png" mode="widthFix"></image>
      </view>
      <view class="wallet-account">
        <view class="wallet-account_balance">
          <text>{{ balance }}</text>
        </view>
        <view class="wallet-account_lable">
          <text>账户余额(元)</text>
        </view>
      </view>
    </view>
    <view class="space-lower">
      <view v-if="setting.is_entrance" class="space-lower_item btn-recharge">
        <view class="btn-submit" @click="navTo('/pages/wallet/recharge/index')">充 值</view>
      </view>
      <view class="space-lower_item item-lable dis-flex flex-x-around">
        <view class="lable-text" @click="navTo('/pages/wallet/recharge/order')">
          <text>充值记录</text>
        </view>
        <view class="lable-text" @click="navTo('/pages/wallet/balance/log')">
          <text>账单详情</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SettingModel from "@/common/model/Setting";
import SettingKeyEnum from "@/common/enum/setting/Key";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // 充值设置
      setting: {is_entrance:true},
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取页面数据
    // this.getPageData()
  },
  computed: { ...mapGetters(["hasLogin", "balance"]) },
  methods: {
    // 获取页面数据
    // getPageData() {
    //   const app = this
    //   app.isLoading = true
    //   Promise.all([app.getUserInfo(), app.getSetting()])
    //     .then(() => app.isLoading = false)
    // },

    // 获取会员信息
    // getUserInfo() {
    //   const app = this
    //   return new Promise((resolve, reject) => {
    //     UserApi.info()
    //       .then(result => {
    //         app.userInfo = result.data.userInfo
    //         resolve(app.userInfo)
    //       })
    //   })
    // },

    // 获取充值设置
    getSetting() {
      const app = this;
      return new Promise((resolve, reject) => {
        SettingModel.item(SettingKeyEnum.RECHARGE.value, false).then((data) => {
          app.setting = data;
          resolve(data);
        });
      });
    },

    // 跳转接口
    navTo(url) {
      console.log("跳转路径", url);
      if (!this.hasLogin) {
        url = "/pages/public/login";
      }
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>
<style>
page {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.container {
  background: #fff;
}

.space-upper {
  padding: 150rpx 0;
  text-align: center;
}

.wallet-image image {
  width: 360rpx;
  height: 261.72rpx;
}

.wallet-account {
  margin-top: 20rpx;
}

.wallet-account_balance {
  font-size: 52rpx;
}

.wallet-account_lable {
  margin-top: 10rpx;
  color: #cec1c1;
  font-size: 24rpx;
}

.space-lower {
  margin-top: 30rpx;
  padding: 0 110rpx;
}

.btn-recharge .btn-submit {
  width: 400rpx;
  height: 84rpx;
  line-height: 84rpx;
  margin: 0 auto;
  text-align: center;
  border-radius: 50rpx;
  background: #786cff;
  color: white;
  font-size: 30rpx;
}

.item-lable {
  margin-top: 80rpx;
  font-size: 26rpx;
  color: rgb(94, 94, 94);
  padding: 0 100rpx;
}
</style>
