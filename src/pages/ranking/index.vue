<template>
  <div class="ranking">
    <div class="top">
      <img src="/static/images/top-top.png" mode="widthFix" alt />
    </div>
    <div class="ranking-main">
      <div class="list" v-for="(item,index) in rankingData" :key="index">
        <a :href="'../productDetails/main?title='+item.Id">
          <div class="l">
            <img v-if="index==0" src="/static/images/top1.png" mode="widthFix" />
            <img v-if="index==1" src="/static/images/top2.png" mode="widthFix" />
            <img v-if="index==2" src="/static/images/top3.png" mode="widthFix" />
            <p v-if="index>2">{{index+1}}</p>
          </div>
          <div class="l-img">
            <img :src="item.img_url" mode="aspectFill" alt />
          </div>
          <div class="r">
            <h2 class="line">{{item.Drugs_name}}</h2>
            <div class="lines">{{item.Drugs_synopsis}}</div>
            <p>
              <span v-for="(items,i) in item.labels" :key="i">{{items}}</span>
            </p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rankingData: []
    };
  },
  mounted() {
    let vm = this;
    mpvue.request({
      url: `${this.$api}/Drug/top`,
      success: function(res) {
        var datas = res.data.data;
        vm.rankingData = datas;
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
.ranking-main {
  padding-bottom: 40rpx;
  div.list {
    padding: 40rpx 30rpx;
    border-bottom: 2rpx solid #f3f3f3;
    overflow: hidden;
    div.l {
      float: left;
      height: 160rpx;
      img {
        width: 61rpx;
        height: 51rpx;
        margin: 0 auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
      p {
        width: 61rpx;
        margin: 0 auto;
        text-align: center;
        font-size: 32rpx;
        color: rgba(153, 153, 153, 1);
        line-height: 51rpx;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    div.l-img {
      margin-left: 30rpx;
      width: 160rpx;
      height: 160rpx;
      overflow: hidden;
      float: left;
      img {
        height: 100%;
      }
    }
    div.r {
      margin-left: 290rpx;
      h2 {
        font-size: 26rpx;
        line-height: 37rpx;
        font-weight: 600;
      }
      div {
        font-size: 24rpx;
        color: rgba(85, 85, 85, 1);
        line-height: 33rpx;
        margin-top: 4rpx;
      }
      p {
        margin-top: 10rpx;
        height: 30rpx;
        overflow: hidden;
        span {
          background: rgba(203, 130, 203, 1);
          border-radius: 4rpx;
          display: block;
          float: left;
          padding: 0 8rpx;
          height: 30rpx;
          line-height: 30rpx;
          font-size: 20rpx;
          margin-right: 5rpx;
          color: rgba(255, 255, 255, 1);
          &:nth-child(2) {
            background-color: #e6889a;
          }
          &:nth-child(3) {
            background-color: #8dac66;
          }
        }
      }
    }
  }
}
</style>