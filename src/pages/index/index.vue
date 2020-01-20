<template>
  <div class="home">
    <button
      class="user-login"
      v-if="!hasUserInfo && canIUse"
      open-type="getUserInfo"
      @getuserinfo="bindGetUserInfo"
    ></button>
    <div class="home-top">
      <p class="img-back">
        <img :src="homeTop" mode="widthFix" alt />
      </p>
      <div class="top-main">
        <p>
          <a href="../search/main">
            <i class="iconfont icon-sousuo"></i>
            <input type="text" placeholder="請輸入您要搜索的內容" disabled />
          </a>
        </p>
        <h2>
          <template v-for="(item,index) in searchRecords">
            <span :key="index" @click="recordsClick(item.Content)">{{item.Content}}</span>
            <em :key="index" v-if="index<searchRecords.length-1">|</em>
          </template>
        </h2>
      </div>
      <a href="../connectus/main">
        <i class="iconfont icon-lianxikefu"></i>
      </a>
    </div>
    <div class="scan" v-if="isQRcode">
      <a href="../qrCode/main">
        <p>
          <i class="iconfont icon-richscan_icon"></i> 掃一掃條形碼
        </p>
      </a>
    </div>
    <div class="nav">
      <ul v-if="isQRcode">
        <li v-for="(item,index) in [navData[0],navData[1],navData[2],navData[3]]" :key="index">
          <a :href="item.url">
            <p>
              <img :src="item.imgUrl" alt />
            </p>
            <h2>{{item.title}}</h2>
          </a>
        </li>
      </ul>
      <ul v-if="!isQRcode">
        <li v-for="(item,index) in [navData[1],navData[2],navData[3]]" :key="index">
          <a :href="item.url">
            <p>
              <img :src="item.imgUrl" alt />
            </p>
            <h2>{{item.title}}</h2>
          </a>
        </li>
      </ul>
      <ul>
        <li v-for="(item,index) in [navData[4],navData[5]]" :key="index">
          <a :href="item.url">
            <p>
              <img :src="item.imgUrl" alt />
            </p>
            <h2>{{item.title}}</h2>
          </a>
        </li>
      </ul>
    </div>
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
    <div class="ranking">
      <div class="title">
        <h2>
          <img src="/static/images/home_top.png" mode="widthFix" alt />
          TOP10搜索排行
        </h2>
        <a href="../ranking/main">
          更多
          <i class="iconfont icon-you1"></i>
        </a>
      </div>
      <div class="ranking-banner">
        <swiper
          :indicator-dots="false"
          circular="true"
          duration="300"
          display-multiple-items="3"
          next-margin="40rpx"
        >
          <swiper-item
            class="item"
            :data-id="item.Id"
            @click="rankingClick(item.Id)"
            v-for="(item,index) in parameter"
            :key="index"
          >
            <p>
              <img :src="item.img_url" mode="aspectFill" alt />
              <span class="top" v-if="index<=2">
                <img :src="'/static/images/0'+(index+1)+'.png'" mode="widthFix" alt />
              </span>
            </p>
            <div class="label">
              <span v-for="(items,i) in item.labels" :key="i">{{items}}</span>
            </div>
            <h2 class="lines">{{item.Drugs_name}}</h2>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="activity">
      <div class="new-title">
        <h2>
          <img src="/static/images/leaf.png" mode="widthFix" alt />
          活動資訊
        </h2>
        <a href="../activity/main">
          更多
          <i class="iconfont icon-you1"></i>
        </a>
      </div>
      <div class="activity-banner">
        <swiper
          :indicator-dots="false"
          circular="true"
          duration="300"
          :display-multiple-items="activityData.length>1?'2':'1'"
          next-margin="40rpx"
        >
          <swiper-item class="item" v-for="(item,index) in activityData" :key="index">
            <a :href="'../activityDetails/main?id='+item.ArticleID">
              <p>
                <img :src="item.img_url[0]" mode="aspectFill" alt />
              </p>
              <h2 class="line">{{item.ArticleTitle}}</h2>
              <span>{{item.ReleaseTime || ''}}</span>
            </a>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="activity">
      <div class="new-title">
        <h2>
          <img src="/static/images/leaf.png" mode="widthFix" alt />
          健康資訊
        </h2>
        <a href="../health/main">
          更多
          <i class="iconfont icon-you1"></i>
        </a>
      </div>
      <div class="activity-banner">
        <swiper
          :indicator-dots="false"
          circular="true"
          duration="300"
          :display-multiple-items="healthData.length>1?'2':'1'"
          next-margin="40rpx"
        >
          <swiper-item class="item" v-for="(item,index) in healthData" :key="index">
            <a :href="'../healthDetails/main?id='+item.ArticleID">
              <p>
                <img :src="item.imglist[0]" mode="aspectFill" alt />
              </p>
              <h2 class="line">{{item.ArticleTitle}}</h2>
              <span>{{item.ReleaseTime || ''}}</span>
            </a>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasUserInfo: false,
      canIUse: wx.canIUse("button.open-type.getUserInfo"),
      bannerData: [],
      rankingData: [],
      activityData: [],
      healthData: [],
      homeTop: require("../../../static/images/home-top.jpg"),
      currentSwiper: 0,
      isQRcode: true,
      navData: [
        {
          title: "防偽認證",
          imgUrl: require("../../../static/images/home-btn-1.png"),
          url: "../antiFake/main"
        },
        {
          title: "優質認證區",
          imgUrl: require("../../../static/images/home-btn-2.png"),
          url: "../quality/main"
        },
        {
          title: "活動資訊",
          imgUrl: require("../../../static/images/home-btn-3.png"),
          url: "../activity/main"
        },
        {
          title: "健康資訊",
          imgUrl: require("../../../static/images/home-btn-4.png"),
          url: "../health/main"
        },
        {
          title: "健康小測試",
          imgUrl: require("../../../static/images/home-btn-5.png"),
          url: "../testForm/main"
        },
        // {
        //   title: "商城連結",
        //   imgUrl: require("../../../static/images/home-btn-6.png"),
        //   url: "../project/main"
        // },
        {
          title: "優惠券專區",
          imgUrl: require("../../../static/images/home-btn-7.png"),
          url: "../discount/main"
        }
      ],
      searchRecords: [],
      parameter: []
    };
  },
  methods: {
    bannerClick(item) {
      if (item.LinkUrl == 0) return;
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
    bindGetUserInfo(e) {
      if (!e.mp.detail.userInfo) return;
      var vm = this;
      var userInfo_ = e.mp.detail.userInfo;
      this.getInfo(
        {
          detail: {
            userInfo: userInfo_
          }
        },
        function(data) {
          vm.hasUserInfo = true;
          vm.userInfo = data;
          mpvue.setStorageSync("userInfo", data);
          mpvue.request({
            url: `${this.$api}/member/isSuper`,
            data: {
              userid: mpvue.getStorageSync("userId")
            },
            success: function(res) {
              var datas = res.data.data;
              vm.isQRcode = datas;
            }
          });
        }
      );
    },
    recordsClick(title) {
      mpvue.navigateTo({
        url: "../table/main?title=" + title
      });
    },
    swiperChange: function(e) {
      this.currentSwiper = e.mp.detail.current;
    },
    rankingClick(id) {
      mpvue.navigateTo({ url: `../productDetails/main?title=${id}` });
    },
    getdata(e) {
      var vm = this;
      let uiserid = mpvue.getStorageSync("userId");
      let sessionId = mpvue.getStorageSync("sessionId");
      //消息数据获取
      wx.request({
        url: this.config.service.searchMyRecord,
        data: {
          args: {
            userId: uiserid,
            sessionId: sessionId,
            count: 3,
            pageNum: 1
          }
        },
        success: function(res) {
          if (res.data.Code == 200) {
            vm.searchRecords = res.data.Data;
          }
        }
      });
    },
    getLoad(isRefresh) {
      let vm = this;
      let _i = 0;
      //首页轮播
      mpvue.request({
        url: `${this.$api}/home/banner?navcode=indexbanner`,
        success: function(res) {
          var datas = res.data.data;
          vm.bannerData = datas.map(value => {
            value.img_url = vm.$imgHost + value.img_url.replace(/\\/g, "/");
            return value;
          });
          _i++;
        }
      });
      //top10排行
      mpvue.request({
        url: `${this.$api}/Drug/top`,
        success: function(res) {
          if (res.statusCode == 200) {
            var datas = res.data.data;
            vm.parameter = datas;
          }
          _i++;
        }
      });
      //首页背景图
      mpvue.request({
        url: `${this.$api}/home/logo`,
        success: function(res) {
          if (res.statusCode == 200) {
            var datas = res.data.data;
            if (datas != "未找到图片") {
              vm.homeTop = vm.$imgHost + datas.replace(/\\/g, "/");
            }
          }
          _i++;
        }
      });
      //活动资讯
      mpvue.request({
        url: `${
          this.$api
        }/article/activityNewsList?IsIndexShow=1&page=1&limit=10`,
        success: function(res) {
          var datas = res.data.data;
          vm.activityData = [];
          for (let item in datas) {
            datas[item].img_url = datas[item].img_url.map(value => {
              return vm.$imgHost + value.replace(/\\/g, "/");
            });
            if (datas[item].ReleaseTime) {
              let _arr = datas[item].ReleaseTime.split(" ");
              let _arrs = _arr[1].split(":");
              datas[item].ReleaseTime = `${_arr[0]} ${_arrs[0]}:${_arrs[1]}`;
            }
            vm.activityData.push(datas[item]);
          }
          _i++;
        }
      });
      //新闻资讯
      mpvue.request({
        url: `${this.$api}/article/newsList?IsIndexShow=1&page=1&limit=10`,
        success: function(res) {
          var datas = res.data.data;
          vm.healthData = [];
          for (let item in datas) {
            datas[item].imglist = datas[item].imglist.map(value => {
              return vm.$imgHost + value.replace(/\\/g, "/");
            });
            if (datas[item].ReleaseTime) {
              let _arr = datas[item].ReleaseTime.split(" ");
              let _arrs = _arr[1].split(":");
              datas[item].ReleaseTime = `${_arr[0]} ${_arrs[0]}:${_arrs[1]}`;
            }
            vm.healthData.push(datas[item]);
          }
          _i++;
        }
      });
      //热门搜索
      mpvue.request({
        url: `${this.$api}/home/HotKeyword`,
        success: function(res) {
          let datas = res.data.data;
          vm.searchRecords = datas;
          _i++;
        }
      });
      if (isRefresh) {
        let _set = setInterval(_ => {
          if (_i == 6) {
            wx.stopPullDownRefresh();
            clearInterval(_set);
            mpvue.showToast({
              title: "刷新成功",
              icon: "success",
              duration: 2000
            });
          }
        }, 100);
      }
    }
  },
  onShow() {
    let userInfo = mpvue.getStorageSync("userInfo");
    if (userInfo) {
      this.hasUserInfo = true;
    }
  },
  onPullDownRefresh: function() {
    this.getLoad(true);
  },
  onLoad() {
    this.getLoad();
  }
};
</script>

