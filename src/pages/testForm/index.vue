<template>
  <div class="test-form">
    <div class="title">請先填寫以下信息</div>
    <div class="form">
      <div class="list sex">
        <span>性别：</span>
        <div @click="sexChange" :class="isSex?'on':''">
          <p>
            <span>
              <i class="iconfont icon-nan"></i> 男
            </span>
            <span>
              <i class="iconfont icon-nv"></i> 女
            </span>
          </p>
          <em></em>
        </div>
      </div>
      <div class="list">
        <span>年齡：</span>
        <div class="import">
          <!-- <input type="number" v-model="form.age" placeholder="請選擇您的年齡" /> -->
          <view class="picker" data-name="form.age" :data-list="ageList" @click="pickerOpen">
            <text :style="form.age=='請選擇年齡'?'color:#666;':''">{{form.age}}</text>
            <text class="iconfont iconyou1"></text>
          </view>
          <i class="iconfont icon-rili"></i>
        </div>
      </div>
      <div class="list">
        <span>地区：</span>
        <div class="import">
          <div class="city" @click="chooseAddress">
            <div
              :style="form.province == ''?'color:#777;':''"
            >{{form.province == ''?'省份/城市/區縣':form.province + '/' + form.city + '/' + form.area}}</div>
          </div>
          <i class="iconfont icon-dizhi"></i>
        </div>
      </div>
      <div class="btn">
        <p @click="next">下一步</p>
      </div>
    </div>
    <div :class="'open '+(isOpen?'show':'hide')">
      <div :class="'open-back '+(isOpen?'show':'hide')" @click="closeOpen"></div>
      <div :class="'content '+(isDown?'down':'')">
        <div class="t">
          <div class="l" @click="closeOpen">取消</div>
          <div class="r" @click="saveOpen">确定</div>
        </div>
        <picker-view
          class="open-list"
          indicator-style="height: 35px;"
          :value="openVal"
          @change="openChange"
        >
          <picker-view-column>
            <div v-for="(item,index) in openData" :key="index" style="line-height: 35px;">{{item}}</div>
          </picker-view-column>
        </picker-view>
      </div>
    </div>
    <nyz_area_picker
      :show="show"
      :shows="shows"
      @sureSelectArea="sureSelectAreaListener"
      @closeSelectArea="closeSelectArea"
    ></nyz_area_picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      shows: false,
      isSex: false,
      form: {
        sex: 0,
        age: "請選擇年齡",
        province: "",
        city: "",
        area: ""
      },
      ageList: [],
      ageData: {},
      isOpen: false,
      openData: [],
      openCNmae: "",
      openHostVal: "",
      isDown: false
    };
  },
  methods: {
    openChange(o) {
      this.form.age = this.openData[o.mp.detail.value[0]];
    },
    closeOpen() {
      this.isDown = false;
      setTimeout(() => {
        this.isOpen = false;
      }, 200);
    },
    saveOpen() {
      this.isDown = false;
      setTimeout(() => {
        this.isOpen = false;
      }, 200);
    },
    pickerOpen(o) {
      if (this.isOpen) {
        return false;
      }
      let name = o.mp.currentTarget.dataset.name;
      let list = o.mp.currentTarget.dataset.list;
      let _val = 0;
      if (this.form.age == "請選擇年齡") {
        this.form.age = list[0];
      }
      this.openCNmae = name;
      this.isOpen = true;
      this.openData = list;
      this.openVal = [_val];
      setTimeout(_ => {
        this.isDown = true;
      }, 50);
    },
    sureSelectAreaListener(e) {
      this.shows = false;
      this.form.province = e.mp.detail.currentTarget.dataset.province;
      this.form.city = e.mp.detail.currentTarget.dataset.city;
      this.form.area = e.mp.detail.currentTarget.dataset.area;
      setTimeout(() => {
        this.show = false;
      }, 300);
    },
    closeSelectArea() {
      this.shows = false;
      setTimeout(() => {
        this.show = false;
      }, 300);
    },
    chooseAddress() {
      this.show = true;
      setTimeout(() => {
        this.shows = true;
      }, 100);
    },
    regionChange(e) {
      this.form.region = e.mp.detail.value;
      this.form.regionCode = e.mp.detail.code;
    },
    sexChange() {
      this.isSex = !this.isSex;
      this.form.sex = this.isSex ? 1 : 0;
    },
    next() {
      let vm = this;
      if (vm.form.age == "") {
        mpvue.showToast({
          title: "請輸入您的年齡！",
          mask: true,
          image: "/static/images/tip.png"
        });
      } else if (vm.form.province == "") {
        mpvue.showToast({
          title: "請選擇所在地區！",
          mask: true,
          image: "/static/images/tip.png"
        });
      } else {
        mpvue.setStorageSync("upInfo", {
          sex: vm.form.sex == 0 ? "男" : "女",
          age: vm.ageData[vm.form.age],
          address: `${vm.form.province} ${vm.form.city} ${vm.form.area}`
        });
        mpvue.navigateTo({ url: "../testType/main" });
      }
    }
  },
  mounted() {
    let vm = this;
    mpvue.request({
      url: `${this.$api}/questionnaire/questionnaireAgeList`,
      success: function(res) {
        var datas = res.data.data;
        for (let item in datas) {
          vm.ageList.push(datas[item]);
          vm.ageData[datas[item]] = item;
        }
        console.log(vm.ageList, vm.ageData);
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
.test-form {
  padding: 64rpx;
  .title {
    font-size: 40rpx;
    color: rgba(0, 169, 128, 1);
    line-height: 56rpx;
  }
  .form {
    margin-top: 100rpx;
    .list.sex {
      overflow: hidden;
      border-bottom: 0px;
      margin-bottom: 60rpx;
      & > span {
        font-size: 30rpx;
        color: rgba(51, 51, 51, 1);
        line-height: 132rpx;
        display: block;
        float: left;
      }
      & > div {
        width: 400rpx;
        height: 132rpx;
        margin-left: 110rpx;
        background: rgba(0, 169, 128, 0.2);
        border-radius: 66rpx;
        position: relative;
        &.on {
          em {
            left: calc(~"100% - 220rpx");
          }
        }
        p {
          position: absolute;
          z-index: 9;
          width: 100%;
          line-height: 132rpx;
          font-size: 40rpx;
          color: rgba(255, 255, 255, 1);
          span {
            display: block;
            float: left;
            width: 50%;
            text-align: center;
            i {
              display: inline-block;
              font-size: 40rpx;
            }
          }
        }
        em {
          width: 220rpx;
          height: 132rpx;
          background: linear-gradient(
            180deg,
            rgba(0, 212, 183, 1) 0%,
            rgba(0, 169, 128, 1) 100%
          );
          border-radius: 66rpx;
          float: left;
          display: block;
          position: relative;
          left: 0;
          z-index: 1;
          transition: 0.3s left;
        }
      }
    }
    .list {
      overflow: hidden;
      border-bottom: 1px solid #eeeeee;
      & > span {
        font-size: 30rpx;
        color: rgba(51, 51, 51, 1);
        line-height: 104rpx;
        display: block;
        float: left;
      }
      & > div {
        margin-left: 110rpx;
        overflow: hidden;
        & > .city {
          border: 0px;
          height: 104rpx;
          line-height: 104rpx;
          font-size: 30rpx;
          padding-left: 10rpx;
          width: calc(~"100% - 90rpx");
          float: left;
        }
        .picker {
          height: 104rpx;
          line-height: 104rpx;
          font-size: 30rpx;
          padding-left: 10rpx;
          width: calc(~"100% - 90rpx");
          float: left;
        }
        input {
          border: 0px;
          height: 104rpx;
          font-size: 30rpx;
          padding-left: 10rpx;
          width: calc(~"100% - 90rpx");
          float: left;
        }
        & > i {
          width: 80rpx;
          height: 104rpx;
          display: block;
          text-align: center;
          font-size: 36rpx;
          color: #cccccc;
          line-height: 104rpx;
          float: right;
        }
      }
    }
    .btn {
      position: absolute;
      bottom: 113rpx;
      left: 0;
      width: 100%;
      p {
        width: 360rpx;
        height: 70rpx;
        background: rgba(0, 169, 128, 1);
        border-radius: 8rpx;
        text-align: center;
        line-height: 70rpx;
        font-size: 32rpx;
        color: rgba(255, 255, 255, 1);
        margin: 0 auto;
        display: block;
      }
    }
  }
}
.open {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  height: 100vh;
  width: 100%;
}

.open.show {
  display: block;
}

.open.hide {
  display: none;
}

.open-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.open-back.show {
  display: block;
}

.open-back.hide {
  display: none;
}

.open .content {
  position: absolute;
  bottom: -370rpx;
  left: 0;
  width: 100%;
  height: 370rpx;
  transition: 0.3s bottom;
  background-color: #f7f7f9;
}

.open .content.down {
  bottom: 0;
}

.open .content .t {
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
  font-size: 30rpx;
  padding: 18rpx 0rpx;
  overflow: hidden;
}

.open .content .t .l {
  float: left;
  padding-right: 20rpx;
  padding-left: 25rpx;
}

.open .content .t .r {
  color: #00a980;
  padding-left: 20rpx;
  padding-right: 25rpx;
  float: right;
}

.open .content .open-list {
  height: 300rpx;
  width: 100%;
  text-align: center;
}

.open .content .open-list view {
  text-align: center;
  font-size: 28rpx;
}

.open.pothunterOpen .content {
  bottom: -300rpx;
  height: 300rpx;
}

.open.pothunterOpen .content.down {
  bottom: 0;
}
</style>