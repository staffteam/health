<template>
  <web-view src="http://shop.winnergroup.com.mo/" @error="errors" @message="messages" @load="loads"></web-view>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    loads(e){
      console.log(e);
    },
    errors(e) {
      mpvue.showToast({
        title: "商城敬請期待···",
        icon: "none"
      });
      setTimeout(_ => {
        mpvue.navigateBack({
          delta: 1
        });
      }, 1500);
    },
    messages(e) {
      console.log(e);
    }
  },
  onShow() {
    mpvue.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#00A980",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
  }
};
</script>
<style lang="less" scoped>
</style>