<style lang="less" scoped>
.home {
  padding-bottom: 40rpx;
  .home-top {
    position: relative;
    .top-main {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 9;
      p {
        width: 578rpx;
        height: 70rpx;
        margin: 0 auto;
        background: rgba(255, 255, 255, 1);
        border-radius: 8rpx;
        i {
          width: 80rpx;
          display: block;
          text-align: center;
          line-height: 70rpx;
          font-size: 28rpx;
          float: left;
          color: #999999;
        }
        input {
          width: calc(~"100% - 80rpx");
          display: block;
          float: right;
          height: 70rpx;
          font-size: 26rpx;
        }
      }
      h2 {
        text-align: center;
        padding: 24rpx 0 36rpx;
        min-height: 84rpx;
        span {
          color: white;
          font-size: 24rpx;
          display: inline-block;
        }
        em {
          color: white;
          font-size: 24rpx;
          display: inline-block;
          margin: 0 15rpx;
        }
      }
    }
    & > a {
      position: absolute;
      right: 27rpx;
      top: 22rpx;
      i {
        font-size: 45rpx;
        color: white;
      }
    }
  }
  .scan {
    margin: 32rpx 0;
    p {
      width: 310rpx;
      height: 70rpx;
      margin: 0 auto;
      background: rgba(0, 169, 128, 1);
      border-radius: 8rpx;
      padding: 0 55rpx;
      line-height: 70rpx;
      font-size: 24rpx;
      color: white;
      i {
        float: left;
        font-size: 32rpx;
        color: white;
        margin-right: 19rpx;
      }
    }
  }
  .nav {
    width: 673rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 1px;
    margin: 0 auto;
    padding: 35rpx 35rpx 48rpx;
    text-align: center;
    ul {
      &:last-child {
        li {
          margin-bottom: 0rpx;
        }
      }
      li {
        width: 120rpx;
        text-align: center;
        display: inline-block;
        margin: 0 15rpx 30rpx;
        p {
          width: 90rpx;
          height: 90rpx;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        h2 {
          font-size: 24rpx;
          color: rgba(153, 153, 153, 1);
          line-height: 32rpx;
          margin-top: 20rpx;
        }
      }
    }
  }
  .banner {
    width: 686rpx;
    margin: 0 auto;
    margin-top: 48rpx;
    position: relative;
    swiper {
      height: 240rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .dots {
      text-align: center;
      span {
        width: 8rpx;
        height: 6rpx;
        background: rgba(0, 169, 128, 1);
        border-radius: 3rpx;
        opacity: 0.3;
        display: inline-block;
        margin: 0 8rpx;
        &.active {
          width: 22rpx;
          height: 6rpx;
          background: rgba(0, 169, 128, 1);
          border-radius: 3rpx;
          opacity: 1;
        }
      }
    }
  }
  .ranking {
    margin: 0 32rpx;
    margin-top: 50rpx;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 40rpx;
    div.title {
      line-height: 45rpx;
      height: 45rpx;
      h2 {
        float: left;
        font-size: 32rpx;
        font-weight: 600;
        color: rgb(107, 82, 82);
        letter-spacing: 2rpx;
        img {
          width: 27rpx;
          height: 35rpx;
          float: left;
          margin-top: 5rpx;
          margin-right: 10rpx;
        }
      }
      a {
        float: right;
        color: #00a980;
        font-size: 24rpx;
        i {
          float: right;
          margin-left: 10rpx;
          font-size: 24rpx;
        }
      }
    }
    div.ranking-banner {
      margin-top: 40rpx;
      swiper {
        height: 330rpx;
      }
      .item {
        p {
          position: relative;
          width: 184rpx;
          height: 184rpx;
          margin: 0 auto;
          overflow: hidden;
          img {
            height: 100%;
          }
          span.top {
            position: absolute;
            left: 0;
            top: 10rpx;
            width: 37rpx;
            height: 55rpx;
            display: block;
          }
        }
        div.label {
          width: 200rpx;
          margin: 0 auto;
          height: 30rpx;
          margin-top: 14rpx;
          overflow: hidden;
          span {
            background: rgba(203, 130, 203, 1);
            border-radius: 4rpx;
            display: block;
            float: left;
            padding: 0 8rpx;
            height: 30rpx;
            line-height: 30rpx;
            font-size: 20rpx;
            margin-right: 5rpx;
            color: rgba(255, 255, 255, 1);
            &:nth-child(2) {
              background-color: #e6889a;
            }
            &:nth-child(3) {
              background-color: #8dac66;
            }
          }
        }
        h2 {
          width: 200rpx;
          margin: 0 auto;
          font-size: 26rpx;
          color: rgba(51, 51, 51, 1);
          line-height: 37rpx;
          letter-spacing: 1rpx;
          margin-top: 16rpx;
        }
      }
    }
  }
  .new-title {
    line-height: 45rpx;
    height: 45rpx;
    h2 {
      float: left;
      font-size: 32rpx;
      font-weight: 600;
      color: rgb(107, 82, 82);
      letter-spacing: 2rpx;
      img {
        width: 29rpx;
        height: 28rpx;
        float: left;
        margin-top: 8.5rpx;
        margin-right: 10rpx;
      }
    }
    a {
      float: right;
      color: #00a980;
      font-size: 24rpx;
      i {
        float: right;
        margin-left: 10rpx;
        font-size: 24rpx;
      }
    }
  }
  .activity {
    margin: 50rpx 32rpx 0;
    .activity-banner {
      margin-top: 32rpx;
      swiper {
        height: 250rpx;
      }
      p {
        width: 300rpx;
        height: 170rpx;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h2 {
        width: 300rpx;
        margin-top: 12rpx;
        font-size: 26rpx;
        line-height: 37rpx;
        letter-spacing: 1rpx;
      }
      span {
        width: 300rpx;
        display: block;
        font-size: 22rpx;
        color: rgba(153, 153, 153, 1);
        line-height: 30rpx;
        letter-spacing: 1rpx;
      }
    }
  }
}
</style>
