<template>
  <div class="health-list">
    <ul v-show="healthData.length>0">
      <li v-for="(item,index) in healthData" :key="index">
        <a :href="'../healthDetails/main?id='+item.ArticleID">
          <template v-if="item.imglist.length>1">
            <h2 class="line">{{item.ArticleTitle}}</h2>
            <div class="img-list">
              <p v-for="(items,i) in item.imglist" :key="i">
                <img :src="items" mode="aspectFill" />
              </p>
            </div>
            <p class="flow">
              <span>{{item.ReleaseTime}}</span>
              <span>{{item.ClickAmount || 0}} 次瀏覽</span>
            </p>
          </template>
          <template v-if="item.imglist.length == 1">
            <div class="desc">
              <h2 class="lines">{{item.ArticleTitle}}</h2>
              <p>
                <span>{{item.ReleaseTime}}</span>
                <span>{{item.ClickAmount || 0}} 次瀏覽</span>
              </p>
            </div>
            <p class="p-img">
              <img :src="item.imglist[0]" mode="aspectFill" />
            </p>
          </template>
        </a>
      </li>
    </ul>
    <div class="not-data" v-if="healthData.length==0">暂无数据</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ids: "",
      types: "",
      pageNum: 1,
      healthData: [],
      isGet: true
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var vm = this;
    if (vm.isGet) {
      vm.pageNum++;
      mpvue.showLoading({
        title: "正在加載數據"
      });
      if (this.types != "") {
        vm.getList(vm.pageNum);
      } else {
        vm.getLists(vm.pageNum);
      }
    }
  },
  methods: {
    getList(page, isRefresh) {
      let vm = this;
      vm.isGet = false;
      mpvue.request({
        url: `${this.$api}/article/newsList?${
          this.types
        }=1&page=${page}&limit=10`,
        success: function(res) {
          mpvue.hideLoading();
          if (isRefresh) {
            wx.stopPullDownRefresh();
            mpvue.showToast({
              title: "刷新成功",
              icon: "success",
              duration: 2000
            });
          }
          if (res.statusCode == 200) {
            vm.isGet = true;
            var datas = res.data.data;
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
            if (datas.length == 0 && page > 1) {
              vm.isGet = false;
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            } else if (datas.length == 0 && page == 1) {
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
    },
    getLists(page, isRefresh) {
      let vm = this;
      vm.isGet = false;
      mpvue.request({
        url: `${this.$api}/article/newsList?cid=${
          this.ids
        }&page=${page}&limit=10`,
        success: function(res) {
          mpvue.hideLoading();
          if (isRefresh) {
            wx.stopPullDownRefresh();
            mpvue.showToast({
              title: "刷新成功",
              icon: "success",
              duration: 2000
            });
          }
          if (res.statusCode == 200) {
            var datas = res.data.data;
            vm.isGet = true;
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
            if (datas.length == 0 && page > 1) {
              vm.isGet = false;
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            } else if (datas.length == 0 && page == 1) {
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
  onPullDownRefresh: function() {
    this.pageNum = 1;
    this.healthData = [];
    if (this.ids != undefined) {
      this.getLists(1, true);
    } else {
      this.getList(1, true);
    }
  },
  onLoad(o) {
    mpvue.showLoading({
      title: "加載中"
    });
    this.pageNum = 1;
    this.healthData = [];
    if (o.id != undefined) {
      this.ids = o.id;
      this.getLists(1);
    } else {
      this.types = o.type;
      this.getList(1);
    }

    mpvue.setNavigationBarTitle({
      title: o.name
    });
  }
};
</script>
<style lang="less" scoped>
.health-list {
  ul {
    li {
      a {
        display: block;
        overflow: hidden;
        padding: 42rpx 0 30rpx;
        margin: 0 32rpx;
        border-bottom: 1px solid #eeeeee;
        & > h2 {
          font-size: 30rpx;
          font-weight: 600;
          line-height: 42rpx;
        }
        .img-list {
          margin-top: 24rpx;
          overflow: hidden;
          p {
            width: 31.33%;
            float: left;
            margin: 1%;
            height: 118rpx;
            img {
              height: 100%;
            }
          }
        }
        & > p.flow {
          margin-top: 14rpx;
          font-size: 24rpx;
          color: rgba(153, 153, 153, 1);
          line-height: 33rpx;
          span {
            margin-right: 40rpx;
          }
        }
        .desc {
          width: calc(~"100% - 248rpx");
          float: left;
          h2 {
            font-size: 30rpx;
            font-weight: 600;
            line-height: 42rpx;
            height: 84rpx;
          }
          p {
            margin-top: 30rpx;
            font-size: 24rpx;
            color: rgba(153, 153, 153, 1);
            line-height: 33rpx;
            span {
              margin-right: 40rpx;
            }
          }
        }
        .p-img {
          width: 218rpx;
          height: 156rpx;
          float: right;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>