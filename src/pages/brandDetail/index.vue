<template>
  <div class="detail">
    <div class="logo">
      <img :src="detail.LogoUrl" mode="aspectFill" />
    </div>
    <div class="content wxparse-mains" v-if="detail.ProductorProfile">
      <wxParse :content="detail.ProductorProfile" />
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
      pid:"",
      detail: {
      }
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
  },
  onLoad(o) {
    let vm = this;
    vm.pid = "";
    if (o.id) {
      mpvue.showLoading({
        title: "請稍等"
      });
      vm.pid = o.id;
      this.getData();
    }
  },
  methods: {
    getData(arr) {
      var vm = this;
      mpvue.request({
        url: `${vm.config.service.getProductor}`,
        method: "GET",
        data: {
          args: {
            ProductorBrand: vm.pid
          }
        },
        success: function(res) {
          mpvue.hideLoading();
          if (res.data.Code == 200) {
            vm.detail = res.data.Data;
          } else {
            mpvue.showToast({
              title: "查詢失敗，請重試",
              icon: "none"
            });
            setTimeout(_ => {
              mpvue.navigateBack({
                delta: 1
              });
            }, 1500);
          }
        },
        fail: function(res) {
          console.log("fail", res.data);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.detail {
  position: relative;
  padding: 200rpx 0 30rpx;
  .logo {
    position: absolute;
    top: 50rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    border: 1px solid #dddddd;
    margin: 0 100rpx;
    padding: 50rpx 30rpx 30rpx;
    min-height: 60vh;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  }
}
</style>