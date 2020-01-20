<template>
  <div class="message">
    <div class="headview">
      <img class="head_image" src="/static/images/mymessage.png" mode="widthFix" />
    </div>
    <scroll-view scroll-y="true" bindscrolltolower="searchScrollLower">
      <div v-for="(item,index) in messagedata" :key="index">
        <div class="screening-info" :data-id="item.id">
          <text class="screeningtext-top text-over">{{item.createTime}}</text>
          <text class="screeningtext-bottom text-over">问:{{item.problem}}</text>

          <div
            :class="item.reply.length>0 ? 'screeningtext-bottom':'screeningtext-bottoms testShow'"
          >
            <text>答:</text>
            {{item.reply}}
          </div>
        </div>
      </div>
      <div class="loading" v-show="searchLoading">正在载入更多...</div>
      <div class="loading complete" v-show="searchLoadingComplete">已加载全部</div>
    </scroll-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messagedata: [],
      isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
      searchPageNum: 1, // 设置加载的第几次，默认是第一次
      callbackcount: 15, //返回数据的个数
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
      title: "正在加载数据..."
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getdata(true);
    //状态修改
    mpvue.request({
      url: this.config.service.updateMyRecordStatus,
      data: {
        args: {
          userId: mpvue.getStorageSync("userId"),
          sessionId: mpvue.getStorageSync("sessionId")
        }
      },
      success: function(res) {
        console.log("success", res.data.Data);
      },
      fail: function(res) {
        console.log("fail", res.data);
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.searchPageNum= 1
    this.getdata(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var vm = this;
    vm.searchPageNum++;
    vm.getdata(false);
  },
  methods: {
    getdata: function(e) {
      var vm = this;
      if (e) {
        //下拉刷新
        mpvue.showLoading({
          title: "正在刷新數據"
        });
      } //上拉加载
      else {
        mpvue.showLoading({
          title: "正在加載數據"
        });
      }
      //消息数据获取
      wx.request({
        url: this.config.service.searchMyMessage,
        data: {
          args: {
            userId: mpvue.getStorageSync("userId"),
            sessionId: mpvue.getStorageSync("sessionId"),
            count: 10,
            pageNum: vm.searchPageNum
          }
        },
        success: function(res) {
          // console.log('success', Data)
          if (res.data.Code == 200) {
            mpvue.hideLoading();
            if (vm.searchPageNum == 1) {
              vm.messagedata = res.data.messageList;
            } else {
              vm.messagedata = vm.messagedata.concat(
                res.data.messageList
              );
            }
          } else if (res.data.Code == 209) {
            if (vm.searchPageNum == 1) {
              mpvue.showToast({
                title: "暫無數據",
                icon: "none",
                duration: 2000
              });
              vm.messagedata = res.data.messageList;
            } else {
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            }
          } else {
            mpvue.showToast({
              title: res.data.Message || "網絡異常",
              icon: "none",
              duration: 2000
            });
          }
        },
        fail: function(res) {
          mpvue.showToast({
            title: "網絡異常",
            icon: "none",
            duration: 2000
          });
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
  }
};
</script>
<style lang="less" scoped>
/* pages/message/message.wxss */
page {
  height: auto;
}

.testShow text {
  display: none;
  margin-bottom: 0px;
}

.message {
  height: 100%;
  width: 100%;
}

.headview {
  width: 100%;
  height: 130rpx;
  background: -webkit-gradient(
    linear,
    10% 10%,
    10% 100%,
    from(rgba(36, 165, 73, 1)),
    to(rgba(53, 189, 77, 1))
  );
}

.head_image {
  height: 100%;
  width: 100%;
}

.smessage_item_container {
  width: 100%;
  flex-direction: column;
}

.item-timeview {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  color: rgb(38, 167, 74);
  font-size: 28rpx;
}

.item-contentview {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  color: rgb(102, 102, 102);
  font-size: 22rpx;
}

.screening-info {
  /* background: #f69; */
  width: 90%;
  float: left;
  margin-top: 20rpx;
  /* margin-bottom: 20px; */
  margin-left: 5%;
  margin-right: 5%;
  display: block;
}

.screeningtext-top {
  display: -webkit-box;
  margin-top: 10px;
  margin-bottom: 10px;
  color: rgb(38, 167, 74);
  font-size: 38rpx;
}

.screeningtext-bottoms {
  display: -webkit-box;
  color: rgb(102, 102, 102);
  font-size: 32rpx;
}

.screeningtext-bottom {
  display: -webkit-box;
  margin-bottom: 10px;
  color: rgb(102, 102, 102);
  font-size: 32rpx;
}


</style>