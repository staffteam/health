<template>
  <div>
    <div class="qr-info">
      <div class="t">
        <h2>大健康百科為該產品提供產品防偽碼檢驗服務</h2>
        <p>
          <i class="iconfont icon-sousuo"></i> 當前防偽碼為
          <span>{{antifakeCode}}</span>
        </p>
      </div>
      <div class="b">
        <h2 v-if="info.Count==1">該防偽碼未被查詢過，本次是第1次查詢</h2>
        <h2 v-if="info.Count!=1">該防偽碼已被查詢{{info.Count}}次</h2>
        <div class="title">
          <i class="iconfont icon-mingcheng"></i>
          <div>
            <span>產品名稱</span>
            <p>{{info.Drugs_name}}</p>
          </div>
        </div>
        <div class="btn">
          <p @click="productDetail">產品詳情</p>
          <p @click="brandDetail">廠家/品牌信息</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pid: "",
      antifakeCode: "",
      info: {}
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
    vm.antifakeCode = "";
    vm.pid = "";
    vm.info = {};
    if (o.q) {
      mpvue.showLoading({
        title: "請稍等"
      });
      o.q = o.q.split("scancode_time")[0];
      this.pid = decodeURIComponent(o.q);
      this.getData(this.pid.split("/"));
    }
  },
  methods: {
    productDetail() {
      mpvue.navigateTo({
        url: "../productDetails/main?title=" + this.info.Id
      });
    },
    brandDetail() {
      mpvue.navigateTo({
        url: "../brandDetail/main?id=" + this.info.ProductorBrand
      });
    },
    getData(arr) {
      var vm = this;
      vm.antifakeCode = arr[arr.length - 1];
      vm.pid = arr[arr.length - 1];
      mpvue.request({
        url: `${this.config.service.searchCode}`,
        method: "GET",
        data: {
          args: {
            code: arr[arr.length - 1]
          }
        },
        success: function(res) {
          console.log("success", res.data.Data);
          if (res.data.Code == 200) {
            mpvue.hideLoading();
            vm.info = res.data.Data;
          } else {
            mpvue.hideLoading();
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
.qr-info {
  background-color: #00a980;
  width: 100%;
  height: 100vh;
  .t {
    padding: 20rpx;
    h2 {
      color: white;
      font-size: 32rpx;
      text-align: center;
      line-height: 60rpx;
    }
    p {
      background-color: white;
      line-height: 50rpx;
      padding: 25rpx 30rpx;
      margin-top: 30rpx;
      font-weight: 600;
      font-size: 32rpx;
      i {
        float: left;
        color: #00a980;
        font-size: 45rpx;
        display: block;
        margin-right: 25rpx;
        font-weight: 500;
      }
      span {
        margin-left: 10rpx;
        color: #999999;
        font-size: 32rpx;
        font-weight: 500;
        display: inline-block;
      }
    }
  }
  .b {
    margin: 20rpx;
    background-color: white;
    padding: 50rpx 30rpx;
    h2 {
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
    }
    .title {
      margin-top: 30rpx;
      text-align: left;
      i {
        float: left;
        display: block;
        font-size: 45rpx;
        line-height: 85rpx;
        color: red;
      }
      div {
        margin-left: 60rpx;
        border-bottom: 1px solid #dddddd;
        padding: 20rpx;
        line-height: 40rpx;
        span {
          display: block;
          float: left;
          font-size: 32rpx;
          font-weight: 600;
        }
        p {
          margin-left: 160rpx;
          font-size: 32rpx;
        }
      }
    }
    .btn {
      text-align: center;
      margin-top: 60rpx;
      p {
        display: inline-block;
        width: 260rpx;
        height: 80rpx;
        line-height: 80rpx;
        background-color: #00a980;
        color: white;
        font-size: 28rpx;
        border-radius: 40rpx;
        margin: 0 10rpx;
      }
    }
  }
}
</style>