<template>
  <div class="activity">
    <div class="l">
      <ul>
        <li
          v-for="(item,index) in activityNavData"
          :key="index"
          @click="activityNavClick(item,index)"
          :class="check==index?'on':''"
        >
          <h2 v-if="item.title">{{item.title}}</h2>
          <p>{{item.month}}</p>
        </li>
      </ul>
    </div>
    <div class="r">
      <ul v-show="activityListData.length>0">
        <li v-for="(item,index) in activityListData" :key="index">
          <a :href="'../activityDetails/main?id='+item.ArticleID+'&date='+dates">
            <p>
              <img :src="item.img_url.length>0?item.img_url[0]:''" mode="aspectFill" />
            </p>
            <h2>{{item.ArticleTitle}}</h2>
            <span>{{item.ReleaseTime}}</span>
          </a>
        </li>
      </ul>
      <div class="not-data" v-if="activityListData.length==0">暂无数据</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      check: 1,
      activityNavData: [],
      activityListData: [],
      dates: "",
      pageNum: 1,
      isGet: true
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
      vm.getList(vm.dates, vm.pageNum);
    }
  },
  onLoad() {
    let vm = this;
    mpvue.showLoading({
      title: "加載中"
    });
    mpvue.request({
      url: `${this.$api}/article/activityDateList`,
      success: function(res) {
        if (res.statusCode == 200) {
          vm.activityNavData = [];
         
          let datas = res.data.data;
          for (let item in datas) {
            let _data = [{ title: item }];
             console.log(datas[item]);
            datas[item].forEach(value => {
              _data.push({
                month: value + "月",
                date: `${item}-${value}`
              });
            });
            vm.activityNavData = [..._data,...vm.activityNavData];
          }
          vm.getList(vm.activityNavData[1].date, 1);
         
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
  methods: {
    activityNavClick(item, index) {
      if (item.month) {
        this.check = index;
        this.isGet = true;
        this.pageNum = 1;
        this.getList(item.date, 1);
      }
    },
    getList(date, page) {
      let vm = this;
      vm.dates = date;
      vm.isGet = false;
      mpvue.request({
        url: `${
          this.$api
        }/article/activityNewsList?date=${date}&page=${page}&limit=10`,
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            vm.isGet = true;
            let datas = res.data.data;
            if (page == 1) {
              vm.activityListData = [];
            }
            for (let item in datas) {
              datas[item].img_url = datas[item].img_url.map(value => {
                return vm.$imgHost + value.replace(/\\/g, "/");
              });
              if (datas[item].ReleaseTime) {
                let _arr = datas[item].ReleaseTime.split(" ");
                let _arrs = _arr[1].split(":");
                datas[item].ReleaseTime = `${_arr[0]} ${_arrs[0]}:${_arrs[1]}`;
              }
              vm.activityListData.push(datas[item]);
            }
            if (datas.length == 0 && page > 1) {
              vm.isGet = false;
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            } else if(datas.length == 0 && page==1){
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
  }
};
</script>
<style lang="less" scoped>
.activity {
  div.l {
    width: 180rpx;
    height: 100vh;
    float: left;
    overflow-y: auto;
    background-color: #f8f8f8;
    ul {
      li {
        line-height: 120rpx;
        height: 120rpx;
        text-align: center;
        &.on {
          background-color: white;
          position: relative;
          &::before {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 10rpx;
            height: 40rpx;
            background: rgba(0, 169, 128, 1);
            content: "";
          }
        }
        h2 {
          font-size: 30rpx;
          font-weight: 600;
          color: rgba(0, 169, 128, 1);
        }
        p {
          font-size: 28rpx;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
  div.r {
    float: right;
    height: 100vh;
    overflow-y: auto;
    width: calc(~"100% - 180rpx");
    ul {
      li {
        margin: 30rpx 24rpx;
        p {
          width: 521rpx;
          height: 230rpx;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 8rpx;
          img {
            width: 100%;
            height: 100%;
          }
        }
        h2 {
          font-size: 28rpx;
          line-height: 40rpx;
          letter-spacing: 1rpx;
          margin-top: 15rpx;
        }
        span {
          display: block;
          margin-top: 5rpx;
          font-size: 24rpx;
          color: rgba(153, 153, 153, 1);
          line-height: 33rpx;
          letter-spacing: 1rpx;
        }
      }
    }
  }
}
</style>