<template>
  <div>
    <div class="qr-top">
      <img src="/static/images/qrcode.png" mode="widthFix" alt />
      <h2>商品掃碼辨真偽</h2>
      <p>掃描後展示產品詳細信息</p>
    </div>
    <div class="qr-btn">
      <p @click="makeSweep">
        <i class="iconfont icon-richscan_icon"></i> 掃一掃條形碼
      </p>
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
    mpvue.showLoading({
      title: "请稍后"
    });
    //扫码权限
    mpvue.request({
      url: `${this.$api}/member/isSuper`,
      data: {
        userid: mpvue.getStorageSync("userId")
      },
      success: function(res) {
        mpvue.hideLoading();
        var datas = res.data.data;
        vm.isQRcode = datas;
      }
    });
    mpvue.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#00A980",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
  },
  methods: {
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
          console.log("arr数据为：", arr[arr.length - 1]);
          mpvue.showLoading({
            title: "請稍等"
          });
          mpvue.request({
            url: `${this.config.service.barcodeSearch}`,
            data: {
              args: {
                barcode: arr[arr.length - 1]
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
                } else if (res.data.Code == 210) {
                  mpvue.showToast({
                    title: res.data.Message,
                    icon: "none",
                    duration: 2000
                  });
                }
                //  else if (res.data.Code == 210) {
                //   //多次扫描防伪码
                //   mpvue.navigateTo({
                //     url:
                //       "../validation/validation?title=" + res.data.Data.drugId
                //   });
                // }
              } else if (res.data.Code == 209) {
                if (that.isQRcode) {
                  mpvue.request({
                    url: `${that.$api}/coupon/conponConsume`,
                    method: "POST",
                    data: {
                      user_card_code: _code,
                      userid: mpvue.getStorageSync("userId")
                    },
                    success: function(res) {
                      if (res.statusCode == 200) {
                        mpvue.hideLoading();
                        if (res.data.code != 1) {
                          mpvue.showToast({
                            title: res.data.data,
                            icon: "none",
                            duration: 2000
                          });
                        } else {
                          wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            showCancel: false,
                            success(res) {
                              if (res.confirm) {
                                mpvue.redirectTo({
                                  url: "../submitInfo/main?code=" + _code
                                });
                              }
                            }
                          });
                        }
                      } else {
                        mpvue.hideLoading();
                        mpvue.showToast({
                          title: "暫無信息!",
                          icon: "none",
                          duration: 2000
                        });
                      }
                    }
                  });
                } else {
                  mpvue.showToast({
                    title: "暫無信息!",
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

          this.inputValue = res.result;
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
</style>