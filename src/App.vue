<script>
export default {
  created() {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs;
    if (mpvuePlatform === "my") {
      logs = mpvue.getStorageSync({ key: "logs" }).data || [];
      logs.unshift(Date.now());
      mpvue.setStorageSync({
        key: "logs",
        data: logs
      });
    } else {
      logs = mpvue.getStorageSync("logs") || [];
      logs.unshift(Date.now());
      mpvue.setStorageSync("logs", logs);
    }
  },
  log() {
    console.log(`log at:${Date.now()}`);
  }
};
</script>
<style lang="less">
view,
text {
  box-sizing: border-box;
  -webkit-tab-highlight-color: rgba(0, 0, 0, 0);
}
image {
  width: 100%;
}

.quality-list {
  .wxParse {
    .p {
      margin: 0 0;
      margin-top: 10rpx;
      font-size: 28rpx;
      color: rgba(51, 51, 51, 1);
      line-height: 40rpx;
      letter-spacing: 1rpx;
      .strong {
        margin: 0 0;
        font-size: 36rpx;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 50rpx;
        letter-spacing: 2rpx;
      }
    }
  }
}

.notsel {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 30px;
}
.not-data {
  padding: 100rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}
.button-hover,
.navigator-hover {
  background-color: rgba(0, 0, 0, 0);
  opacity: 1;
}
.loading {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 25rpx;
  line-height: 30rpx;
  height: 70rpx;
  view {
    display: inline-block;
    image {
      width: 30rpx;
      float: left;
      margin-right: 10rpx;
    }
  }
}
button.userLogin {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999;
  display: block;
  opacity: 0;
}
.img-back {
  img {
    width: 100%;
  }
}
.test-result .wxParse .p,
.content .wxParse .p {
  margin: 5rpx 0;
}

.wxParses {
  .wxParse {
    .title_view {
      width: 100%;
      height: 80rpx;
      overflow: hidden;
      padding: 0;
    }

    .mark_view_to {
      width: 8rpx;
      height: 24px;
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: 30rpx;
      background: red;
      color: rgb(178, 178, 178);
      float: left;
    }

    .mark_view {
      width: 8rpx;
      height: 24px;
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: 30rpx;
      background: -webkit-gradient(
        linear,
        10% 10%,
        10% 100%,
        from(rgba(36, 165, 73, 1)),
        to(rgba(53, 189, 77, 1))
      );
      float: left;
    }

    .title_text_to {
      line-height: 40px;
      margin-left: 40rpx;
      font-size: 20px;
      color: red;
      float: left;
    }

    .title_text {
      line-height: 40px;
      margin: 0;
      margin-left: 40rpx;
      font-size: 20px;
      color: rgb(44, 44, 44);
      float: left;
    }
    .mark_main {
      padding: 0 30rpx;
      .p {
        margin: 5rpx 0;
      }
    }
  }
}

.user-login {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  opacity: 0;
}
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_1501474_nv3j9i83zlg.eot?t=1579526848856'); /* IE9 */
  src: url('//at.alicdn.com/t/font_1501474_nv3j9i83zlg.eot?t=1579526848856#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('//at.alicdn.com/t/font_1501474_nv3j9i83zlg.woff?t=1579526848856') format('woff'),
  url('//at.alicdn.com/t/font_1501474_nv3j9i83zlg.ttf?t=1579526848856') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('//at.alicdn.com/t/font_1501474_nv3j9i83zlg.svg?t=1579526848856#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-lianxikefu:before {
  content: "\e6bd";
}

.icon-shouye:before {
  content: "\e645";
}

.icon-sousuo:before {
  content: "\e64c";
}

.icon-xialajiantou:before {
  content: "\e620";
}

.icon-nv:before {
  content: "\e71a";
}

.icon-guanyu:before {
  content: "\e611";
}

.icon-xiangzuo:before {
  content: "\e630";
}

.icon-you1:before {
  content: "\e608";
}

.icon-mingcheng:before {
  content: "\e60b";
}

.icon-fenxiang:before {
  content: "\e626";
}

.icon-xiaoxi:before {
  content: "\e607";
}

.icon-nan:before {
  content: "\e65d";
}

.icon-xia:before {
  content: "\e604";
}

.icon-shang:before {
  content: "\e640";
}

.icon-shoucang2:before {
  content: "\e609";
}

.icon-caret-down:before {
  content: "\e8ec";
}

.icon-caret-up:before {
  content: "\e8ed";
}

.icon-wuxiaoxing-kong:before {
  content: "\e60a";
}

.icon-youhuiquan:before {
  content: "\e629";
}

.icon-shanchu-copy-copy:before {
  content: "\e601";
}

.icon-jilu:before {
  content: "\e652";
}

.icon-dizhi:before {
  content: "\e602";
}

.icon-collect:before {
  content: "\e603";
}

.icon-richscan_icon:before {
  content: "\e600";
}

.icon-rili:before {
  content: "\e605";
}

.icon-tuichudenglu:before {
  content: "\e646";
}

.icon-shoucang-copy:before {
  content: "\e606";
}

.icon-xia1:before {
  content: "\e656";
}

.icon-wode:before {
  content: "\e60f";
}
.wxparse-mains {
  .wxParse {
    .h1 {
      margin: 0 0;
    }
    .h2 {
      margin: 0 0;
    }
    .h3 {
      margin: 0 0;
    }
    .h4 {
      margin: 0 0;
    }
    .h5 {
      margin: 0 0;
    }
    .h6 {
      margin: 0 0;
    }
    .p {
      margin: 5px 0;
    }
    .pre {
      margin: 0 0px;
    }
    .ul,
    .ol {
      margin: 0 0;
      padding-left: 0;
    }
  }
}

</style>
