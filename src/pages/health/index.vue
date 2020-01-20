<template>
  <div class="health">
    <div v-for="(item,index) in healthTypeData" :key="index">
      <div class="title">{{item.name}}</div>
      <div class="health-list">
        <ul>
          <li v-for="(items,i) in item.childs" :key="i">
            <a
              :href="'../healthList/main?id='+items.id+'&name='+items.name"
              v-if="!items.childs || items.childs.length==0"
            >
              <p class="on type">
                <img :src="items.icon_url" mode="aspectFill" />
              </p>
              <h2>{{items.name}}</h2>
              <i class="iconfont icon-you1"></i>
            </a>
            <div v-else>
              <div :class="'t '+(items.check?'on':'')" @click="healthList(item,items)">
                <p class="on type">
                  <img :src="items.icon_url" mode="aspectFill" />
                </p>
                <h2>{{items.name}}</h2>
                <i class="iconfont icon-you1"></i>
              </div>
              <div class="b" v-if="items.check">
                <p v-for="(the,is) in items.childs" :key="is">
                  <a :href="'../healthList/main?id='+the.id+'&name='+the.name">
                    <span></span>
                    {{the.name}}
                  </a>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      healthTypeData: []
    };
  },
  methods: {
    healthList(item, items) {
      this.healthTypeData = this.healthTypeData.map(value => {
        if (value.id == item.id) {
          value.childs = value.childs.map(value2 => {
            if (value2.id == items.id) {
              value2.check = !value2.check;
            } else {
              value2.check = false;
            }
            return value2;
          });
        }
        return value;
      });
    }
  },
  mounted() {
    let vm = this;
    mpvue.showLoading({
      title: "加載中"
    });
    vm.healthTypeData = [];
    mpvue.request({
      url: `${this.$api}/article/newsClassfyList`,
      success: function(res) {
        mpvue.hideLoading();
        if (res.statusCode == 200) {
          res.data.data = res.data.data.map(value => {
            for (let item in value.childs) {
              if (value.childs[item].icon_url) {
                value.childs[item].icon_url =
                  vm.$imgHost + value.childs[item].icon_url.replace(/\\/g, "/");
              }
            }
            return value;
          });
          vm.healthTypeData = res.data.data;
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
.health {
  min-height: 100vh;
  background-color: #f7f7f7;
  .title {
    height: 100rpx;
    line-height: 100rpx;
    padding: 0 45rpx;
    font-size: 30rpx;
    font-weight: 600;
  }
  .health-list {
    background-color: white;
    ul {
      li {
        background: rgba(255, 255, 255, 1);
        &:last-child {
          border-bottom: 0px;
        }
        a {
          display: block;
          overflow: hidden;
          padding: 23rpx 40rpx;
          line-height: 72rpx;
          border-bottom: 1px solid #eeeeee;
        }
        p.on {
          width: 72rpx;
          height: 72rpx;
          border-radius: 50%;
          float: left;
          &.on {
            color: white;
            text-align: center;
            line-height: 72rpx;
            font-size: 24rpx;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
        h2 {
          float: left;
          margin-left: 30rpx;
          font-size: 32rpx;
        }
        i {
          float: right;
          font-size: 26rpx;
          color: #cccccc;
        }
        & > div {
          div.t {
            overflow: hidden;
            padding: 23rpx 40rpx;
            height: 118rpx;
            line-height: 72rpx;
            border-bottom: 1px solid #eeeeee;
            &.on {
              i {
                transform: rotate(90deg);
              }
            }
            i {
              transform: rotate(0deg);
              transition: 0.3s transform;
            }
          }
          div.b {
            p {
              width: 100%;
              height: 118rpx;
              line-height: 118rpx;
              border-bottom: 1px solid #eeeeee;
              font-size: 30rpx;
              text-align: center;
              span {
                width: 10rpx;
                height: 10rpx;
                border-radius: 50%;
                background-color: #00a980;
                margin-right: 10rpx;
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }
}
</style>