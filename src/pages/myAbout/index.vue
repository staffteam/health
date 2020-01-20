<template>
  <div class="about">
    <div class="content" v-if="content!=''">
      <wxParse :content="content" />
    </div>
  </div>
</template>
<script>
import wxParse from "mpvue-wxparse";
export default {
  components: {
    wxParse
  },
  data() {
    return {
      content: ""
    };
  },
  mounted() {
    let vm = this;
    mpvue.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#00A980",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
    wx.request({
      url: this.config.service.aboutUs,
      success: function(res) {
        vm.content = res.data.Data;
      },
      fail: function(res) {
        mpvue.showToast({
          title: "網絡異常",
          icon: "none",
          duration: 2000
        });
      }
    });
  }
};
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.about {
  padding: 20rpx;
}
</style>