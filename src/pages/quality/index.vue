<template>
  <div class="quality">
    <div class="title">
      <scroll-view :scroll-x="true">
        <ul :style="maxw!=0?'width:'+maxw+'px;':''">
          <li :class="'tag-li ' +(qualityTagIndex == '0'?'on':'')" @click="qualityNav(0)">優質認證商品</li>
          <li
            :class="'tag-li ' +(qualityTagIndex == index+1?'on':'')"
            v-for="(item,index) in authClassfy"
            :key="index"
            @click="qualityNav(index+1,item.ArticleID)"
          >
            {{item.ButtonName}}
            <img :src="item.img_url[0]" mode="widthFix" alt />
          </li>
        </ul>
      </scroll-view>
    </div>
    <div class="quality-main" v-if="qualityTagIndex == '0'">
      <div class="l">
        <ul>
          <li
            v-for="(item,index) in qualityNavData"
            @click="qualityNavClick(index,item.id)"
            :class="qualityNavIndex == index?'on':''"
            :key="index"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="r">
        <ul v-if="qualityData.length>0">
          <li v-for="(item,index) in qualityData" :key="index">
            <a :href="'../productDetails/main?title='+item.Id">
              <p>
                <img :src="item.img_url" mode="aspectFill" alt />
              </p>
              <div>
                <h2 class="line">{{item.Drugs_name}}</h2>
                <p class="lines">{{item.Drugs_synopsis}}</p>
                <div class="label">
                  <span v-for="(items,i) in item.labels" :key="i">{{items}}</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
        <div class="not-data" v-if="qualityData.length==0">暂无数据</div>
      </div>
    </div>
    <div class="quality-m" v-if="qualityTagIndex != '0'">
      <h2>{{authDetail.ArticleTitle}}</h2>
      <img :src="authDetail.img_url[0]" mode="widthFix" alt />
      <div class="quality-list">
        <wxParse v-if="authDetail.ArticleDesc" :content="authDetail.ArticleDesc" />
      </div>
      <div class="quality-list">
        <wxParse v-if="authDetail.ArticleContent" :content="authDetail.ArticleContent" />
      </div>
    </div>
  </div>
