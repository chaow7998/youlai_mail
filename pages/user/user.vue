<template>
  <view class="container">
    <button class="btn" @click.stop="secPlatform" :disabled="hasLogin">
      <view class="user-section">
        <image class="bg" src="/static/user-bg.jpg"></image>
        <view class="user-info-box">
          <view class="portrait-box">
            <image
              class="portrait"
              :src="avatar || '/static/missing-face.png'"
            ></image>
          </view>
          <view class="info-box">
            <text class="username">{{ nickname || "游客" }}</text>
          </view>
        </view>
        <!-- <view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				<view class="b-btn">立即开通</view>
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					有来会员
				</view>
				<text class="e-m">有来 Union</text>
				<text class="e-b">开通会员开发无bug 一测就上线</text>
			</view> -->
      </view>
    </button>

    <view
      class="cover-container"
      :style="[
        {
          transform: coverTransform,
          transition: coverTransition,
        },
      ]"
      @touchstart="coverTouchstart"
      @touchmove="coverTouchmove"
      @touchend="coverTouchend"
    >
      <image class="arc" src="/static/arc.png"></image>
      <view class="tj-item" @click="navTo('/pages/collect/collect')">
        <text class="num">{{ balance | moneyFormatter }}</text>
        <text>余额</text>
      </view>
      <view class="tj-item" @click="navTo('/pages/coupon/coupon')">
        <text class="num">0</text>
        <text>优惠券</text>
      </view>
      <view class="tj-item" @click="navTo('/pages/integral/integral')">
        <text class="num">0</text>
        <text>积分</text>
      </view>
    </view>
    <!-- 订单 -->
    <view class="order-section">
      <view
        class="order-item"
        @click="navTo('/pages/order/order?status=0')"
        hover-class="common-hover"
        :hover-stay-time="50"
      >
        <text class="yticon icon-shouye"></text>
        <text>全部订单</text>
      </view>
      <view
        class="order-item"
        style="position: relative"
        @click="navTo('/pages/order/order?status=101')"
        hover-class="common-hover"
        :hover-stay-time="50"
      >
        <text class="yticon icon-daifukuan"></text>
        <text>待付款</text>
        <text class="order-badge">3</text
        ><!-- v-if="item.count && item.count > 0" -->
      </view>
      <view
        class="order-item"
        @click="navTo('/pages/order/order?status=301')"
        hover-class="common-hover"
        :hover-stay-time="50"
      >
        <text class="yticon icon-yishouhuo"></text>
        <text>待发货</text>
        <text class="order-badge">3</text>
      </view>
      <view
        class="order-item"
        @click="navTo('/pages/order/order?status=901')"
        hover-class="common-hover"
        :hover-stay-time="50"
      >
        <text class="yticon icon-shouhoutuikuan"></text>
        <text>已完成</text>
      </view>
    </view>
    <!-- 浏览历史 -->
    <view class="history-section icon">
      <view class="sec-header">
        <text class="yticon icon-lishijilu"></text>
        <text>浏览历史</text>
      </view>
      <scroll-view scroll-x enable-flex class="h-list">
        <!-- @click="navTo(`/pages/footprint/footprint`)" -->
        <scroll-wrapper>
          <view-item v-for="(item, index) in footprintList" :key="index">
            <image
              @click.stop="navTo(`/pages/product/product?id=${item.id}`)"
              :src="item.list_pic_url"
              mode="aspectFill"
            ></image>
          </view-item>
        </scroll-wrapper>
      </scroll-view>
      <view class="line"></view>
      <list-cell
        icon="icon-iconfontweixin"
        iconColor="#e07472"
        title="我的钱包"
        tips="您的会员还有3天过期"
        @eventClick="navTo('/pages/wallet/index')"
      ></list-cell>
      <list-cell
        icon="icon-dizhi"
        iconColor="#5fcda2"
        title="地址管理"
        @eventClick="navTo('/pages/address/address')"
      ></list-cell>
      <list-cell
        icon="icon-share"
        iconColor="#9789f7"
        title="分享"
        tips="邀请好友赢10万大礼"
        @eventClick="navTo('/pages/share/share')"
      ></list-cell>
      <list-cell
        icon="icon-pinglun-copy"
        iconColor="#ee883b"
        title="晒单"
        tips="晒单抢红包"
        @eventClick="navTo('/pages/unboxing/unboxing')"
      ></list-cell>
      <list-cell
        icon="icon-shoucang_xuanzhongzhuangtai"
        iconColor="#54b4ef"
        title="我的收藏"
        @eventClick="navTo('/pages/collect/collect')"
      ></list-cell>
      <list-cell
        icon="icon-shezhi1"
        iconColor="#e07472"
        title="设置"
        border=""
        @eventClick="navTo('/pages/set/set')"
      ></list-cell>
    </view>
  </view>
