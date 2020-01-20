<template>
  <div class="discount-details">
    <div class="list">
      <p>
        <img src="/static/images/design.png" mode="aspectFill" />
      </p>
      <div class="title">{{info.source}}</div>
      <div class="desc">
        <h2>{{info.title}}</h2>
        <p>有效日期：{{info.begin_timestamp}} 至 {{info.end_timestamp}}</p>
      </div>
      <div class="btn" @click="getDiscount">
        <p>领取到卡包</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cardid: "",
      info: {}
    };
  },
  methods: {
    getDiscount() {
      let { card_id, timestamp, signature, nonceStr } = this.info.cardInfo;
      let cardExt = `{"timestamp":"${timestamp}","signature":"${signature}","nonce_str":"${nonceStr}"}`;
      console.log(card_id, cardExt);
      mpvue.showLoading({
        title: "请稍后"
      });
      wx.addCard({
        cardList: [
          {
            cardId: card_id,
            cardExt: cardExt
          }
        ],
        success(res) {
          mpvue.hideLoading();
          mpvue.showToast({
            title: "领取成功！",
            icon: "success",
            time: "2000"
          });
          setTimeout(_ => {
            mpvue.navigateBack({
              delta: 1
            });
          }, 1000);
          console.log(res.cardList); // 卡券添加结果
        },
        fail(res) {
          console.log(res);
          if (res.errMsg == "addCard:fail cancel") {
            mpvue.hideLoading();
            mpvue.navigateBack({
              delta: 1
            });
          } else {
            mpvue.hideLoading();
            mpvue.showToast({
              title: "领取失败！",
              icon: "none",
              time: "2000"
            });
            setTimeout(_ => {
              mpvue.navigateBack({
                delta: 1
              });
            }, 1000);
          }
        }
      });
    }
  },
  mounted() {
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
    vm.cardid = o.cardid;
    vm.info = mpvue.getStorageSync("discount");
    mpvue.showLoading({
      title: "加載中"
    });
    mpvue.request({
      url: `${vm.$api}/coupon/getCardSignature?card_id=${vm.cardid}`,
      success: function(res) {
        mpvue.hideLoading();
        if (res.statusCode == 200) {
          vm.info.cardInfo = res.data.data;
        } else {
          mpvue.showToast({
            title: "網絡發生異常！",
            icon: "none",
            time: "2000"
          });
        }
      }
    });
  }
};
</script>
<style lang="less" scoped>
.discount-details {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 58rpx 20rpx;
  div.list {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2rpx 50rpx 0px rgba(0, 0, 0, 0.1);
    border-radius: 8rpx;
    & > p {
      width: 84rpx;
      height: 84rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 50%;
      margin: 0 auto;
      position: relative;
      top: -42rpx;
      img {
        width: 80%;
        margin: 10%;
      }
    }
    div.title {
      font-size: 28rpx;
      color: rgba(153, 153, 153, 1);
      line-height: 40rpx;
      text-align: center;
    }
    div.desc {
      margin-top: 28rpx;
      text-align: center;
      h2 {
        font-size: 48rpx;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 67rpx;
      }
      p {
        margin-top: 10rpx;
        font-size: 24rpx;
        color: rgba(102, 102, 102, 1);
        line-height: 33rpx;
      }
    }
    div.btn {
      margin-top: 70rpx;
      padding-bottom: 30rpx;
      p {
        width: 660rpx;
        height: 88rpx;
        margin: 0 auto;
        background: rgba(0, 169, 128, 1);
        border-radius: 10rpx;
        font-size: 32rpx;
        color: rgba(255, 255, 255, 1);
        line-height: 88rpx;
        text-align: center;
      }
    }
  }
}
</style>