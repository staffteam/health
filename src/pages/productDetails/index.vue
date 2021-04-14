<template>
  <div>
    <!-- 标题索引 -->
    <div class="animation" :style="'right:'+(show?'0':'-100vw')">
      <div @click="cancel" class="backs"></div>
      <div class="animation-content" :style="'right:'+(shows?'0':'-55%')">
        <div class="pricezone">
          <div
            class="textview"
            v-for="(item,index) in theindex"
            :key="index"
            @click="choiceWordindex"
            :data-id="item.id"
          >{{item.name}}</div>
        </div>
      </div>
    </div>

    <scroll-view
      class="scrollDetails"
      scroll-y="true"
      :scroll-into-view="toView"
      :enable-back-to-top="true"
    >
      <!-- 轮播图 -->
      <div id="image">
        <swiper
          class="swiper-slass"
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval1"
          :duration="duration"
          @click="bindtap"
          @change="bindchange"
          :circular="true"
        >
          <div v-for="(item,index) in pictureList" :key="index">
            <swiper-item>
              <img :src="item.pictureUrl" class="slide-image" mode="aspectFill" />
            </swiper-item>
          </div>
        </swiper>
      </div>

      <div class="example">
        <div class="marquee_box">
          <div
            class="marquee_text"
            :style="orientation+':'+marqueeDistance+'px;font-size:'+size+'px;'"
          >{{text}}</div>
        </div>
      </div>

      <!-- 浏览数及名字 -->
      <div class="hview">
        <div class="number">
          <div class="pricetext">市場價格:{{price}}</div>
          <div class="r">
            <p class="c" @click="IsFavorite()">
              <i :class="'iconfont '+(!isFavorite?'icon-wuxiaoxing-kong':'icon-shoucang2')"></i>
            </p>
            <div class="f">
              <div class="text">{{browseNum}}</div>
              <img class="browse_image" mode="widthFix" src="/static/images/liulan.png" />
            </div>
          </div>
        </div>
        <div class="productName">
          <div class="chinese_name">{{drugName}}</div>
          <div class="english_name">外文名：{{englishName}}</div>
        </div>
      </div>

      <!-- 词条认领 -->
      <div v-if="chargeStatus==2" class="entry_to_claim entry_to_claim_true">
        <div class="company_image_view">
          <img class="company_image" mode="aspectFit" :src="companyLogo" />
        </div>

        <div class="company_view company_view_true">{{companyClaimed}}</div>
      </div>

      <div v-if="chargeStatus==1" class="entry_to_claim entry_to_claim_false">
        <div class="company_image_view">
          <img class="company_image" mode="aspectFit" :src="companyLogo" />
        </div>

        <div class="company_view company_view_false">{{companyClaimed}}</div>
      </div>

      <!-- 产品简介 -->
      <div class="Introduction">
        <div class="Introduction_text">{{introduction}}</div>
      </div>

      <!-- 產品認證  -->
      <div v-if="hasCertification==1" id="B" class="product_certification">
        <div class="title_view">
          <div class="mark_view_to"></div>
          <div class="title_text_to">產品認證</div>
        </div>
        <div class="certification_image">
          <div class="certification_image_view" style="flex-direction:row;">
            <div v-for="(item,index) in certifications" :key="index">
              <div
                :class="'certification-info '+(item.checked?'checked_animation':'')"
                :data-id="item.id"
                @click="classificationTap"
              >
                <img :src="item" class="item_image" mode="aspectFit" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他产品 -->
      <div id="A" class="otherProducts">
        <div class="title_view">
          <div class="mark_view"></div>
          <div class="title_text">可能您還關注</div>
        </div>

        <div class="productContent">
          <div class="product_image_view" style="flex-direction:row;">
            <div v-for="(item,index) in recommendedProducts" :key="index">
              <div
                :class="'product-info '+(item.checked?'checked_animation':'')"
                :data-id="item"
                @click="detailsTap"
              >
                <img :src="item.drugImagePath" class="product_item_image" mode="aspectFit" />
                <div>
                  <div class="product_name_text">{{item.drugsName}}</div>
                </div>
                <div>
                  <div class="product_price_text">
                    <div class="price_yuan"></div>
                    {{item.priceName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HTML 自定义设置 -->
      <div v-for="(item,index) in htmldata" :key="index">
        <div :id="'html'+index" class="wxParses">
          <wxParse :content="item.contentDetails" />
        </div>
      </div>

      <!-- 同品牌产品 -->
      <div id="G" class="product_brand">
        <div class="title_view">
          <div class="mark_view"></div>
          <div class="title_text">同品牌其它詞條</div>
        </div>
        <div class="brand_view">
          <div class="product_image_view" style="flex-direction:row;">
            <div v-for="(item,index) in brandProducts" :key="index">
              <div
                :class="'product-info '+(item.checked?'checked_animation':'')"
                :data-id="item"
                @click="detailsTap"
              >
                <img :src="item.drugImagePath" class="product_item_image" mode="aspectFit" />
                <div>
                  <div class="product_name_text">{{item.drugsName}}</div>
                </div>
                <div>
                  <div class="product_price_text">
                    <div class="price_yuan"></div>
                    {{item.priceName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div id="H" class="product_tag">
        <div class="title_view">
          <div class="mark_view"></div>
          <div class="title_text">標籤</div>
        </div>
        <div class="tag_view">
          <div class="parameterwrap" style="flex-direction:row;">
            <div v-for="(item,index) in tagList" :key="index">
              <div
                :class="'tag-info '+(item.checked?'checked_animation':'')"
                :data-id="item.id"
                @click="classificationTap"
              >
                <div class="screeningtext text-over">{{item.drugslabel}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="index">
      <button class="cancel-butt" @click="directory" type="primary" style="opacity:0.7;font:5px">目錄</button>
      <button class="determine-butt" @click="atTheTop" type="primary" style="opacity:0.7">置頂</button>
      <button class="determine-butt" @click="scClick" type="primary" style="opacity:0.7">商城</button>
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
      isFavorite: false,
      htmldata: [], //编辑器数据 HTML
      certifications: [], //认证图
      descriptions: [],
      theindex: [], //索引更新
      toView: "image", //当前显示
      messagedata: [],
      shownavindex: "",
      imgUrls: [],
      indicatorDots: true,
      autoplay: true,
      interval1: 5000,
      duration: 1000,
      chargeStatus: 1, //是否付费  1.未付费  2。已付费
      companyClaimed: "本詞條暫未被任何公司認領！",
      hasCertification: 0, //是否显示认证图
      //中文名字
      drugName: "",
      //英文名字
      englishName: "",
      //浏览次数
      browseNum: "0",
      //市场价格
      price: "0",
      //认领公司名字
      claimCompany: "",
      //认领公司 logo
      companyLogo: "",
      //简介
      introduction: "",
      //推荐产品
      recommendedProducts: [],
      //同品牌产品
      brandProducts: [],
      //轮播图
      pictureList: [],
      //其他设置属性
      htmlList: "其他设置属性",
      //标签
      tagList: [],

      text:
        "百科的詞條(含所附圖片)系由網友上傳及編輯,內容只作參考,敬請請以產品官方說明書為準.如果涉嫌侵權,請與客服聯繫,我們將會盡快處理.",
      marqueePace: 5, //滚动速度
      marqueeDistance: 0, //初始滚动距离
      marqueeDistance2: 0,
      marquee2copy_status: false,
      marquee2_margin: 60,
      size: 13,
      orientation: "left", //滚动方向
      interval: 200, // 时间间隔
      show: false,
      shows: false,
      ids: ""
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.title);
    this.ids = options.title;
    this.getdata(options.title);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation({
      //创建动画
      duration: 1000,
      timingFunction: "ease",
      width: 300,
      height: 800,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: "#fff",
      opcity: 0.5
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var vm = this;
    var length = vm.text.length * vm.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    vm.length = length;
    vm.windowWidth = windowWidth;
    vm.marquee2_margin =
      length < windowWidth ? windowWidth - length : vm.marquee2_margin; //当文字长度小于屏幕长度时，需要增加补白
    vm.run1();
  },
  methods: {
    IsFavorite() {
      let vm = this;
      mpvue.showLoading({
        title: "请稍后"
      });
      if (this.isFavorite) {
        mpvue.request({
          url: `${this.$api}/member/favoriteDelete`,
          method: "POST",
          data: {
            id: vm.ids,
            code: "drug",
            loginkey: mpvue.getStorageSync("sessionId")
          },
          success: function(res) {
            mpvue.hideLoading();
            if (res.statusCode == 200) {
              vm.isFavorite = false;
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
      } else {
        mpvue.request({
          url: `${this.$api}/member/favoriteAdd`,
          method: "POST",
          data: {
            source_id: vm.ids,
            loginkey: mpvue.getStorageSync("sessionId"),
            source_code: "drug"
          },
          success: function(res) {
            mpvue.hideLoading();
            if (res.statusCode == 200) {
              vm.isFavorite = true;
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
    run1: function() {
      var vm = this;
      var interval = setInterval(function() {
        if (-vm.marqueeDistance < vm.length - 60) {
          vm.marqueeDistance = vm.marqueeDistance - vm.marqueePace;
          clearInterval(interval);
          vm.run1();
        } else {
          clearInterval(interval);
          vm.marqueeDistance = vm.windowWidth;
          vm.run1();
        }
      }, vm.interval);
    },

    run2: function() {
      var vm = this;
      var interval = setInterval(function() {
        if (-vm.marqueeDistance2 < vm.length) {
          // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
          vm.marqueeDistance2 = vm.marqueeDistance2 - vm.marqueePace;
          marquee2copy_status =
            vm.length + vm.marqueeDistance2 <=
            vm.windowWidth + vm.marquee2_margin;
        } else {
          if (-vm.marqueeDistance2 >= vm.marquee2_margin) {
            // 当第二条文字滚动到最左边时
            vm.marqueeDistance2 = vm.marquee2_margin; // 直接重新滚动;
            clearInterval(interval);
            vm.run2();
          } else {
            clearInterval(interval);
            vm.marqueeDistance2 = -vm.windowWidth;
            vm.run2();
          }
        }
      }, vm.interval);
    },

    choiceWordindex: function(e) {
      //索引
      let wordindex = e.mp.target.dataset.id;
      this.toView = wordindex;
      this.shownavindex = "";
      this.cancel();
      console.log(this.toView);
    },

    directory: function(e) {
      //点击目录事件
      this.show = true;
      setTimeout(_ => {
        this.shows = true;
      }, 50);
      this.hidden = "hidden";
      this.table = "table-hidden";
    },

    cancel: function(e) {
      //取消目录事件
      this.shows = false;
      setTimeout(_ => {
        this.show = false;
      }, 200);
      this.hidden = "auto";
      this.table = "table-show";
    },

    atTheTop: function(e) {
      //置顶
      this.toView = "image";
      setTimeout(_ => {
        this.toView = "";
      }, 100);
    },

    detailsTap: function(e) {
      //点击其他产品刷新数据
      console.log("携带数据为：", e.mp.currentTarget.dataset.id.id);
      this.getdata(e.mp.currentTarget.dataset.id.id);
      this.atTheTop();
    },
    scClick() {
      // mpvue.showToast({
      //   title: "商城敬請期待···",
      //   icon: "none",
      //   duration: 2000
      // });
      mpvue.navigateTo({url:'../store/main'})
    },
    getdata: function(id) {
      mpvue.showLoading({
        title: "正在加载"
      });
      var that = this;
      wx.request({
        url: this.config.service.goodsDetail,
        data: {
          args: {
            productId: id
          }
        },
        success: function(res) {
          if (res.data.Code != "200") {
            mpvue.showToast({
              title: res.data.Message,
              icon: "none",
              time: 2000
            });
            setTimeout(_ => {
              mpvue.navigateBack({
                delta: 1
              });
            }, 1000);
            return false;
          }
          console.log("success", res.data.Data);
          mpvue.request({
            url: `${that.$api}/member/isFavorite`,
            method: "POST",
            data: {
              loginkey: mpvue.getStorageSync("sessionId"),
              source_id: res.data.Data.drugId,
              source_code: "drug"
            },
            success: function(data) {
              if (data.statusCode == 200) {
                that.isFavorite = data.data.data;
              } else {
                mpvue.showToast({
                  title: "網絡發生異常！",
                  icon: "none",
                  time: "2000"
                });
              }
            }
          });
          var arr2 = [];
          var arr3 = [];
          if (res.data.Data.recommendedProducts.length > 3) {
            for (var i = 0; i < 3; i++) {
              arr2.push(res.data.Data.recommendedProducts[i]);
            }
          } else {
            arr2 = res.data.Data.recommendedProducts;
          }

          if (res.data.Data.brandProducts.length > 3) {
            for (var i = 0; i < 3; i++) {
              arr3.push(res.data.Data.brandProducts[i]);
            }
          } else {
            arr3 = res.data.Data.brandProducts;
          }
          var arr1 = [];
          var str = "本詞條暫未被任何公司認領！";
          if (res.data.Data.chargeStatus == 2) {
            var str1 = "本詞條已被";
            var str2 = "認領。";
            str = str1.concat(res.data.Data.claimCompany);
            str = str.concat(str2);
          } else {
          }

          if (res.data.Data.hasCertification == 0) {
            var arr1 = [
              { id: "A", name: "您可能需要的其它產品" },
              { id: "G", name: "同牌子產品" },
              { id: "H", name: "標籤" }
            ];

            for (var i = 0; i < res.data.Data.htmlList.length; i++) {
              var title = {
                id: "html" + i,
                name: res.data.Data.htmlList[i].content
              };
              arr1.splice(i + 1, 0, title);
            }
          } else {
            var arr1 = [
              { id: "B", name: "產品認證" },
              { id: "A", name: "您可能需要的其它產品" },
              { id: "G", name: "同牌子產品" },
              { id: "H", name: "標籤" }
            ];

            for (var i = 0; i < res.data.Data.htmlList.length; i++) {
              var title = {
                id: "html" + i,
                name: res.data.Data.htmlList[i].content
              };
              arr1.splice(i + 2, 0, title);
            }
          }
          //中文名字
          that.drugName = res.data.Data.drugName;
          //英文名字
          that.englishName = res.data.Data.englishName;
          //浏览次数
          that.browseNum = res.data.Data.browseNum;
          //市场价格
          that.price = res.data.Data.priceName;
          //认领公司名字
          that.claimCompany = res.data.Data.claimCompany;
          //认领公司LOGO
          that.companyLogo = res.data.Data.companyLogo;
          //简介
          that.introduction = res.data.Data.introduction;
          //推荐产品
          that.recommendedProducts = arr2;
          //同品牌产品
          that.brandProducts = arr3;
          //标签
          that.tagList = res.data.Data.tagList;
          //html设置的值
          that.htmldata = res.data.Data.htmlList;
          //索引更新
          that.theindex = arr1;
          //轮播图
          that.pictureList = res.data.Data.pictureList;
          //是否付费
          that.chargeStatus = res.data.Data.chargeStatus;
          //公司认领介绍
          that.companyClaimed = str;
          //认证图
          that.certifications = res.data.Data.certificationPath;
          that.hasCertification = res.data.Data.hasCertification;
          that.toView = "image";
          var replyArr = [];
          for (let i = 0; i < that.htmldata.length; i++) {
            replyArr.push(that.htmldata[i]);
          }
          that.htmldata = that.htmldata.map(value => {
            value.contentDetails =
              '<br/><div id="A" class="title_view"><p class="mark_view"></p><p id="' +
              value.id +
              '" class="title_text">' +
              value.content +
              "</p></div><div class='mark_main'>" +
              value.contentDetails +
              "</div>";
            return value;
          });
          console.log(that.htmldata);
          mpvue.hideLoading();
        },
        fail: function(res) {
          console.log("fail", res.data);
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
@import url("~mpvue-wxparse/src/wxParse.css");
/* pages/details/details.wxss */

/* pages/message/message.wxss */

.cancel-butt {
  background: rgba(53, 189, 77, 0.7);
  position: relative;
  display: block;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  line-height: 2.2;
  border-radius: 5px;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.determine-butt {
  margin-top: 10px;
  background: rgba(53, 189, 77, 0.7);
  position: relative;
  display: block;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  line-height: 2.2;
  border-radius: 5px;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.message {
  height: 100%;
  width: 100%;
}

.backs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.headview {
  width: 100%;
  height: 100rpx;
  background: #000;
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
  font-size: 24rpx;
  color: rgb(44, 44, 44);
}

.item-contentview {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  font-size: 16rpx;
  color: rgb(220, 220, 220);
}

.screening-info {
  background: #f69;
  width: 90%;
  float: left;
  margin-top: 20px;
  /* margin-bottom: 20px; */
  margin-left: 5%;
  margin-right: 5%;
  display: block;
}

.screeningtext-top {
  display: -webkit-box;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 48rpx;
  color: rgb(44, 44, 44);
}

.screeningtext-bottom {
  display: -webkit-box;
  margin-bottom: 10px;
  font-size: 32rpx;
  color: rgb(220, 220, 220);
}

.scroll-view-item {
  height: 200px;
  background-color: red;
  margin: 10px 0;
}

.scrollDetails {
  height: 100vh;
  overflow-y: auto;
}

.index {
  position: fixed;
  top: 50vh;
  right: 10px;
  z-index: 9;
}

.hide {
  display: none;
}

.show {
  display: block;
}

.animation {
  background: rgba(0, 0, 0, 0.2);
  /* background: #000; */
  z-index: 999;
  position: fixed;
  right: -100vw;
  /* 动画初始前向右移100vh */
  width: 100%;
  height: 100%;
  overflow-y: auto;
  flex-direction: row;
}

.animation-content {
  width: 55%;
  height: 100vh;
  background: #fff;
  position: absolute;
  right: -55%;
  transition: 0.3s right;
  display: block;
  z-index: 9;
}

.pricezone {
  /* position: fixed;
  top: 0vh;
  right: 10%;
  z-index: 9;  */
  width: 100%;
}

.textview {
  text-align: center;
  margin-top: 20rpx;
}

.pricezone text {
  display: block;
  margin: 0 auto;
}

.checked_animation {
  background: #ff0;
}

.checked_animation .screeningtext {
  background: #ff0;
}

.swiper-slass {
  /* margin: auto; */
  height: 400rpx;
  width: 100%;
}

.swiper-slass image {
  width: 100%;
  height: 100%;
}

.slide-image {
  display: block;
  margin: auto;
}

.hview {
  width: 100%;
}

.text {
  float: right;
  vertical-align: middle;
  padding-right: 40rpx;
  margin-left: 5rpx;
}

.pricetext {
  margin-left: 5%;
  font-size: 38rpx;
  display: inline-block;
}

.number {
  width: 100%;
  height: 25px;
  margin-top: 10rpx;
  overflow: hidden;
}
.number .r {
  float: right;
}
.number .r .c {
  display: inline-block;
  margin-right: 30rpx;
}
.number .r .c i {
  font-size: 30rpx;
}
.number .r .f {
  float: right;
}
.browse_image {
  width: 50rpx;
  display: inline-block;
  vertical-align: middle;
}

.productName {
  flex-direction: column;
  width: 100%;
  margin-top: 20rpx;
}

.chinese_name {
  color: rgb(44, 44, 44);
  font-size: 20px;
  font-weight: bold;
  width: 90%;
  margin-left: 5%;
}

.english_name {
  color: rgb(178, 178, 178);
  font-size: 15px;
  width: 90%;
  margin-left: 5%;
}

.company_image_view {
  height: 60px;
  width: 60px;
  float: left;
  overflow: hidden;
}

.company_image {
  height: 60px;
  width: 60px;
  border-radius: 30px;
}

.entry_to_claim {
  width: 90%;
  flex-direction: row;
  position: relative;
  margin-top: 10px;
  margin-left: 5%;
  overflow: hidden;
}

.entry_to_claim_true {
  height: 60px;
}

.entry_to_claim_false {
  height: 40px;
}

.company_view {
  position: absolute;
  bottom: 0px;
}

.company_view_false {
  margin-left: 0px;
}

.company_view_true {
  margin-left: 60px;
}

.Introduction {
  width: 90%;
  margin-top: 5px;
  margin-left: 5%;
}

.Introduction_text {
  text-indent: 30px;
  display: block;
  color: #666666;
  font-size: 17px;
  margin-top: 40rpx;
}

.otherProducts {
  width: 100%;
  margin-top: 20px;
}

.product_certification {
  width: 100%;
  margin-top: 20px;
}

.hiddens {
  display: none;
}

.htmlview {
  width: 100%;
  margin-top: 20px;
}

.product_composition {
  width: 100%;
  margin-top: 20px;
}

.product_description {
  width: 100%;
  margin-top: 20px;
}

.product_specifications {
  width: 100%;
  margin-top: 20px;
}

.product_usage {
  width: 100%;
  margin-top: 20px;
}

.product_attention {
  width: 100%;
  margin-top: 20px;
}

.product_brand {
  width: 100%;
  margin-top: 20px;
}

.product_tag {
  width: 100%;
  margin-top: 20px;
}

.standby_one {
  width: 100%;
  margin-top: 20px;
}

.standby_two {
  width: 100%;
  margin-top: 20px;
}

.standby_three {
  width: 100%;
  margin-top: 20px;
}

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
  margin-left: 40rpx;
  font-size: 20px;
  color: rgb(44, 44, 44);
  float: left;
}

.parameterwrap {
  flex-direction: row;
  margin-left: 4%;
  width: 92%;
  margin-top: 30px;
  /* background: #FFFF99; */
  overflow: hidden;
}

.tag-info {
  /* background: #f69; */
  width: 27%;
  float: left;
  margin-bottom: 20rpx;
  margin-left: 3%;
  margin-right: 3%;
  display: block;
  text-align: center;
}

.screeningtext {
  width: 100%;
  background: rgb(38, 168, 73);
  text-align: center;
  display: block;
  font-size: 14px;
  color: #fff;
  height: 75rpx;
  line-height: 75rpx;
  border-radius: 15rpx;
}

.certification_image {
  width: 100%;
}

.certification_image_view {
  flex-direction: row;
  margin-left: 4%;
  width: 92%;
  margin-top: 30px;
  overflow: hidden;
}

.certification-info {
  width: 27%;
  height: 200rpx;
  float: left;
  margin-bottom: 20rpx;
  margin-left: 3%;
  margin-right: 3%;
  display: block;
  text-align: center;
  overflow: hidden;
}

.item_image {
  width: 100%;
  height: 100%;
}

.description_image_view {
  flex-direction: row;
  margin-left: 4%;
  width: 92%;
  margin-top: 30px;
  overflow: hidden;
}

.description-info {
  width: 27%;
  height: 360rpx;
  float: left;
  margin-bottom: 20rpx;
  margin-left: 3%;
  margin-right: 3%;
  display: block;
  text-align: center;
  overflow: hidden;
}

.description_item_image {
  width: 100%;
  height: 300rpx;
}

.productContent {
  width: 100%;
  /* height: 420rpx; */
}

.product_image_view {
  flex-direction: row;
  margin-left: 4%;
  width: 92%;
  margin-top: 30px;
  overflow: hidden;
}

.product-info {
  width: 27%;
  height: 340rpx;
  float: left;
  margin-bottom: 20rpx;
  margin-left: 3%;
  margin-right: 3%;
  display: block;
  text-align: center;
  overflow: hidden;
}

.product_item_image {
  width: 100%;
  height: 200rpx;
}

.product_name_text {
  font-size: 34rpx;
  text-align: center;
  color: rgb(34, 34, 34);
  line-height: 60rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
  white-space: nowrap;
  display: block;
}

.product_price_text {
  font-size: 30rpx;
  text-align: center;
  color: rgb(34, 34, 34);
  line-height: 60rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
}

.price_yuan {
  font-size: 22rpx;
  color: rgb(34, 34, 34);
  text-align: left;
  line-height: 60rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
}

.brand_view {
  width: 100%;
}

.baidu {
  width: 100%;
  height: 10px;
}

.example {
  display: block;
  width: 100%;
  height: 40rpx;
}

.marquee_box {
  width: 100%;
  height: 100%;
  position: relative;
}

.marquee_text {
  white-space: nowrap;
  position: absolute;
  top: 0;
}
.icon-shoucang2 {
  color: rgba(53, 189, 77, 1);
}
</style>