</template>
<script>
import listCell from "@/components/mix-list-cell";
import { mapState } from "vuex";
let startY = 0,
  moveY = 0,
  pageAtTop = true;
export default {
  components: {
    listCell,
  },
  data() {
    return {
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false,
      footprintList: [],
      platform: "",
    };
  },
  onShow() {},
  onLoad() {
    this.getList();
    this.getSystemInfo();
  },
  // #ifdef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navTo("/pages/set/set");
    } else if (index === 1) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.hideTitleNViewButtonRedDot({
        index,
      });
      // #endif
      uni.navigateTo({
        url: "/pages/notice/notice",
      });
    }
  },
  // #endif
  computed: {
    ...mapState({
      avatar: (state) => state.user.avatar,
      balance: (state) => state.user.balance,
      nickname: (state) => state.user.nickname,
      hasLogin: (state) => state.user.hasLogin,
    }),
  },
  methods: {
    getList() {
      this.footprintList = [
        {
          add_time: 0,
          id: 64, //spuid
          list_pic_url:
            "https://img0.baidu.com/it/u=1753589914,3429261228&fm=26&fmt=auto&gp=0.jpg",
          name: "平滑细篾头层青碳化竹凉席",
          goods_brief: "细篾整密，凉滑不夹肉",
          retail_price: 259,
        },
        {
          add_time: 0,
          id: 64, //spuid
          list_pic_url:
            "https://img0.baidu.com/it/u=1753589914,3429261228&fm=26&fmt=auto&gp=0.jpg",
          name: "平滑细篾头层青碳化竹凉席",
          goods_brief: "细篾整密，凉滑不夹肉",
          retail_price: 259,
        },
        {
          add_time: 0,
          id: 64, //spuid
          list_pic_url:
            "https://img0.baidu.com/it/u=1753589914,3429261228&fm=26&fmt=auto&gp=0.jpg",
          name: "平滑细篾头层青碳化竹凉席",
          goods_brief: "细篾整密，凉滑不夹肉",
          retail_price: 259,
        },
      ];
    },

    // 微信登录
    getUserProfile() {
      uni.getUserProfile({
        lang: "zh_CN",
        desc: "获取用户相关信息",
        success: (response) => {
          this.login(response.rawData);
        },
      });
    },
    async login(rawData) {
      this.$store
        .dispatch("user/login", {
          code: await this.getCode(),
          rawData,
        })
        .then((res) => {
          this.$store.dispatch("user/getUserInfo");
        })
        .catch((err) => {
          console.log("login请求出错", err);
        });
    },
    // 获取code
    getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: "weixin",
          success: (res) => {
            resolve(res.code);
          },
          fail: reject,
        });
      });
    },
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navTo(url) {
      console.log("跳转路径", url);
      if (!this.hasLogin) {
        url = "/pages/public/login";
      }
      uni.navigateTo({
        url,
      });
    },

    /**
     *  会员卡下拉和回弹
     *  1.关闭bounce避免ios端下拉冲突
     *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
     *    transition设置0.1秒延迟，让css来过渡这段空窗期
     *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
     */
    coverTouchstart(e) {
      if (pageAtTop === false) {
        return;
      }
      this.coverTransition = "transform .1s linear";
      startY = e.touches[0].clientY;
    },
    coverTouchmove(e) {
      moveY = e.touches[0].clientY;
      let moveDistance = moveY - startY;
      if (moveDistance < 0) {
        this.moving = false;
        return;
      }
      this.moving = true;
      if (moveDistance >= 80 && moveDistance < 100) {
        moveDistance = 80;
      }

      if (moveDistance > 0 && moveDistance <= 80) {
        this.coverTransform = `translateY(${moveDistance}px)`;
      }
    },
    coverTouchend() {
      if (this.moving === false) {
        return;
      }
      this.moving = false;
      this.coverTransition = "transform 0.3s cubic-bezier(.21,1.93,.53,.64)";
      this.coverTransform = "translateY(0px)";
    },

    // 选择登录API
    secPlatform() {
      const app = this;
      if (app.platform == "devtools") {
        app.getUserProfile();
      } else {
        app.handleThirdLoginApp();
      }
    },

    // 获取系统信息
    getSystemInfo() {
      const app = this;
      uni.getSystemInfo({
        success: function (res) {
          app.platform = res.platform;
        },
      });
    },
    // 第三方微信授权登录
    handleThirdLoginApp() {
      var that = this;
      uni.getProvider({
        service: "oauth",
        success: function (res) {
          if (~res.provider.indexOf("weixin")) {
            uni.login({
              provider: "weixin",

              success: function (loginRes) {
                console.log("App微信获取用户信息成功", loginRes);

                that.getApploginData(loginRes); //请求登录接口方法
              },

              fail: function (res) {
                console.log("App微信获取用户信息失败", res);
              },
            });
          }
        },
      });
    },

    //请求登录接口方法

    getApploginData(data) {
      var that = this;

      //这边是前端自己去调微信用户信息的接口，根据接口需要请求，如果不需要前端去获取的话就交给后端，可省去次操作

      uni.request({
        url:
          "https://api.weixin.qq.com/sns/userinfo?access_token=" +
          data.authResult.access_token +
          "&openid=" +
          data.authResult.openid,

        method: "GET",

        dataType: "json",

        header: {
          "content-type": "application/x-www-form-urlencoded", // 默认值
        },

        success(res) {
          console.log("【登录回调啾啾啾】", res);

          that.$api.ajax(
            "smdc/index/applogin",
            res.data,
            function (ret) {
              console.log("登录接口成功回调：", ret);
            },
            "POST",
            true
          );
        },
        fail() {},
      });
    },
  },
};
</script>
<style lang="scss">
%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}
.line {
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #fff;
  padding-left: 30rpx;
  border-top: 1px solid #e1e1e1;
}
.user-section {
  height: 520upx;
  padding: 100upx 30upx 0;
  // position: relative;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: 0.7;
  }
}
.btn {
  width: 100%;
  height: 100%;
}
.user-info-box {
  height: 180upx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .portrait {
    width: 130upx;
    height: 130upx;
    border: 5upx solid #fff;
    border-radius: 50%;
  }

  .username {
    font-size: $font-lg + 6upx;
    color: $font-color-dark;
    margin-left: 20upx;
  }
}

