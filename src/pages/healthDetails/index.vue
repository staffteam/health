<template>
  <div class="health-details">
    <div class="title">
      <h2>{{details.ArticleTitle}}</h2>
      <div>
        <p>{{details.Author}}&nbsp;&nbsp;&nbsp;{{details.ReleaseTime}}</p>
        <div>
          <p class="c" @click="IsFavorite()">
            <i :class="'iconfont '+(!details.IsFavorite?'icon-wuxiaoxing-kong':'icon-shoucang2')"></i>
          </p>
          <p class="s">
            <button open-type="share"></button>
            <i class="iconfont icon-fenxiang"></i>
          </p>
        </div>
      </div>
    </div>
    <div class="content" v-show="details.ArticleContent!=null">
      <wxParse :content="details.ArticleContent" @preview="preview" @navigate="navigate" />
    </div>
    <div class="about">
      <div class="title">相關資訊</div>
      <div class="list">
        <ul>
          <li v-for="(item,index) in healthData" :key="index">
            <div @click="healthClick(item)">
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
            </div>
          </li>
        </ul>
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
      collect: false,
      details: {},
      ids: "",
      healthData: []
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
  onLoad(o) {
    let vm = this;
    this.ids = o.id;
    mpvue.showLoading({
      title: "加載中"
    });
    mpvue.request({
      url: `${this.$api}/article/articleDetail`,
      data: {
        id: o.id,
        loginkey: mpvue.getStorageSync("sessionId")
      },
      success: function(res) {
        mpvue.hideLoading();
        if (res.statusCode == 200) {
          vm.details = res.data.data;
          let datas = vm.details.Recommends;
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
  methods: {
    IsFavorite() {
      let vm = this;
      mpvue.showLoading({
        title: "请稍后"
      });
      if (this.details.IsFavorite) {
        mpvue.request({
          url: `${this.$api}/member/favoriteDelete`,
          method: "POST",
          data: {
            id: vm.details.ArticleID,
            code:'news',
            loginkey: mpvue.getStorageSync("sessionId"),
          },
          success: function(res) {
            mpvue.hideLoading();
            if (res.statusCode == 200) {
              vm.details.IsFavorite = false;
              mpvue.showToast({
                title: "已取消收藏",
                icon: "success",
                time: "2000"
              });
            } else {
              mpvue.showToast({
                title: "網絡發生異常！",
                icon: "none",
                time: "2000"
              });
            }
          }
        });
      }else{
        mpvue.request({
          url: `${this.$api}/member/favoriteAdd`,
          method: "POST",
          data: {
            source_id: vm.details.ArticleID,
            loginkey: mpvue.getStorageSync("sessionId"),
            source_code:'news'
          },
          success: function(res) {
            mpvue.hideLoading();
            if (res.statusCode == 200) {
              vm.details.IsFavorite = true;
              mpvue.showToast({
                title: "已收藏",
                icon: "success",
                time: "2000"
              });
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
    healthClick(item) {
      mpvue.redirectTo({ url: "../healthDetails/main?id=" + item.ArticleID });
    },
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    }
  }
};
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.health-details {
  padding: 27rpx 32rpx;
  div.title {
    h2 {
      font-size: 44rpx;
      font-weight: 600;
      line-height: 62rpx;
    }
    div {
      overflow: hidden;
      margin-top: 20rpx;
      p {
        font-size: 26rpx;
        color: rgba(102, 102, 102, 1);
        line-height: 37rpx;
        float: left;
      }
      & > div {
        float: right;
        margin-top: 0;
        p.s {
          position: relative;
          font-size: 33rpx;
          display: inline-block;
          color: #999999;
          button {
            margin-top: 0;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9;
          }
        }
        p.c {
          display: inline-block;
          margin-right: 30rpx;
          i.icon-wuxiaoxing-kong {
            color: #333333;
          }
          i.icon-shoucang2 {
            color: #00a980;
          }
        }
      }
    }
  }
  div.content {
    padding: 20rpx 0;
  }
  .about {
    margin-top: 50rpx;
    div.title {
      border-left: 12rpx solid #00a980;
      padding-left: 16rpx;
      font-size: 32rpx;
      font-weight: 600;
      line-height: 45rpx;
    }
    div.list {
      margin-top: 32rpx;
      ul {
        li {
          padding: 37rpx 0;
          overflow: hidden;
          border-top: 1px solid #eeeeee;
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
}
</style>