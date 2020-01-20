<template>
  <div class="my-collect">
    <div class="tag">
      <ul>
        <li
          v-for="(item,index) in tagData"
          :key="index"
          :class="tagCheck==index?'on':''"
          @click="tagClick(index)"
        >
          <i :class="'iconfont '+item.icon"></i>
          {{item.title}}
        </li>
      </ul>
    </div>
    <div class="tag-h"></div>
    <div class="article-list" v-if="tagCheck == 0">
      <ul v-if="articleData.length>0">
        <li v-for="(item,index) in articleData" :key="index">
          <a :href="'../productDetails/main?title='+item.Drugs_id">
            <p>
              <img :src="item.img_url || 'https://health.mhcamo.com/upload/detail/detail_default.jpg'" mode="aspectFill" alt />
            </p>
            <h2 class="line">{{item.Drugs_name}}</h2>
            <div class="lines">{{item.Function}}</div>
          </a>
        </li>
      </ul>
      <div class="not-data" v-if="articleData.length==0">暂无数据</div>
    </div>
    <div class="new-list" v-if="tagCheck == 1">
      <ul v-if="newData.length>0">
        <li v-for="(item,index) in newData" :key="index">
          <a
            :href="'../'+(item.NavCode=='news'?'healthDetails':'activityDetails')+'/main?id='+item.ArticleID"
          >
            <div>
              <h2 class="lines">{{item.ArticleTitle}}</h2>
              <span>{{item.ReleaseTime || ''}}</span>
            </div>
            <p>
              <img :src="item.imgs.length>0?item.imgs[0].f_path:''" mode="aspectFill" alt />
            </p>
          </a>
        </li>
      </ul>
      <div class="not-data" v-if="newData.length==0">暂无数据</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tagCheck: 0,
      isGet: true,
      pageNum: 1,
      tagData: [
        { title: "商品收藏", icon: "icon-shoucang-copy" },
        { title: "文章收藏", icon: "icon-collect" }
      ],
      articleData: [],
      newData: []
    };
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var vm = this;
    if (vm.isGet) {
      vm.pageNum++;
      mpvue.showLoading({
        title: "正在加載數據"
      });
      if (vm.tagCheck == 1) {
        vm.getNews();
      } else {
        vm.getArticle();
      }
    }
  },
  onShow() {
    mpvue.showLoading({
      title: "请稍后"
    });
    this.isGet = true;
    this.pageNum = 1;
    this.articleData = [];
    this.newData = [];
    if (this.tagCheck == 1) {
      this.getNews();
    } else {
      this.getArticle();
    }
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
    tagClick(i) {
      this.tagCheck = i;
      this.isGet = true;
      this.pageNum = 1;
      this.articleData = [];
      this.newData = [];
      mpvue.showLoading({
        title: "请稍后"
      });
      if (i == 1) {
        this.getNews();
      } else {
        this.getArticle();
      }
    },
    getArticle() {
      let vm = this;
      vm.isGet = false;
      mpvue.request({
        url: `${this.$api}/member/favoriteDrugList`,
        method: "POST",
        data: {
          loginkey: mpvue.getStorageSync("sessionId"),
          page: vm.pageNum,
          limit: 10
        },
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            vm.isGet = true;
            let datas = res.data.data;
            let _i = 0;
            for (let item in datas) {
              vm.articleData.push(datas[item]);
              _i++;
            }
            if (_i == 0 && vm.pageNum > 1) {
              vm.isGet = false;
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            } else {
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
    getNews() {
      let vm = this;
      vm.isGet = false;
      mpvue.request({
        url: `${this.$api}/member/favoriteArticleList`,
        method: "POST",
        data: {
          loginkey: mpvue.getStorageSync("sessionId"),
          page: vm.pageNum,
          limit: 10
        },
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            vm.isGet = true;
            res.data.data = res.data.data.map(value => {
              if (value.imgs) {
                value.imgs = value.imgs.map(value2 => {
                  value2.f_path =
                    vm.$imgHost + value2.f_path.replace(/\\/g, "/");
                  return value2;
                });
              }
              if (value.ReleaseTime) {
                let _arr = value.ReleaseTime.split(" ");
                let _arrs = _arr[1].split(":");
                value.ReleaseTime = `${_arr[0]} ${_arrs[0]}:${_arrs[1]}`;
              }
              return value;
            });
            vm.newData = [...vm.newData, ...res.data.data];
            if (res.data.data.length == 0 && vm.pageNum > 1) {
              vm.isGet = false;
              mpvue.showToast({
                title: "已加載全部數據",
                icon: "none",
                duration: 2000
              });
            } else {
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
.my-collect {
  min-height: 100vh;
  background-color: #f7f7f7;
  div.tag {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 88rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 0px 0px rgba(231, 231, 231, 1);
    ul {
      li {
        width: 50%;
        float: left;
        text-align: center;
        line-height: 88rpx;
        font-size: 28rpx;
        letter-spacing: 2rpx;
        position: relative;
        &.on {
          color: #00a980;
          &::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 91rpx;
            height: 4rpx;
            background: rgba(0, 169, 128, 1);
          }
        }
        i {
          display: inline-block;
          font-size: 28rpx;
        }
      }
    }
  }
  .tag-h {
    height: 88rpx;
  }
  div.article-list {
    overflow: hidden;
    ul {
      width: 96%;
      margin: 0 auto;
      padding: 2% 0;
      li {
        width: 46%;
        margin: 2%;
        padding: 17rpx 22rpx 30rpx;
        float: left;
        background-color: white;
        border-radius: 8rpx;
        p {
          width: 174rpx;
          height: 174rpx;
          margin: 0 auto;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        h2 {
          font-size: 30rpx;
          line-height: 42rpx;
          margin-top: 29rpx;
        }
        div {
          margin-top: 16rpx;
          font-size: 22rpx;
          line-height: 30rpx;
          color: #666666;
        }
      }
    }
  }
  div.new-list {
    ul {
      li {
        background-color: white;
        a {
          display: block;
          overflow: hidden;
          padding: 37rpx 32rpx;
          border-bottom: 1px solid #eeeeee;
          div {
            float: left;
            width: calc(~"100% - 258rpx");
            h2 {
              font-size: 30rpx;
              font-weight: 600;
              line-height: 42rpx;
            }
            span {
              font-size: 24rpx;
              color: rgba(153, 153, 153, 1);
              line-height: 33rpx;
              display: block;
              margin-top: 33rpx;
            }
          }
          p {
            width: 218rpx;
            height: 156rpx;
            float: right;
            img {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>