.vip-card-box {
  display: flex;
  flex-direction: column;
  color: #f7d680;
  height: 240upx;
  background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
  border-radius: 16upx 16upx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20upx 24upx;

  .card-bg {
    position: absolute;
    top: 20upx;
    right: 0;
    width: 380upx;
    height: 260upx;
  }

  .b-btn {
    position: absolute;
    right: 20upx;
    top: 16upx;
    width: 132upx;
    height: 40upx;
    text-align: center;
    line-height: 40upx;
    font-size: 22upx;
    color: #36343c;
    border-radius: 20px;
    background: linear-gradient(left, #f9e6af, #ffd465);
    z-index: 1;
  }

  .tit {
    font-size: $font-base + 2upx;
    color: #f7d680;
    margin-bottom: 28upx;

    .yticon {
      color: #f6e5a3;
      margin-right: 16upx;
    }
  }

  .e-b {
    font-size: $font-sm;
    color: #d8cba9;
    margin-top: 10upx;
  }
}

.cover-container {
  @extend %section;
  background: $page-color-base;
  margin-top: -150upx;
  padding: 0 30upx;
  position: relative;
  background: #f5f5f5;
  padding-bottom: 20upx;

  .arc {
    position: absolute;
    left: 0;
    top: -34upx;
    width: 100%;
    height: 36upx;
  }
  .tj-item {
    @extend %flex-center;
    flex-direction: column;
    height: 140upx;
    font-size: $font-sm;
    color: #1d1c1c;
    &:last-of-type {
      font-weight: bold;
    }
  }

  .num {
    font-size: $font-lg;
    color: #302c2c;
    margin-bottom: 8upx;
  }
}

.order-section {
  @extend %section;
  padding: 28upx 0;
  margin-top: 20upx;

  .order-item {
    @extend %flex-center;
    position: relative;
    width: 120upx;
    height: 120upx;
    border-radius: 10upx;
    font-size: $font-sm;
    color: $font-color-dark;
  }

  .yticon {
    font-size: 60upx;
    margin-bottom: 18upx;
    color: #fa436a;
  }
  .order-badge {
    position: absolute;
    top: -8upx;
    right: 30upx;
    font-size: 20rpx;
    background: #f74531;
    text-align: center;
    line-height: 28upx;
    color: #fff;
    border-radius: 100%;
    min-height: 30upx;
    min-width: 30upx;
  }

  .icon-shouhoutuikuan {
    font-size: 44upx;
  }
}

.history-section {
  padding: 30upx 0 0;
  margin-top: 20upx;
  background: #fff;
  border-radius: 10upx;

  .sec-header {
    display: flex;
    align-items: center;
    font-size: $font-base;
    color: $font-color-dark;
    line-height: 40upx;
    margin-left: 30upx;

    .yticon {
      font-size: 44upx;
      color: #5eba8f;
      margin-right: 16upx;
      line-height: 40upx;
    }
  }

  .h-list {
    white-space: nowrap;
    padding: 30upx 30upx 0;

    image {
      display: inline-block;
      width: 160upx;
      height: 160upx;
      margin-right: 20upx;
      border-radius: 10upx;
    }
  }
}
</style>
