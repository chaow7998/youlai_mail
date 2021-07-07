<template>
  <view class="page">
    <!-- #ifdef MP-->
    <block>
      <view class="hd">
        <image class="logo" src="/static/logo.png"></image>
        <view class="title">蜉蝣商城欢迎你!</view>
      </view>
      <view class="bd">
        <view class="top_line"></view>
        <text class="m_name">蜉蝣商城</text>
        <text class="s_name">获得你的公开信息（昵称、头像等）</text>
      </view>
      <view class="btn spacing">
        <!-- 需要使用 button 来授权登录 -->
        <button
          class="weui_btn weui_btn_primary"
          @click.stop="getUserProfile"
        >
          微信登录
        </button>
      </view>
    </block>
    <!-- #endif -->

    <!-- #ifdef H5-->
    <block>
      <view class="container">
        <view class="left-bottom-sign"></view>
        <view
          class="back-btn yticon icon-zuojiantou-up"
          @click="navBack"
        ></view>
        <view class="right-top-sign"></view>
        <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
        <view class="wrapper">
          <template>
            <view class="left-top-sign">LOGIN</view>
            <view class="welcome">欢迎回来！</view>
            <view class="input-content">
              <view class="input-item">
                <text class="tit">手机号码</text>
                <input
                  type="number"
                  :value="mobile"
                  placeholder="请输入手机号码"
                  maxlength="11"
                  data-key="mobile"
                  @input="inputChange"
                />
              </view>
              <view class="input-item">
                <text class="tit">密码</text>
                <input
                  type="mobile"
                  value=""
                  placeholder="8-18位不含特殊字符的数字、字母组合"
                  placeholder-class="input-empty"
                  maxlength="20"
                  password
                  data-key="password"
                  @input="inputChange"
                  @confirm="toLogin"
                />
              </view>
            </view>
            <button class="confirm-btn" @click="toLogin" :disabled="logining">
              登录
            </button>
            <view class="forget-section">忘记密码?</view>
          </template>
        </view>
        <view class="register-section">
          还没有账号?
          <text @click="toRegist">马上注册</text>
        </view>
      </view>
    </block>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      mobile: "",
      password: "",
      logining: false,
    };
  },
  onLoad() {},
  methods: {
    ...mapMutations(["login"]),
    inputChange(e) {
      const key = e.currentTarget.dataset.key;
      this[key] = e.detail.value;
    },
    navBack() {
      uni.navigateBack();
    },
    toRegist() {
      this.$api.msg("去注册");
    },
    async toLogin() {
      this.logining = true;
      const { mobile, password } = this;

      if (
        !this.$api.match({
          mobile,
          password,
        })
      ) {
        this.logining = false;
        return;
      }

      const sendData = {
        mobile,
        password,
      };
      const result = await this.$api.json("userInfo");
      if (result.status === 1) {
        this.login(result.data);
        uni.navigateBack();
      } else {
        this.$api.msg(result.msg);
        this.logining = false;
      }
    },

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
      this.logining = true;
      this.$store
        .dispatch("user/login", {
          code: await this.getCode(),
          rawData,
        })
        .then((res) => {
          this.$store.dispatch("user/getUserInfo");
          uni.navigateBack();
        })
        .catch(() => {
          this.logining = false;
        });
    },
  },
};
</script>

<style lang="scss">
// #ifdef MP
view,
text {
  font-family: PingFangSC-Light, helvetica, "Heiti SC";
  font-size: 29rpx;
  color: #333;
}

.hd {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hd .logo {
  border-radius: 50%;
  width: 300rpx;
  height: 300rpx;
  margin-top: 40rpx;
}

.hd .title {
  text-align: center;
  font-size: 36rpx;
  color: #000;
}

.bd {
  width: 100%;
  padding: 50rpx;
}

.bd .top_line {
  width: 100%;
  height: 1rpx;
  background: #ccc;
  margin-top: 20rpx;
  margin-bottom: 50rpx;
}

.bd .m_name {
  display: block;
  text-align: center;
  font-size: 36rpx;
  color: #000;
}

.bd .s_name {
  margin-top: 25rpx;
  display: block;
  text-align: center;
  font-size: 34rpx;
  color: #8a8a8a;
}

.btn {
  padding: 120rpx 50rpx 0;
}

.weui_btn_primary {
  background-color: #148d38;
}

.weui_btn {
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-left: 14px;
  padding-right: 14px;
  box-sizing: border-box;
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  color: #fff;
  line-height: 2.33333333;
  border-radius: 5px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
}

.weui_btn:after {
  content: " ";
  width: 200%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-transform: scale(0.5);
  -ms-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
  border-radius: 10px;
}
// #endif
page {
  background: #fff;
}

.container {
  padding-top: 115px;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.wrapper {
  position: relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 40upx;
}

.back-btn {
  position: absolute;
  left: 40upx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40upx;
  font-size: 40upx;
  color: $font-color-dark;
}

.left-top-sign {
  font-size: 120upx;
  color: $page-color-base;
  position: relative;
  left: -16upx;
}

.right-top-sign {
  position: absolute;
  top: 80upx;
  right: -30upx;
  z-index: 95;

  &:before,
  &:after {
    display: block;
    content: "";
    width: 400upx;
    height: 80upx;
    background: #b4f3e2;
  }

  &:before {
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }

  &:after {
    position: absolute;
    right: -198upx;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
    /* background: pink; */
  }
}

.left-bottom-sign {
  position: absolute;
  left: -270upx;
  bottom: -320upx;
  border: 100upx solid #d0d1fd;
  border-radius: 50%;
  padding: 180upx;
}

.welcome {
  position: relative;
  left: 50upx;
  top: -90upx;
  font-size: 46upx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}

.input-content {
  padding: 0 60upx;
}

.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30upx;
  background: $page-color-light;
  height: 120upx;
  border-radius: 4px;
  margin-bottom: 50upx;

  &:last-child {
    margin-bottom: 0;
  }

  .tit {
    height: 50upx;
    line-height: 56upx;
    font-size: $font-sm + 2upx;
    color: $font-color-base;
  }

  input {
    height: 60upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    width: 100%;
  }
}

.confirm-btn {
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 70upx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}

.forget-section {
  font-size: $font-sm + 2upx;
  color: $font-color-spec;
  text-align: center;
  margin-top: 40upx;
}

.register-section {
  position: absolute;
  left: 0;
  bottom: 50upx;
  width: 100%;
  font-size: $font-sm + 2upx;
  color: $font-color-base;
  text-align: center;

  text {
    color: $font-color-spec;
    margin-left: 10upx;
  }
}

.tip {
  margin-top: 60upx;
  font-size: $font-base - 4upx;
  color: $font-color-dark;
  text-align: center;
  font-family: yticon;
  font-weight: bold;
}
</style>
