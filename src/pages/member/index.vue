<template>
  <div class="member">
    <button
      class="user-login"
      v-if="!hasUserInfo && canIUse"
      open-type="getUserInfo"
      @getuserinfo="bindGetUserInfo"
    ></button>
    <div class="member-head">
      <div class="top">
        <img :src="userInfo.avatarUrl" mode="widthFix" alt />
      </div>
      <h2>{{userInfo.nickName}}</h2>
      <a href="../connectus/main">
        <i class="iconfont icon-lianxikefu"></i>
      </a>
    </div>
    <div class="member-list">
      <ul>
        <li v-for="(item,index) in memberData" :key="index">
          <a :href="item.url" v-if="item.url!=''">
            <p>
              <i :class="'iconfont '+item.icon"></i>
            </p>
            <h2>{{item.title}}</h2>
            <i class="iconfont icon-you1"></i>
          </a>
          <div v-if="item.url==''" @click="outLogin">
            <p>
              <i :class="'iconfont '+item.icon"></i>
            </p>
            <h2>{{item.title}}</h2>
            <i class="iconfont icon-you1"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasUserInfo: false,
      canIUse: wx.canIUse("button.open-type.getUserInfo"),
      userInfo: {
        nickName: "立即登陆",
        avatarUrl: require("../../../static/images/top.png")
      },
      memberData: [
        { icon: "icon-collect", title: "我的收藏", url: "../myCollect/main" },
        {
          icon: "icon-youhuiquan",
          title: "我的優惠券",
          url: "../myDiscount/main"
        },
        { icon: "icon-jilu", title: "搜索紀錄", url: "../myRecord/main" },
        { icon: "icon-guanyu", title: "關於我們", url: "../myAbout/main" },
        {
          icon: "icon-tuichudenglu",
          title: "退出登錄",
          url: ""
        }
      ]
    };
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
  onShow() {
    let userInfo = mpvue.getStorageSync("userInfo");
    if (userInfo) {
      this.hasUserInfo = true;
      this.userInfo = userInfo;
    }
  },
  methods: {
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
        }
      );
    },
    outLogin() {
      mpvue.removeStorageSync("userInfo");
      mpvue.removeStorageSync("nickName");
      mpvue.removeStorageSync("avatarUrl");
      mpvue.removeStorageSync("sessionId");
      mpvue.removeStorageSync("userId");
      this.hasUserInfo = false;
      this.userInfo = {
        nickName: "立即登陆",
        avatarUrl: require("../../../static/images/top.png")
      };
    }
  }
};
</script>

<style lang="less" scoped>
.member {
  min-height: 100vh;
  background-color: #f7f7f7;
  .member-head {
    height: 295rpx;
    background-color: #00a980;
    position: relative;
    padding-top: 40rpx;
    .top {
      width: 140rpx;
      height: 140rpx;
      margin: 0 auto;
      border-radius: 50%;
      overflow: hidden;
      background-color: white;
    }
    h2 {
      font-size: 36rpx;
      color: rgba(255, 255, 255, 1);
      line-height: 50rpx;
      margin-top: 15rpx;
      text-align: center;
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
  .member-list {
    ul {
      background: rgba(255, 255, 255, 1);
      li {
        height: 104rpx;
        line-height: 104rpx;
        margin: 0 32rpx;
        border-bottom: 1px solid #eeeeee;
        &:last-child {
          border-bottom: 0px;
        }
        a,
        div {
          display: block;
          overflow: hidden;
          & > p {
            float: left;
            font-size: 32rpx;
          }
          & > h2 {
            float: left;
            margin-left: 25rpx;
            font-size: 32rpx;
          }
          & > i {
            font-size: 26rpx;
            float: right;
            color: #cccccc;
          }
        }
      }
    }
  }
}
</style>
