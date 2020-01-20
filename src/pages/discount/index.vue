<template>
  <div class="discount">
    <div class="banner">
      <swiper
        :autoplay="true"
        interval="5000"
        :indicator-dots="false"
        circular="true"
        :current="currentSwiper"
        duration="300"
        @change="swiperChange"
      >
        <swiper-item v-for="(item,index) in bannerData" :key="index" @click="bannerClick(item)">
          <img :src="item.img_url" mode="aspectFill" alt />
        </swiper-item>
      </swiper>
      <div class="dots">
        <span
          v-for="(item,index) in bannerData"
          :key="index"
          :class="index == currentSwiper ? ' active' : ''"
        ></span>
      </div>
    </div>
    <div class="tag">
      <scroll-view :scroll-x="true">
        <ul id="tagList" :style="maxw!=0?'width:'+maxw+'px;':''">
          <li
            v-for="(item,index) in tagData"
            :key="index"
            :class="tagCheck == item.id?'on':''"
            :data-id="item.id"
            class="tag-li"
            @click="tagClick(item.id)"
          >{{item.name}}</li>
        </ul>
      </scroll-view>
    </div>
    <div class="discount-main">
      <ul v-show="discountData.length >0">
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
      <div class="not-data" v-if="discountData.length==0">暂无数据</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tagCheck: 0,
      currentSwiper: 0,
      maxw: 0,
      pageNum: 1,
      isGet: true,
      bannerData: [{ imgUrl: require("../../../static/images/discount.png") }],
      tagData: [],
      discountData: []
    };
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (that.isGet) {
      mpvue.showLoading({
        title: "正在加載數據"
      });
      that.pageNum++;
      that.getDiscount(that.pageNum);
    }
  },
  methods: {
    bannerClick(item) {
      if(item.LinkUrl==0)return;
      if (item.NavCode == "news") {
        mpvue.navigateTo({
          url: "../healthDetails/main?id=" + item.LinkUrl
        });
      } else if (item.NavCode == "activityNews") {
        mpvue.navigateTo({
          url: "../activityDetails/main?id=" + item.LinkUrl
        });
      }
    },
    details(item) {
      let vm = this;
      mpvue.showLoading({
        title: "加載中"
      });
      mpvue.request({
        url: `${vm.$api}/coupon/getCardSignature?card_id=${item.card_id}`,
        success: function(res) {
          if (res.statusCode == 200) {
            let _data = res.data.data;
            vm.getcardExt(_data);
          } else {
            mpvue.showToast({
              title: "網絡發生異常！",
              icon: "none",
              time: "2000"
            });
          }
        }
      });
    },
    getcardExt(_data) {
      let vm = this;
      let { card_id, timestamp, signature, nonceStr } = _data;
      let cardExt = `{"timestamp":"${timestamp}","signature":"${signature}","nonce_str":"${nonceStr}"}`;
      console.log(card_id, cardExt);
      mpvue.addCard({
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
          let cardList = mpvue.getStorageSync("cardList");
          if (cardList) {
            cardList[res.cardList[0].cardId] = res.cardList[0];
            mpvue.setStorageSync("cardList", cardList);
          } else {
            let obj = {};
            obj[res.cardList[0].cardId] = res.cardList[0];
            mpvue.setStorageSync("cardList", obj);
          }
          console.log(res.cardList); // 卡券添加结果
        },
        fail(res) {
          console.log(res);
          if (res.errMsg == "addCard:fail cancel") {
            mpvue.hideLoading();
          } else {
            mpvue.hideLoading();
            mpvue.showToast({
              title: "领取失败！",
              icon: "none",
              time: "2000"
            });
          }
        }
      });
    },
    swiperChange: function(e) {
      this.currentSwiper = e.mp.detail.current;
    },
    tagClick(e) {
      this.tagCheck = e;
      this.pid = e;
      this.pageNum = 1;
      this.discountData = [];
      this.getDiscount(1);
    },
    getDiscount(page) {
      let vm = this;
      vm.isGet = false;
      mpvue.request({
        url: `${this.$api}/coupon/couponList?page=${page}&limit=5&cid=${
          vm.pid
        }`,
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            if (res.data.data.length > 0) {
              vm.isGet = true;
              vm.discountData = [...vm.discountData, ...res.data.data];
            } else {
              vm.isGet = false;
              if (page > 1) {
                mpvue.showToast({
                  title: "已加載全部數據",
                  icon: "none",
                  duration: 2000
                });
              }
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
    let _query = wx.createSelectorQuery();
    let vm = this;
    mpvue.showLoading({
      title: "加載中"
    });
    mpvue.request({
      url: `${this.$api}/home/banner?navcode=couponBanner`,
      success: function(res) {
        if (res.statusCode == 200) {
          var datas = res.data.data;
          if (res.data.data.length > 0) {
            vm.bannerData = datas.map(value => {
              value.img_url = vm.$imgHost + value.img_url.replace(/\\/g, "/");
              return value;
            });
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
    mpvue.request({
      url: `${this.$api}/coupon/couponClassfyList`,
      success: function(res) {
        if (res.statusCode == 200) {
          vm.discountData = [];
          vm.tagData = [];
          vm.tagData = res.data.data;
          setTimeout(_ => {
            _query.selectAll(".tag-li").boundingClientRect();
            _query.exec(res => {
              res[0].forEach(value => {
                vm.maxw += value.width;
              });
            });
            vm.tagCheck = vm.tagData[0].id;
            vm.pid = vm.tagData[0].id;
            vm.getDiscount(1);
          }, 50);
        } else {
          mpvue.showToast({
            title: "網絡發生異常！",
            icon: "none",
            time: "2000"
          });
        }
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
  onLoad() {}
};
</script>
<style lang="less" scoped>
.banner {
  margin: 0 auto;
  position: relative;
  swiper {
    height: 350rpx;
    img{
      height: 100%;
    }
  }
  .dots {
    position: absolute;
    bottom: 10rpx;
    left: 0;
    width: 100%;

    text-align: center;
    span {
      width: 8rpx;
      height: 6rpx;
      background: white;
      border-radius: 3rpx;
      opacity: 0.6;
      display: inline-block;
      margin: 0 8rpx;
      &.active {
        width: 22rpx;
        height: 6rpx;
        background: white;
        border-radius: 3rpx;
        opacity: 1;
      }
    }
  }
}
.tag {
  ul {
    overflow: hidden;
    width: 10000px;
    li {
      float: left;
      line-height: 87rpx;
      padding: 0 24rpx;
      position: relative;
      color: #666666;
      &.on {
        color: #333333;
        &:before {
          position: absolute;
          bottom: 4rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 66rpx;
          height: 6rpx;
          background: rgba(0, 169, 128, 1);
          content: "";
          display: block;
        }
      }
    }
  }
}
.discount-main {
  background-color: #f5f5f5;
  min-height: calc(~"100vh - 437rpx");
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
</style>