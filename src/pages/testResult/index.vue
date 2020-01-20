<template>
  <div class="test-result">
    <div class="result">
      <div class="title">
        <img src="/static/images/test-result.png" mode="widthFix" alt />
      </div>
      <div class="main" v-show="testResult!=''">
        <text>{{testResult}}</text>
      </div>
    </div>
    <div class="recommend">
      <div class="title">
        <img src="/static/images/recommend.png" mode="widthFix" alt />
      </div>
      <div class="main">
        <ul>
          <li v-for="(item,index) in recommendData" :key="index" @click="goProject(item)">
            <p>
              <img :src="item.drugs.img_url" mode="aspectFill" alt />
            </p>
            <div>
              <h2 class="line">{{item.drugs.name}}</h2>
              <p class="lines">{{item.drugs.function}}</p>
              <div class="label">
                <span v-for="(items,i) in item.drugs.labels" :key="i">{{items}}</span>
              </div>
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
      testResult: "",
      recommendData: [],
      formId: ""
    };
  },
  methods: {
    goProject(item) {
      let vm = this;
      mpvue.request({
        url: `${this.$api}/questionnaire/seeDrugsSave`,
        method: "POST",
        data: {
          form_id: vm.formId,
          drug_id: item.drugs.id,
          // loginkey: mpvue.getStorageSync("sessionId")
        },
        success: function(res) {
          mpvue.hideLoading();
          if (res.statusCode == 200) {
            if (res.data.msg == "ok") {
              mpvue.navigateTo({
                url: "../productDetails/main?title=" + item.drugs.id
              });
            } else {
              mpvue.showToast({
                title: res.data.msg,
                icon: "none",
                time: "2000"
              });
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
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    }
  },
  created() {},
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
    vm.formId = o.id;
    mpvue.showLoading({
      title: "加載中"
    });
    let upInfo = mpvue.getStorageSync("upInfo");
    mpvue.request({
      url: `${this.$api}/questionnaire/questionnaireResult?sex=${
        upInfo.sex
      }&score=${upInfo.score}&qid=${upInfo.qid}&age=${upInfo.age}`,
      success: function(res) {
        mpvue.hideLoading();
        if (res.statusCode == 200) {
          vm.testResult = res.data.data.content;
          vm.recommendData = res.data.data.drugslist;
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
};
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.test-result {
  background-color: #f7f7f7;
  padding: 12rpx;
  min-height: 100vh;
  .result {
    .main {
      padding: 30rpx;
      background-color: white;
    }
  }
  .recommend {
    margin-top: 10rpx;
    .main {
      padding: 20rpx;
      margin: 30rpx;
      background-color: white;
      ul {
        li {
          margin: 30rpx;
          height: 240rpx;
          background-color: #f7f7f7;
          display: block;
          overflow: hidden;
          padding: 30rpx 30rpx;
          & > p {
            width: 180rpx;
            height: 180rpx;
            float: left;
            overflow: hidden;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            background-color: white;
            img {
              width: 100%;
              height: 100%;
            }
          }
          & > div {
            margin-left: 200rpx;
            h2 {
              font-size: 32rpx;
              color: rgba(0, 0, 0, 1);
              line-height: 45rpx;
              font-weight: 600;
            }
            p {
              font-size: 24rpx;
              color: rgba(85, 85, 85, 1);
              line-height: 33rpx;
              margin-top: 8rpx;
              height: 66rpx;
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
</style>