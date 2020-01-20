<template>
  <div>
    <div class="my-discount" v-if="discountData.length>0">
      <ul>
        <!-- @click="details(item)" -->
        <li v-for="(item,index) in discountData" :key="index" @click="details(item)">
          <p class="p-img">
            <img :src="item.img_url" mode="aspectFill" alt />
          </p>
          <div>
            <h2 class="line">{{item.title}}</h2>
            <div class="desc">
              <span>
                立減
                <em>{{item.discount_price}}</em>元
              </span>
              <span>
                折後價格：
                <em>{{item.price}}</em>元
              </span>
            </div>
            <div class="validity">有效日期：{{item.begin_timestamp}}至{{item.end_timestamp}}</div>
          </div>
          <!-- <p class="p-btn" @click="IsFavorite(item.id)">{{item.IsFavorite?'已收藏':'加入收藏'}}</p> -->
        </li>
      </ul>
    </div>
    <div class="discount-null" v-if="discountData.length==0">
      <div class="c">
        <p>
          <img src="/static/images/discount_null.png" mode="widthFix" alt />
        </p>
        <h2>您還未領取優惠券</h2>
      </div>
      <div class="btn">
        <a href="../discount/main">
          <p>領取優惠券</p>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageNum: 1,
      isGet: true,
      discountData: []
    };
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var vm = this;
    if (vm.isGet) {
      mpvue.showLoading({
        title: "正在加載數據"
      });
      vm.pageNum++;
      vm.getDiscount();
    }
  },
  methods: {
    details(item) {
      let vm = this;
      mpvue.showLoading({
        title: "加载中"
      });
      let cardList = mpvue.getStorageSync("cardList");
      let obj = {
        cardId: item.card_id
      };
      if (cardList[item.card_id]) {
        obj.code = cardList[item.card_id].code;
        mpvue.request({
          url: `${vm.$api}/member/getCode?code=${encodeURIComponent(obj.code)}`,
          success: function(res) {
            if (res.statusCode == 200) {
              obj.code = res.data.data;
              wx.openCard({
                cardList: [obj],
                complete(res) {
                  mpvue.hideLoading();
                }
              });
            } else {
              mpvue.showToast({
                title: "網絡發生異常！",
                icon: "none",
                time: "2000"
              });
            }
          }
        });
      } else {
        wx.openCard({
          cardList: [obj],
          complete(res) {
            mpvue.hideLoading();
          }
        });
      }
    },
    getDiscount() {
      let vm = this;
      vm.isGet = true;
      mpvue.request({
        url: `${vm.$api}/member/memberCouponList`,
        method: "POST",
        data: {
          loginkey: mpvue.getStorageSync("sessionId"),
          page: vm.pageNum,
          limit: 10
        },
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            vm.discountData = [...vm.discountData, ...res.data.data];
            if (res.data.data.length == 0 && vm.pageNum > 1) {
              vm.isGet = false;
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            } else {
              vm.isGet = false;
            }
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
  },
  mounted() {
    mpvue.showLoading({
      title: "请稍后"
    });
    this.discountData = [];
    this.getDiscount();
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
.my-discount {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx 30rpx;
  ul {
    li {
      background: rgba(255, 255, 255, 1);
      border-radius: 8rpx;
      overflow: hidden;
      position: relative;
      padding: 20rpx 30rpx;
      margin-top: 20rpx;
      &:first-child {
        margin-top: 0;
      }
      display: block;
      .p-img {
        width: 164rpx;
        height: 170rpx;
        float: left;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      & > div {
        margin-left: 196rpx;
        padding-top: 12rpx;
        h2 {
          font-size: 32rpx;
          line-height: 45rpx;
          width: 80%;
        }
        div.desc {
          margin-top: 15rpx;
          font-size: 24rpx;
          color: rgba(153, 153, 153, 1);
          line-height: 33rpx;
          em {
            display: inline-block;
            color: #ff645b;
          }
        }
        div.validity {
          margin-top: 13rpx;
          font-size: 24rpx;
          color: rgba(153, 153, 153, 1);
          line-height: 33rpx;
        }
      }
      .p-btn {
        width: 138rpx;
        height: 52rpx;
        background: rgba(255, 100, 91, 1);
        border-radius: 0px 8rpx 0px 19rpx;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 1);
        line-height: 52rpx;
        text-align: center;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
}
.discount-null {
  height: 100vh;
  position: relative;
  div.c {
    padding-top: 345rpx;
    p {
      width: 128rpx;
      height: 128rpx;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
    h2 {
      text-align: center;
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
      line-height: 33rpx;
      margin-top: 47rpx;
    }
  }
  div.btn {
    position: absolute;
    bottom: 100rpx;
    left: 0;
    width: 100%;
    p {
      width: 360rpx;
      height: 70rpx;
      background: rgba(0, 169, 128, 1);
      border-radius: 8rpx;
      text-align: center;
      line-height: 70rpx;
      font-size: 32rpx;
      color: white;
      margin: 0 auto;
    }
  }
}
</style>