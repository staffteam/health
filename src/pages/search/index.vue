<template>
  <div>
    <div class="weui-cell1 weui-cell_input">
      <input
        class="weui-input"
        confirm-type="search"
        :focus="true"
        @confirm="blurs"
        placeholder="請輸入您要搜索的內容"
        v-model="inputvalue"
      />
    </div>
    <div>
      <div v-for="(item,index) in searchRecords" :key="index">
        <div class="parameter-info" :data-id="item">
          <div @click="parameterTap" class="back" :data-id="item"></div>
          <span class="text-info text-over">{{item}}</span>
          <div class="imageView" :data-id="index" @click="deleteTap">
            <img class="image-info" src="/static/images/xx.png" mode="aspectFit" />
          </div>
          <div class="line_view"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchRecords: [],
      inputvalue:''
    };
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var searchRecord = mpvue.getStorageSync("searchRecords");
    var searchRecords1 = new Array();
    if (searchRecord) {
      searchRecords1 = searchRecord;
      this.searchRecords = searchRecords1;
    }
    this.inputvalue = '';
  },
  methods: {
    getdata: function(e) {
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
    //搜索事件
    blurs: function(e) {
      let vm = this;
      var vue = vm.inputvalue;
      if (vue != "") {
        var newarray = [vue];
        var searchRecord = mpvue.getStorageSync("searchRecords");
        var searchRecords = new Array();
        console.log("nickName", searchRecord);
        if (searchRecord) {
          searchRecords = searchRecord;
          searchRecords = vm.unique(searchRecords,vue);
          mpvue.setStorageSync("searchRecords", searchRecords);
        } else {
          mpvue.setStorageSync("searchRecords", newarray);
        }
        mpvue.navigateTo({ url: "../table/main?title=" + vue });
      } else {
        mpvue.showToast({
          title: "请输入要搜索的内容",
          icon: "none",
          duration: 1000
        });
      }
    },
    unique(arr,val) {
      let _is = true;
      arr.forEach(value=>{
        if(value == val){
          _is=false;
        }
      })
      _is?arr.push(val):null;
      return arr;
    },
    //记录点击事件
    parameterTap: function(e) {
      mpvue.navigateTo({
        url: "../table/main?title=" + e.mp.currentTarget.dataset.id
      });
    },
    //删除记录点击事件
    deleteTap: function(e) {
      console.log("dataset", e.mp.currentTarget.dataset);

      var searchRecord = mpvue.getStorageSync("searchRecords");
      var searchRecords = new Array();
      console.log("nickName", searchRecord);
      if (searchRecord) {
        searchRecords = searchRecord;
        searchRecords.splice(e.mp.currentTarget.dataset.id, 1);
        mpvue.setStorageSync("searchRecords", searchRecords);
        this.searchRecords = searchRecords;
      }
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
.weui-cell1 {
  padding: 10px 15px;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  background: #00a980;
}
.weui-input {
  /* background:"../../../image/icon_foot.png" no-repeat 5px 5px;   */

  height: 2.58823529em;
  min-height: 2.58823529em;
  line-height: 2.58823529em;
  margin: 5px auto;
  text-align: 10px;
  border-radius: 24px;
  border: 0.25px solid rgb(240, 240, 240);
  padding-left: 40px;
  padding-right: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 1);
}

.weui-input:before {
  content: "";
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZTJjODIzZC1hYjM1LTA2NDItOGVlMC0yZDI3ZWM1ZmMzYzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkM2MjgyNDczQzk2MTFFOEI2ODdCMzdEQUMzOUY2REIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkM2MjgyNDYzQzk2MTFFOEI2ODdCMzdEQUMzOUY2REIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N2U2ZTVkYzQtNTNiMi04MTRiLWJlN2UtZGE2MGUwM2U5Y2MzIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGNlMGEzODYtMjM2ZC0xMWU4LWFhMTItZjczM2NiOTlhY2IzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+rOuCTgAAAMlQTFRFqqqqtLS08vLy8PDw7+/vsLCw5ubm8fHx+vr69PT0sbGx8/Pz+Pj4tbW139/fuLi40tLSra2twMDAvb29y8vLsrKyrKyss7Oz9vb2zc3NxsbG4uLix8fHq6ur6urq19fX0NDQ2NjYt7e3+/v7yMjI9fX129vb1NTU7u7uz8/Pw8PDzMzM/Pz8ysrK2traxMTEr6+vrq6uycnJ5eXl+fn54eHhurq61dXVxcXFzs7O/v7+7e3t09PTu7u7v7+/3d3dvr6+ubm5////vdqAPgAAAEN0Uk5T////////////////////////////////////////////////////////////////////////////////////////AEFiBO8AAAEqSURBVHjadNLXdoMwDAbgnxkgrBAgu9mrSdO9R1q//0PVGGMMpbqA4/NhI0sC4aGf9oPt/QORA/lrFIGFEvbraF9nkCgpffb8KmoG3bLVXKs9yr6aybh2gNjia1MBThJeAtJR6wXwLtAEBnKKGtAV2EVvWbnAFLjg2AKeK0aOBqYcN0CriuQFQ457JFYNr/DE8QBvWcMYAccQN+6fnd8cH0VuIiIcOLq3WFXNTnEu7rmqpztGp12g2hEVYeEDr2VtP4DhUZg5AQJV4ButfGDy/81Yzx2tbPaYrj9DfzQfdvKBgKGXYzL3UMTdIp8XvZwha/NFW54GgxbpO0wnO4E0XH2X36CtME10CaV252qYTUhsg2nUiETNEvxRm5GoPXh98g8SLaZV+hVgAKMlkIY2VWZ8AAAAAElFTkSuQmCC")
    no-repeat left;
  background-size: 20px 20px;
  background-position: 10px;
  position: absolute;
  left: 0px;
  width: 40px;
  height: 40px;
}

.parameter-info {
  width: 100%;
  height: 92rpx;
  position: relative;
}
.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.text-info {
  margin-left: 60rpx;
  line-height: 90rpx;
}
.imageView {
  width: 90rpx;
  height: 90rpx;
  float: right;
  margin-right: 10rpx;
  position: relative;
  z-index: 9;
}

.image-info {
  width: 50rpx;
  height: 50rpx;
  margin-top: 20rpx;
  margin-left: 10rpx;
}

.line_view {
  width: 90%;
  height: 2rpx;
  background: #eee;
  margin-right: 5%;
  margin-left: 5%;
}
</style>