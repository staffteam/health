<template>
  <div class="test-type">
    <div class="title">类别</div>
    <div class="type-list">
      <ul>
        <li v-for="(item,index) in typeData" :key="index" v-show="item.title!=''">
          <a :href="'../testUp/main?type='+item.type+'&title='+item.title">
            <p class="type"><img :src="item.img_url" mode="widthFix"></p>
            <h2>{{item.title}}</h2>
            <i class="iconfont icon-you1"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      typeJson: {},
      typeData: []
    };
  },
  methods: {},
  created() {},
  mounted() {
    let vm = this;
    let upInfo = mpvue.getStorageSync("upInfo");
    mpvue.request({
      url: `${this.$api}/questionnaire/questionnaireClassfyList`,
      data:{
        sex:upInfo.sex,
        age:upInfo.age
      },
      success: function(res) {
        var datas = res.data.data;
        vm.typeJson = {};
        vm.typeData = [];
        for (let item in datas) {
          datas[item].img_url = vm.$imgHost + datas[item].img_url.replace(/\\/g, "/");
          vm.typeData.push({ type: datas[item].id, title: datas[item].name,img_url:datas[item].img_url });
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
.test-type {
  background-color: #f7f7f7;
  min-height: 100vh;
  .title {
    padding: 30rpx 45rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 42rpx;
  }
  .type-list {
    ul {
      li {
        height: 118rpx;
        line-height: 72rpx;
        background: rgba(255, 255, 255, 1);
        padding: 23rpx 32rpx;
        border-bottom: 1px solid #eeeeee;
        overflow: hidden;
        background-color: white;
        a {
          display: block;
          overflow: hidden;
        }
        p {
          width: 72rpx;
          height: 72rpx;
          font-size: 28rpx;
          color: rgba(255, 255, 255, 1);
          line-height: 72rpx;
          text-align: center;
          border-radius: 50%;
          float: left;
          overflow: hidden;
          img{
            width:100%;
          }
          &.type1 {
            background: #8dac66;
          }
        }
        h2 {
          margin-left: 34rpx;
          font-size: 32rpx;
          float: left;
        }
        i {
          float: right;
          font-size: 26rpx;
          color: #999999;
        }
      }
    }
  }
}
</style>