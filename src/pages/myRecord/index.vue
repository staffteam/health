<template>
  <div class="record-list">
    <ul>
      <li v-for="(item,index) in searchRecords" :key="index">
        <a :href="'../table/main?title='+item">
          <h2>{{item}}</h2>
          <i class="iconfont icon-you1"></i>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchRecords: [],
      searchPageNum: 1 // 设置加载的第几次，默认是第一次
    };
  },
  mounted() {
    var searchRecord = mpvue.getStorageSync("searchRecords");
    var searchRecords1 = new Array();
    console.log("nickName", searchRecord);
    if (searchRecord) {
      searchRecords1 = searchRecord;
      this.searchRecords= searchRecords1;
    }
  },
  methods: {
    getdata: function(e) {
      var that = this;
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
        url: this.config.service.searchMyRecord,
        data: {
          args: {
            userId: mpvue.getStorageSync("userId"),
            sessionId: mpvue.getStorageSync("sessionId"),
            count: 20,
            pageNum: that.searchPageNum
          }
        },
        success: function(res) {
          // console.log('success', Data)
          mpvue.hideLoading();
          if (res.data.Code == 200) {
            if (that.searchPageNum == 1) {
              that.searchRecords = res.data.Data;
            } else {
              that.searchRecords = that.data.searchRecords.concat(
                res.data.Data
              );
            }
          } else if (res.data.Code == 209) {
            if (that.searchPageNum == 1) {
              mpvue.showToast({
                title: "暫無數據",
                icon: "none",
                duration: 2000
              });
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
  onPullDownRefresh: function() {
    this.searchPageNum = 1;
    // this.getdata(true);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.searchPageNum++;
    // that.getdata(false);
  }
};
</script>
<style lang="less" scoped>
.record-list {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 12rpx;
  ul {
    li {
      height: 118rpx;
      line-height: 72rpx;
      background: rgba(255, 255, 255, 1);
      padding: 23rpx 40rpx;
      border-bottom: 1px solid #eeeeee;
      &:last-child {
        border-bottom: 0px;
      }
      a {
        display: block;
        overflow: hidden;
      }
      h2 {
        float: left;
        font-size: 32rpx;
      }
      i {
        float: right;
        font-size: 26rpx;
        color: #cccccc;
      }
    }
  }
}
</style>