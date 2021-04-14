<template>
  <div>
    <div class="qr-main">
      <div class="qr-top">
        <img src="/static/images/qrcode.png" mode="widthFix" alt />
        <h2>商品掃碼辨真偽</h2>
        <p>掃描後展示產品詳細信息</p>
      </div>
      <div class="qr-btn">
        <p @click="makeSweep">
          <i class="iconfont icon-richscan_icon"></i> 扫一扫 辨真伪
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isQRcode: true
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
  onLoad(o) {},
  methods: {
    //扫码查询
    makeSweep: function(e) {
      var vm = this;
      mpvue.scanCode({
        onlyFromCamera: true,
        scanType: "barCode",
        success: res => {
          console.log("扫码数据为：", res.result);
          let _code = res.result;
          var arr = res.result.split("/");
          if (_code.indexOf("https://old.szyinghe.net/upload/") >= 0 || _code.indexOf("https://health.mhcamo.com/upload/") >= 0) {
            mpvue.showLoading({
              title: "請稍等"
            });
            mpvue.navigateTo({
              url: "../antiFake/main?q=" + encodeURIComponent(res.result)
            });
          } else {
            mpvue.showToast({
              title: "二維碼有誤，請更換",
              icon: "none"
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.qr-top {
  padding-top: 130rpx;
  text-align: center;
  img {
    width: 622rpx;
    height: 405rpx;
  }
  h2 {
    font-size: 42rpx;
    font-weight: 600;
    line-height: 59rpx;
    margin-top: 58rpx;
  }
  p {
    margin-top: 23rpx;
    font-size: 30rpx;
    color: rgba(102, 102, 102, 1);
    line-height: 40rpx;
  }
}
.qr-btn {
  width: 372rpx;
  height: 106rpx;
  background: rgba(0, 169, 128, 0.2);
  border-radius: 53rpx;
  margin: 0 auto;
  margin-top: 120rpx;
  padding: 10rpx 11rpx;
  p {
    width: 350rpx;
    height: 88rpx;
    background: rgba(0, 169, 128, 1);
    border-radius: 44rpx;
    color: white;
    text-align: center;
    line-height: 88rpx;
    font-size: 36rpx;
    i {
      font-size: 40rpx;
      display: inline-block;
      margin-right: 10rpx;
    }
  }
}
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