</template>
<script>
import wxParse from "mpvue-wxparse";
export default {
  components: {
    wxParse
  },
  data() {
    return {
      maxw: 0,
      pageNum: 1,
      qualityTagIndex: 0,
      qualityNavIndex: 0,
      authDetail: {img_url:[]},
      qualityData: [],
      qualityNavData: [],
      authClassfy: []
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
      vm.getDrug();
    }
  },
  methods: {
    getDrug() {
      let vm = this;
      vm.isGet = false;
      mpvue.request({
        url: `${this.$api}/drug/authDrugs`,
        data: {
          cid: vm.cid,
          page: vm.pageNum,
          limit: 10
        },
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            var datas = res.data.data;
            vm.qualityData = [...vm.qualityData, ...datas];
            if (datas.length == 0) {
              vm.isGet = false;
              if (vm.pageNum > 1) {
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
    },
    qualityNav(i, id) {
      this.qualityTagIndex = i;
      if (i != 0) {
        let vm = this;
        mpvue.showLoading({
          title: "请稍后"
        });
        mpvue.request({
          url: `${this.$api}/article/authDetail?id=${id}`,
          success: function(res) {
            mpvue.hideLoading();
            if (res.statusCode == 200) {
              res.data.data.img_url = res.data.data.img_url.map(value => {
                return vm.$imgHost + value.replace(/\\/g, "/");
              });
              vm.authDetail = res.data.data;
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
        mpvue.showLoading({
          title: "请稍后"
        });
        this.qualityNavIndex = 0;
        this.cid = this.qualityNavData[0].id;
        this.pageNum = 1;
        this.qualityData = [];
        this.getDrug();
      }
    },
    qualityNavClick(i, id) {
      this.qualityNavIndex = i;
      mpvue.showLoading({
        title: "请稍后"
      });
      this.cid = id;
      this.pageNum = 1;
      this.qualityData = [];
      this.getDrug();
    }
  },
  mounted() {
    let vm = this;
    let _query = wx.createSelectorQuery();
    this.pageNum = 1;
    this.qualityData = [];
    mpvue.showLoading({
      title: "请稍后"
    });
    mpvue.request({
      url: `${this.$api}/article/authClassfy`,
      success: function(res) {
        if (res.statusCode == 200) {
          var datas = res.data.data;
          for (let item in datas) {
            datas[item].img_url = datas[item].img_url.map(value => {
              return vm.$imgHost + value.replace(/\\/g, "/");
            });
            vm.authClassfy.push(datas[item]);
          }
          setTimeout(_ => {
            _query.selectAll(".tag-li").boundingClientRect();
            _query.exec(res => {
              res[0].forEach(value => {
                vm.maxw += value.width;
                console.log(vm.maxw);
              });
            });
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
    mpvue.request({
      url: `${this.$api}/drug/drugClassfyList`,
      success: function(res) {
        if (res.statusCode == 200) {
          var datas = res.data.data;
          vm.qualityNavData=datas;
          vm.cid = vm.qualityNavData[0].id;
          vm.getDrug();
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
  }
};
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.quality {
  .title {
    height: 88rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 0px 0px rgba(231, 231, 231, 1);
    border-bottom: 1px solid #e7e7e7;
    ul {
      height: 88rpx;
      li {
        width: 33vw;
        float: left;
        text-align: center;
        line-height: 88rpx;
        position: relative;
        &.on {
          color: #00a980;
          &::before {
            position: absolute;
            bottom: 0;
            left: 20%;
            width: 60%;
            content: "";
            display: block;
            border-bottom: 4rpx solid #00a980;
          }
        }
        img {
          width: 39rpx;
          height: 39rpx;
          display: inline-block;
          margin-left: 8rpx;
          vertical-align: middle;
        }
      }
    }
  }
  .quality-main {
    height: calc(~"100vh - 88rpx");
    overflow: hidden;
    div.l {
      height: 100%;
      overflow-y: auto;
      width: 220rpx;
      float: left;
      background-color: #f8f8f8;
      ul {
        li {
          height: 120rpx;
          position: relative;
          line-height: 120rpx;
          text-align: center;
          &.on {
            background: rgba(255, 255, 255, 1);
            &::before {
              width: 10rpx;
              height: 40rpx;
              display: block;
              background: rgba(0, 169, 128, 1);
              content: "";
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }
    }
    div.r {
      height: 100%;
      overflow-y: auto;
      ul {
        li {
          margin: 30rpx;
          height: 210rpx;
          background-color: #f8f8f8;
          a {
            display: block;
            overflow: hidden;
            padding: 20rpx 20rpx;
            height: calc(~"100% - 40rpx");
            & > p {
              width: 140rpx;
              height: 140rpx;
              float: left;
              overflow: hidden;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
              img {
                width: 100%;
                height: 100%;
              }
            }
            & > div {
              margin-left: 160rpx;
              h2 {
                font-size: 28rpx;
                color: rgba(0, 0, 0, 1);
                line-height: 45rpx;
                font-weight: 600;
              }
              p {
                font-size: 24rpx;
                color: rgba(85, 85, 85, 1);
                line-height: 33rpx;
                margin-top: 8rpx;
              }
              .label {
                margin-top: 20rpx;
                overflow: hidden;
                height: 30rpx;
                span {
                  background: rgba(203, 130, 203, 1);
                  border-radius: 4rpx;
                  display: block;
                  float: left;
                  padding: 0 8rpx;
                  font-size: 20rpx;
                  height: 30rpx;
                  color: rgba(255, 255, 255, 1);
                  line-height: 30rpx;
                  margin: 0 5rpx;
                }
              }
            }
          }
        }
      }
    }
  }
  .quality-m {
    padding: 40px 30px;
    & > h2 {
      font-size: 36rpx;
      font-weight: 600;
      color: rgba(0, 169, 128, 1);
      line-height: 50rpx;
      letter-spacing: 2rpx;
      text-align: center;
    }
    & > img {
      width: 218rpx;
      margin: 0 auto;
      display: block;
      margin-top: 30px;
    }
    .quality-list {
      background: rgba(247, 247, 247, 1);
      padding: 48rpx 32rpx;
      margin-top: 20px;
      div.list {
        margin-top: 40rpx;
        &:first-child {
          margin-top: 0;
        }
        h2 {
          font-size: 36rpx;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          line-height: 50rpx;
          letter-spacing: 2rpx;
        }
        div {
          margin-top: 10rpx;
          font-size: 28rpx;
          color: rgba(51, 51, 51, 1);
          line-height: 40rpx;
          letter-spacing: 1rpx;
          b {
            font-weight: 600;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>