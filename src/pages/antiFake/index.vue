<template>
  <div>
    <div class="qr-main" v-if="pid==''">
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
    <div class="qr-info" v-if="pid">
      <div class="t">
        <h2>大健康百科為該產品提供產品防偽碼檢驗服務</h2>
        <p>
          <i class="iconfont icon-sousuo"></i> 當前防偽碼為
          <span>{{antifakeCode}}</span>
        </p>
      </div>
      <div class="b">
        <h2 v-if="info.num==1">該防偽碼未被查詢過，本次是第1次查詢</h2>
        <h2 v-if="info.num!=1">該防偽碼已被查詢{{info.num}}次</h2>
        <div class="title">
          <i class="iconfont icon-mingcheng"></i>
          <div>
            <span>產品名稱</span>
            <p>{{info.name}}</p>
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
      isQRcode: true,
      pid: "",
      antifakeCode: "",
      info: {
        num: 1,
        name: "這就是產品名稱這就是產品名稱這就是產品名稱",
        id: "111"
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
    vm.antifakeCode = "";
    vm.pid = "";
    // vm.info={};
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
        url: "../brandDetail/main?id=" + this.info.Id
      });
    },
    //扫码查询
    makeSweep: function(e) {
      var that = this;
      mpvue.scanCode({
        onlyFromCamera: true,
        scanType: "barCode",
        success: res => {
          console.log("扫码数据为：", res.result);
          let _code = res.result;
          var arr = res.result.split("/");
          mpvue.showLoading({
            title: "請稍等"
          });
          that.getData(arr);
        }
      });
    },
    getData(arr) {
      var that = this;
      that.antifakeCode = arr[arr.length - 1];
      mpvue.request({
        url: `${this.config.service.searchCode}`,
        method: "POST",
        data: {
          args: {
            code: arr[arr.length - 1]
          }
        },
        success: function(res) {
          console.log("success", res.data.Data);
          if (res.data.Code == 200) {
            mpvue.hideLoading();
            if (res.data.Code == 200 && res.data.Data.drugId != undefined) {
              //第一次进行防伪码扫描
              mpvue.navigateTo({
                url: "../productDetails/main?title=" + res.data.Data.drugId
              });
            } else {
              mpvue.showToast({
                title: res.data.Message,
                icon: "none",
                duration: 2000
              });
            }
          } else {
            mpvue.hideLoading();
            mpvue.showToast({
              title: res.data.Message,
              icon: "none",
              duration: 2000
            });
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
    font-size: 28rpx;
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
      i {
        float: left;
        color: #00a980;
        font-size: 45rpx;
        display: block;
        margin-right: 25rpx;
        font-weight: 500;
      }
      span {
        margin-left: 15rpx;
        color: #999999;
        font-size: 32rpx;
        font-weight: 500;
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