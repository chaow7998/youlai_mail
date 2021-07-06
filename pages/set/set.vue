<template>
  <view class="container">
    <view
      class="list-cell b-b m-t"
      @click="navTo('/pages/userinfo/userinfo')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">个人资料</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view
      class="list-cell b-b"
      @click="navTo('/pages/address/address')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">收货地址</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view
      class="list-cell"
      @click="navTo('暂不支持实名认证')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">实名认证</text>
      <text class="cell-more yticon icon-you"></text>
    </view>

    <view class="list-cell m-t">
      <text class="cell-tit">消息推送</text>
      <switch checked color="#fa436a" @change="switchChange" />
    </view>
    <!-- #ifdef APP-PLUS -->
    <view
      class="list-cell m-t b-b"
      @click="navTo('清除缓存')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">清除缓存</text>
      <text class="cell-tip">{{ fileSizeString }}</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <!-- #endif -->
    <view
      class="list-cell b-b"
      @click="navTo('/pages/about/about')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">关于有来小店</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <!-- #ifdef APP-PLUS -->
    <view class="list-cell">
      <text class="cell-tit">检查更新</text>
      <text class="cell-tip">当前版本 1.0.3</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <!-- #endif -->
    <view class="list-cell log-out-btn" @click="toLogout">
      <text class="cell-tit">退出登录</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      //  #ifdef APP-PLUS
      fileSizeString: "",
      //  #endif
    };
  },
  onLoad() {
    //  #ifdef APP-PLUS
    this.formatSize();
    //  #endif
  },
  methods: {
    navTo(url) {
      if (url == "暂不支持实名认证") {
        this.$api.msg(`${url}`);
      }
      uni.navigateTo({
        url,
      });
    },
    //退出登录
    toLogout() {
      uni.showModal({
        content: "确定要退出登录么",
        success: (e) => {
          if (e.confirm) {
            this.$store.dispatch("user/logout");
            setTimeout(() => {
              uni.navigateBack();
            }, 200);
          }
        },
      });
    },
    //switch
    switchChange(e) {
      let statusTip = e.detail.value ? "打开" : "关闭";
      this.$api.msg(`${statusTip}消息推送`);
    },
    // 清除缓存
    clearCache() {
      let that = this;
      let os = plus.os.name;
      if (os == "Android") {
        let main = plus.android.runtimeMainActivity();
        let sdRoot = main.getCacheDir();
        let files = plus.android.invoke(sdRoot, "listFiles");
        let len = files.length;
        for (let i = 0; i < len; i++) {
          let filePath = "" + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
          plus.io.resolveLocalFileSystemURL(
            filePath,
            function (entry) {
              if (entry.isDirectory) {
                entry.removeRecursively(
                  function (entry) {
                    //递归删除其下的所有文件及子目录
                    uni.showToast({
                      title: "缓存清理完成",
                      duration: 2000,
                    });
                    that.formatSize(); // 重新计算缓存
                  },
                  function (e) {
                    // console.log(e.message)
                  }
                );
              } else {
                entry.remove();
              }
            },
            function (e) {
              // console.log('文件路径读取失败')
            }
          );
        }
      } else {
        // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错
        plus.cache.clear(function () {
          // uni.showToast({
          // title: '缓存清理完成',
          // duration: 2000
          // });
          that.formatSize();
        });
      }
    },
    // 计算缓存
    formatSize() {
      let that = this;
      plus.cache.calculate(function (size) {
        let sizeCache = parseInt(size);
        if (sizeCache == 0) {
          that.fileSizeString = "0B";
        } else if (sizeCache < 1024) {
          that.fileSizeString = sizeCache + "B";
        } else if (sizeCache < 1048576) {
          that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
        } else if (sizeCache < 1073741824) {
          that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
        } else {
          that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
        }
      });
    },
  },
};
</script>

<style lang='scss'>
page {
  background: $page-color-base;
}
.list-cell {
  display: flex;
  align-items: baseline;
  padding: 20upx $page-row-spacing;
  line-height: 60upx;
  position: relative;
  background: #fff;
  justify-content: center;
  &.log-out-btn {
    margin-top: 40upx;
    .cell-tit {
      color: $uni-color-primary;
      text-align: center;
      margin-right: 0;
    }
  }
  &.cell-hover {
    background: #fafafa;
  }
  &.b-b:after {
    left: 30upx;
  }
  &.m-t {
    margin-top: 16upx;
  }
  .cell-more {
    align-self: baseline;
    font-size: $font-lg;
    color: $font-color-light;
    margin-left: 10upx;
  }
  .cell-tit {
    flex: 1;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    margin-right: 10upx;
  }
  .cell-tip {
    font-size: $font-base;
    color: $font-color-light;
  }
  switch {
    transform: translateX(16upx) scale(0.84);
  }
}
</style>
