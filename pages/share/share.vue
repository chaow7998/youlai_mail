<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shareList: [
        {
          type: 1,
          icon: "/static/temp/share_wechat.png",
          text: "微信好友",
        },
        {
          type: 2,
          icon: "/static/temp/share_moment.png",
          text: "朋友圈",
        },
        {
          type: 3,
          icon: "/static/temp/share_qq.png",
          text: "QQ好友",
        },
        {
          type: 4,
          icon: "/static/temp/share_qqzone.png",
          text: "QQ空间",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>