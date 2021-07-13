<template>
  <view class="page">
    <!-- #ifdef MP-->
    <block>
      <view class="container">
        <view class="wechatapp">
          <view class="header">
            <open-data class="avatar" type="userAvatarUrl"></open-data>
          </view>
        </view>
        <view class="auth-title">申请获取以下权限</view>
        <view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view>
        <view class="login-btn">
          <!-- 获取微信用户信息（旧版已弃用） -->
          <!-- <button class="button btn-normal" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo">授权登录</button> -->
          <!-- 获取微信用户信息（新版） -->
          <button class="button btn-normal" @click.stop="getUserProfile">
            授权登录
          </button>
        </view>
        <view class="no-login-btn">
          <button class="button btn-normal" @click="handleCancel">
            暂不登录
          </button>
        </view>
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
    handleCancel(){
      uni.navigateBack({delta:1})
    }

  },
};
</script>

<style lang="scss">
// #ifdef MP
.container {
  padding: 0 60rpx;
  font-size: 32rpx;
  background: #fff;
  min-height: 100vh;
}

.wechatapp {
  padding: 80rpx 0 48rpx;
  border-bottom: 1rpx solid #e3e3e3;
  margin-bottom: 72rpx;
  text-align: center;

  .header {
    width: 190rpx;
    height: 190rpx;
    border: 4rpx solid #fff;
    margin: 0 auto 0;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 2rpx 0 10rpx rgba(50, 50, 50, 0.3);
  }
}

.auth-title {
  color: #585858;
  font-size: 34rpx;
  margin-bottom: 40rpx;
}

.auth-subtitle {
  color: #888;
  margin-bottom: 88rpx;
  font-size: 28rpx;
}

.login-btn {
  padding: 0 20rpx;

  .button {
    height: 88rpx;
    line-height: 88rpx;
    background: #04be01;
    color: #fff;
    font-size: 30rpx;
    border-radius: 999rpx;
    text-align: center;
  }
}

.no-login-btn {
  margin-top: 20rpx;
  padding: 0 20rpx;

  .button {
    height: 88rpx;
    line-height: 88rpx;
    background: #dfdfdf;
    color: #fff;
    font-size: 30rpx;
    border-radius: 999rpx;
    text-align: center;
  }
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
