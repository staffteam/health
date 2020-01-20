<template>
  <div class="test-form">
    <div class="title">請先填寫以下信息</div>
    <div class="form">
      <div class="list">
        <span>店鋪名稱：</span>
        <div class="import">
          <input type="text" v-model="form.shop" placeholder="請輸入店鋪名稱" />
        </div>
      </div>
      <div class="list">
        <span>姓名：</span>
        <div class="import">
          <input type="text" v-model="form.name" placeholder="請輸入姓名" />
        </div>
      </div>
      <div class="list">
        <span>手機號：</span>
        <div class="import">
          <input type="number" v-model="form.phone" placeholder="請輸入手機號" />
        </div>
      </div>
      <div class="btn">
        <p @click="next">提交</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        shop: "",
        phone: ""
      },
      user_card_code: ""
    };
  },
  onLoad(o) {
    this.user_card_code = o.code;
  },
  methods: {
    next() {
      let vm = this;
      if (vm.form.shop == "") {
        mpvue.showToast({
          title: "請輸入店鋪名稱",
          icon: "none",
          time: "2000"
        });
      } else if (vm.form.name == "") {
        mpvue.showToast({
          title: "請輸入姓名",
          icon: "none",
          time: "2000"
        });
      } else if (vm.form.phone == "") {
        mpvue.showToast({
          title: "請輸入手機號",
          icon: "none",
          time: "2000"
        });
      } else if (
        !/^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/.test(
          vm.form.phone
        )
      ) {
        mpvue.showToast({
          title: "請輸入正確的手機號",
          icon: "none",
          time: "2000"
        });
      } else {
        mpvue.showLoading({
          title: "加載中"
        });
        mpvue.request({
          url: `${this.$api}/coupon/couponConsumeFormSave`,
          method: "POST",
          data: {
            name: vm.form.name,
            shop: vm.form.shop,
            phone: vm.form.phone,
            user_card_code: vm.user_card_code,
            user_id: mpvue.getStorageSync("userId"),
          },
          success: function(res) {
            mpvue.hideLoading();
            if (res.statusCode == 200) {
              mpvue.showToast({
                title: "提交成功!",
                icon: "success",
                time: "2000"
              });
              setTimeout(_ => {
                mpvue.navigateBack({
                  delta: 1
                });
              }, 2000);
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
  },
  mounted() {
    let vm = this;
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
        margin-left: 150rpx;
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
        margin-left: 150rpx;
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