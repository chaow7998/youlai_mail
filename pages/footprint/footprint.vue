<template>
  <view class="container">
    <view class="footprint" v-if="footprintList.length > 0">
      <view class="day-hd">{{ footprintList[0].add_time }}</view>
      <view
        class="day-item"
        v-for="(item, index) in footprintList"
        :key="index"
      >
        <view class="day-list">
          <view
            class="item"
            :data-footprint="item"
            @touchstart="touchStart"
            @touchend="touchEnd"
            @tap="deleteItem"
            :key="item.id"
          >
            <image class="img" :src="item.list_pic_url"></image>
            <view class="info">
              <view class="name">{{ item.name || "" }}</view>
              <view class="subtitle">{{ item.goods_brief || "" }}</view>
              <view class="price">￥{{ item.retail_price || "" }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <show-empty v-else text="暂无收藏"></show-empty>
  </view>
</template>

<script>
// const util = require("@/utils/util.js");
// const api = require('@/utils/api.js');
export default {
  onLoad(options) {
    console.log("=====》进入了：",this.$mp.page.route,"参数：",options);
    // this.getFootprintList(options.id)
  },
  data() {
    return{
      footprintList:[{
          add_time: 0,
          id: 62,
          list_pic_url:
            "https://img0.baidu.com/it/u=1753589914,3429261228&fm=26&fmt=auto&gp=0.jpg",
          name: "平滑细篾头层青碳化竹凉席",
          goods_brief: "细篾整密，凉滑不夹肉",
          retail_price: 259,
        },
        {
          add_time: 0,
          id: 62,
          list_pic_url:
            "https://img0.baidu.com/it/u=1753589914,3429261228&fm=26&fmt=auto&gp=0.jpg",
          name: "平滑细篾头层青碳化竹凉席",
          goods_brief: "细篾整密，凉滑不夹肉",
          retail_price: 259,
        },
        {
          add_time: 0,
          id: 62,
          list_pic_url:
            "https://img0.baidu.com/it/u=1753589914,3429261228&fm=26&fmt=auto&gp=0.jpg",
          name: "平滑细篾头层青碳化竹凉席",
          goods_brief: "细篾整密，凉滑不夹肉",
          retail_price: 259,
        },]
    }
   
  },
  methods: {
    // getFootprintList() {
    //   let that = this;
    //   var tmpFootPrint;
    //   util.request(api.FootprintList).then(function (res) {
    //     if (res.errno === 0) {
    //       if (res.data.data != undefined) {
    //         tmpFootPrint = res.data.data;
    //       } else {
    //         tmpFootPrint = [];
    //       }
    //       that.footprintList = tmpFootPrint;
    //     }
    //   });
    // },
    // deleteItem(event) {
    //   let that = this;
    //   let footprint = event.currentTarget.dataset.footprint;
    //   var touchTime = that.touch_end - that.touch_start;
    //   //如果按下时间大于350为长按
    //   if (touchTime > 350) {
    //     uni.showModal({
    //       title: "",
    //       content: "要删除所选足迹？",
    //       success: function (res) {
    //         if (res.confirm) {
    //           util
    //             .request(api.FootprintDelete, {
    //               footprintId: footprint.id,
    //             })
    //             .then(function (res) {
    //               if (res.errno === 0) {
    //                 uni.showToast({
    //                   title: res.errmsg,
    //                   icon: "success",
    //                   duration: 2000,
    //                   complete: function () {
    //                     that.getFootprintList();
    //                   },
    //                 });
    //               } else {
    //                 util.showErrorToast(res.errmsg);
    //               }
    //             });
    //         }
    //       },
    //     });
    //   } else {
    //     uni.navigateTo({
    //       url: "/pages/goods/goods?id=" + footprint.goods_id,
    //     });
    //   }
    // },
    //按下事件开始
    touchStart: function (e) {
      this.touch_start = e.timeStamp;
    },
    //按下事件结束
    touchEnd: function (e) {
      this.touch_end = e.timeStamp;
    },
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    var self = this;
    this.getFootprintList();
  },
  onShow: function () {
    // this.getFootprintList();
  },
};
</script>

<style lang="scss">
page {
  background: #f4f4f4;
  min-height: 100%;
}

.container {
  background: #f4f4f4;
  min-height: 100%;
}

.footprint {
  height: auto;
  overflow: hidden;
  width: 100%;
  border-top: 1px solid #e1e1e1;
}

.day-item {
  height: auto;
  overflow: hidden;
  width: 100%;
  margin-bottom: 20rpx;
}

.day-hd {
  height: 94rpx;
  width: 100%;
  line-height: 94rpx;
  background: #fff;
  padding-left: 30rpx;
  color: #333;
  font-size: 28rpx;
}

.day-list {
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #fff;
  padding-left: 30rpx;
  border-top: 1px solid #e1e1e1;
}

.item {
  height: 212rpx;
  width: 720rpx;
  background: #fff;
  padding: 30rpx 30rpx 30rpx 0;
  border-bottom: 1px solid #e1e1e1;
}

.item:last-child {
  border-bottom: 1px solid #fff;
}

.item .img {
  float: left;
  width: 150rpx;
  height: 150rpx;
}

.item .info {
  float: right;
  width: 540rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20rpx;
}

.item .info .name {
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}

.item .info .subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #888;
  line-height: 40rpx;
}

.item .info .price {
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}
</style>
