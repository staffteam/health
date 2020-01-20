<template>
  <div>
    <div :class="table" :style="'overflow-y:'+hidden">
      <div class="animation" :style="'right:'+(show ? '0':'-100vw')">
        <div @click="cancel" class="backs"></div>
        <div class="animation-content" :style="'right:'+(animationShow ? '0':'-80%')">
          <div class="pricezone">
            <div class="pztitle pztitles">
              <text>品牌</text>
            </div>
            <div class="parameterwrap" style="flex-direction:row;">
              <div v-for="(item,index) in brand" :key="index">
                <div
                  :class="'screening-info '+(item.checked?'checked_animation':'')"
                  :data-id="item.id"
                  @click="brandTap"
                >
                  <text class="screeningtext text-over">{{item.brand}}</text>
                </div>
              </div>
            </div>

            <div class="line" style="color:#ddd"></div>

            <div class="pztitle pztitles">
              <text>年齡</text>
            </div>
            <div class="parameterwrap" style="flex-direction:row;">
              <div v-for="(item,index) in ageScope" :key="index">
                <div
                  :class="'screening-info '+(item.checked?'checked_animation':'')"
                  :data-id="item.id"
                  @click="classificationTap"
                >
                  <text class="screeningtext text-over">{{item.ageScope}}</text>
                </div>
              </div>
            </div>

            <div class="line" style="color:#ddd"></div>

            <div class="pztitle pztitles">
              <text>人群</text>
            </div>
            <div class="parameterwrap" style="flex-direction:row;">
              <div v-for="(item,index) in crowd" :key="index">
                <div
                  :class="'screening-info '+(item.checked?'checked_animation':'')"
                  :data-id="item.id"
                  @click="phaseTap"
                >
                  <text class="screeningtext text-over">{{item.crow}}</text>
                </div>
              </div>
            </div>

            <div class="line" style="color:#ddd"></div>

            <div class="pztitle pztitles">
              <text>價格</text>
            </div>
            <div class="parameterwrap" style="flex-direction:row;">
              <div v-for="(item,index) in drugsPrice" :key="index">
                <div
                  :class="'screening-info '+(item.checked?'checked_animation':'')"
                  :data-id="item.id"
                  @click="drugsPriceTap"
                >
                  <text class="screeningtext text-over">{{item.price}}</text>
                </div>
              </div>
            </div>
          </div>

          <div class="butview">
            <button class="cancel-butt" @click="cancel" type="primary">取消</button>
            <button class="determine-butt" @click="determine" type="primary">確定</button>
          </div>
        </div>
      </div>

      <div class="weui-cell1 weui-cell_input">
        <input
          class="weui-input"
          confirm-type="search"
          @confirm="blurs"
          placeholder="請輸入您要搜索的內容"
          :value="inputvalue"
        />
      </div>

      <div class="screeningbut" @click="filter">
        <div class="screeningbut_text">篩選</div>
        <img class="screeningbut_image" mode="aspectFit" src="/static/images/shaixuan.png" />
      </div>

      <div class="buttview">
        <div
          :class="'nav-son '+(shownavindex == 1? 'active' : '')"
          @click="comprehensiveTap"
          data-nav="1"
        >
          <div class="content">綜合排序</div>
          <div class="line_view"></div>
        </div>

        <div :class="'nav-son '+(shownavindex == 2? 'active' : '')" @click="hotTap" data-nav="2">
          <div class="content">熱門優選</div>
          <div class="line_view"></div>
        </div>

        <div :class="'nav-son '+(shownavindex == 3? 'active' : '')" @click="latestTap" data-nav="3">
          <div class="content">{{pricetitle}}</div>
          <div class="line_view"></div>
        </div>
      </div>

      <div class="parameterwrap" style="flex-direction:row;">
        <div v-for="(item,index) in parameter" :key="index">
          <div
            :class="'parameter-info '+(item.checked?'checked_parameter':'')"
            :data-id="item.id"
            @click="parameterTap"
          >
            <img
              :src="item.drugImagePath || 'https://health.mhcamo.com/upload/detail/detail_default.jpg'"
              mode="aspectFill"
              class="slide-image"
            />
            <text class="text-inforight text-over">{{item.drugsName}}</text>
            <div class="price_view">
              <text class="price_left">市場價格</text>
              <!-- <text class='price_yuan'>¥</text> -->
              <text class="price_right">{{item.priceName}}</text>
            </div>
            <text class="text-infoleft text-over">{{item.drugsSynopsis}}</text>
          </div>
        </div>
      </div>
      <div class="parameterwrap tj" v-if="showTj && recommends.length>0" >
          <div class="title">相關推薦</div>
          <div v-for="(item,index) in recommends" :key="index">
            <div
              :class="'parameter-info '+(item.checked?'checked_parameter':'')"
              :data-id="item.id"
              @click="parameterTap"
            >
              <img
                :src="item.drugImagePath || 'https://health.mhcamo.com/upload/detail/detail_default.jpg'"
                mode="aspectFill"
                class="slide-image"
              />
              <text class="text-inforight text-over">{{item.drugsName}}</text>
              <div class="price_view">
                <text class="price_left">市場價格</text>
                <!-- <text class='price_yuan'>¥</text> -->
                <text class="price_right">{{item.priceName}}</text>
              </div>
              <text class="text-infoleft text-over">{{item.drugsSynopsis}}</text>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchPageNum: 1, //页数
      count: 10, //每页数量
      brandvalue: "", //品牌
      ageScopevalue: "", //年龄
      crowdvalue: "", //人群
      drugsPricevalue: "", //价格
      str: "00000000",
      shownavindex: "1",
      current: 3,
      pricetitle: "價格 ↑",
      pricebool: false,
      array: [
        {
          ranking: 1,
          name: "foo"
        },
        {
          ranking: 2,
          name: "sds"
        }
      ],
      parameter: [], //模拟商品参数数据，如果是线上版本需要自行发起request请求
      brand: [],
      ageScope: [],
      crowd: [],
      drugsPrice: [],

      focus: false,
      inputValue: "",
      hidden: "auto",
      table: "table-show",
      show: false,
      animationShow: false,
      inputvalue: "",
      isGet: true,
      showTj: false,
      recommends: []
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var vue = options.title;
    console.log("你点击了键盘搜索键，携带数据为：" + vue);
    this.inputvalue = "" + vue;
    this.getdata(false);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.searchPageNum = 1;
    this.isGet = true;
    this.getdata(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (this.isGet) {
      that.searchPageNum++;
      that.getdata(false);
    }
  },
  methods: {
    //搜索事件
    blurs: function(e) {
      var that = this;
      var vue = e.mp.detail.value;
      var newarray = [vue];
      var searchRecord = mpvue.getStorageSync("searchRecords");
      var searchRecords = new Array();

      if (searchRecord) {
        searchRecords = searchRecord;
        searchRecords = that.unique(searchRecords, vue);
        mpvue.setStorageSync("searchRecords", searchRecords);
        that.inputvalue = "" + vue;
        that.searchPageNum = 1;
        that.brandvalue = ""; //品牌
        that.ageScopevalue = ""; //年龄
        that.crowdvalue = ""; //人群
        that.drugsPricevalue = ""; //价格
        that.isGet = true;
        that.getdata(true);
      } else {
        mpvue.setStorageSync("searchRecords", newarray);
      }
    },
    unique(arr, val) {
      let _is = true;
      arr.forEach(value => {
        if (value == val) {
          _is = false;
        }
      });
      _is ? arr.push(val) : null;
      return arr;
    },
    searchSubmit: function(e) {
      console.log("form发生了submit事件，携带数据为：", e.mp.detail.value);
    },
    searchBtn: function() {
      this.str = "你点击了键盘搜索键";
      console.log("你点击了键盘搜索键");
    },

    // 参数点击响应事件
    parameterTap: function(e) {
      //e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
      var that = this;
      var this_checked = e.mp.currentTarget.dataset.id;
      var parameterList = this.parameter; //获取Json数组
      for (var i = 0; i < parameterList.length; i++) {
        if (parameterList[i].id == this_checked) {
          parameterList[i].checked = true; //当前点击的位置为true即选中
        } else {
          parameterList[i].checked = false; //其他的位置为false
        }
      }
      that.parameter = parameterList;
      console.log("携带数据为：", e.mp.currentTarget.dataset.id);

      mpvue.navigateTo({
        url: "../productDetails/main?title=" + e.mp.currentTarget.dataset.id
      });
    },

    // 品牌
    brandTap: function(e) {
      //e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
      var that = this;
      var this_checked = e.mp.currentTarget.dataset.id;
      var parameterList = this.brand; //获取Json数组
      var brandstr = "";
      for (var i = 0; i < parameterList.length; i++) {
        if (parameterList[i].id == this_checked) {
          if (parameterList[i].checked) {
            parameterList[i].checked = false;
          } else {
            parameterList[i].checked = true; //当前点击的位置为true即选中
            brandstr = parameterList[i].brand;
          }
          console.log("携带数据为：", parameterList[i]);
          console.log("brandvalue === ", parameterList[i].id);
        } else {
          parameterList[i].checked = false;
        }
      }
      that.brandvalue = brandstr;
      that.brand = parameterList;
      console.log("携带数据为：", e.mp.currentTarget.dataset.id);
    },

    // 年龄
    classificationTap: function(e) {
      //e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
      var that = this;
      var this_checked = e.mp.currentTarget.dataset.id;
      var parameterList = this.ageScope; //获取Json数组
      var ageScopestr = "";

      for (var i = 0; i < parameterList.length; i++) {
        if (parameterList[i].id == this_checked) {
          if (parameterList[i].checked) {
            parameterList[i].checked = false;
          } else {
            parameterList[i].checked = true; //当前点击的位置为true即选中
            ageScopestr = parameterList[i].id;
          }
          console.log("ageScopevalue：", parameterList[i].id);
        } else {
          parameterList[i].checked = false;
        }
      }
      that.ageScopevalue = ageScopestr;
      that.ageScope = parameterList;
      console.log("携带数据为：", e.mp.currentTarget.dataset.id);
    },

    // 人群
    phaseTap: function(e) {
      //e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
      var that = this;
      var this_checked = e.mp.currentTarget.dataset.id;
      var parameterList = this.crowd; //获取Json数组
      var crowdstr = "";

      for (var i = 0; i < parameterList.length; i++) {
        if (parameterList[i].id == this_checked) {
          if (parameterList[i].checked) {
            parameterList[i].checked = false;
          } else {
            parameterList[i].checked = true; //当前点击的位置为true即选中
            crowdstr = parameterList[i].id;
          }
        } else {
          parameterList[i].checked = false;
        }
      }
      that.crowdvalue = crowdstr;
      that.crowd = parameterList;
      console.log("携带数据为：", e.mp.currentTarget.dataset.id);
    },

    //价格
    drugsPriceTap: function(e) {
      //e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
      var that = this;
      var this_checked = e.mp.currentTarget.dataset.id;
      var parameterList = this.drugsPrice; //获取Json数组
      var drugsPricestr = "";
      for (var i = 0; i < parameterList.length; i++) {
        if (parameterList[i].id == this_checked) {
          if (parameterList[i].checked) {
            parameterList[i].checked = false;
          } else {
            parameterList[i].checked = true; //当前点击的位置为true即选中
            drugsPricestr = parameterList[i].id;
          }
          console.log("携带数据为：", parameterList[i].name);
        } else {
          parameterList[i].checked = false;
        }
      }
      that.drugsPricevalue = drugsPricestr;
      that.drugsPrice = parameterList;
      console.log("携带数据为：", e.mp.currentTarget.dataset.id);
    },

    filter: function(e) {
      //点击筛选事件
      this.show = true;
      setTimeout(_ => {
        this.animationShow = true;
      }, 50);
      this.hidden = "hidden";
      this.table = "table-hidden";
    },

    determine: function(e) {
      //确认筛选事件

      console.log(
        "品牌 分类  阶段 " +
          this.brandvalue +
          this.classificationvalue +
          this.brandvalue
      ),
        (this.animationShow = false);
      setTimeout(_ => {
        this.show = false;
      }, 200);
      this.hidden = "auto";
      this.table = "table-show";

      this.searchPageNum = 1;
      this.isGet = true;
      this.getdata(false);
    },

    cancel: function(e) {
      //取消筛选事件
      this.animationShow = false;
      setTimeout(_ => {
        this.show = false;
      }, 200);
      this.hidden = "auto";
      this.table = "table-show";
    },

    //综合排序点击方法
    comprehensiveTap: function(e) {
      this.shownavindex = e.mp.currentTarget.dataset.nav;
      this.searchPageNum = 1;
      this.current = 3;
      this.isGet = true;
      console.log("综合", this.current);
      this.getdata(false);
    },

    //热门优先点击方法
    hotTap: function(e) {
      this.shownavindex = e.mp.currentTarget.dataset.nav;
      this.searchPageNum = 1;
      this.current = 2;
      this.isGet = true;
      console.log("热门", this.current);
      this.getdata(false);
    },

    //价格点击方法
    latestTap: function(e) {
      if (this.shownavindex == 3) {
        if (this.pricebool) {
          this.shownavindex = e.mp.currentTarget.dataset.nav;
          this.current = 0;
          this.searchPageNum = 1;
          this.pricetitle = "價格 ↑";
          this.pricebool = false;
        } else {
          this.shownavindex = e.mp.currentTarget.dataset.nav;
          this.current = 1;
          this.searchPageNum = 1;
          this.pricetitle = "價格 ↓";
          this.pricebool = true;
        }
      } else {
        if (this.pricebool) {
          this.shownavindex = e.mp.currentTarget.dataset.nav;
          this.searchPageNum = 1;
          this.current = 1;
        } else {
          this.shownavindex = e.mp.currentTarget.dataset.nav;
          this.searchPageNum = 1;
          this.current = 0;
        }
      }
      console.log("价格：", this.current);
      this.isGet = true;
      this.getdata(false);
    },

    //刷新数据
    getdata: function(e) {
      var that = this;
      this.isGet = false;
      mpvue.showLoading({
        title: "正在加載數據"
      });
      //this.config.service.goodsSearch `${that.$api}/drug/search`,
      mpvue.request({
        url: `${that.$api}/drug/search`,
        data: {
          args: {
            pageNum: this.searchPageNum,
            count: 10,
            userId: mpvue.getStorageSync("userId"),
            keyword: this.inputvalue,
            sortingType: this.current,
            screening: {
              brand: this.brandvalue,
              ageScope: this.ageScopevalue,
              crowd: this.crowdvalue,
              priceScope: this.drugsPricevalue
            }
          }
        },
        success: function(res) {
          console.log("success", res.data.data);
          that.isGet = true;
          that.showTj = false;
          if (e) {
            //跟换了关键字
            if (res.data.code == 1) {
              if (
                res.data.data.products.length == 0 &&
                that.searchPageNum != 1
              ) {
                that.isGet = false;
                that.showTj = true;
                mpvue.showToast({
                  title: "已加載全部數據",
                  icon: "none",
                  duration: 2000
                });
              } else {
                mpvue.hideLoading();
                that.parameter = res.data.data.products;
                that.recommends = res.data.data.recommends;
                that.brand = res.data.data.conditions[0].list;
                that.ageScope = res.data.data.conditions[1].list;
                that.crowd = res.data.data.conditions[2].list;
                that.drugsPrice = res.data.data.conditions[3].list;
                if (that.parameter.length < 4 && that.searchPageNum == 1) {
                  that.showTj = true;
                }
              }
            } else {
              if (that.searchPageNum == 1) {
                //刷新数据
                that.isGet = false;
                that.showTj = true;
                mpvue.showToast({
                  title: "暫無數據",
                  icon: "none",
                  duration: 2000
                });
                that.messagedata = res.data.data.products;
                that.brand = res.data.data.conditions[0].list;
                that.ageScope = res.data.data.conditions[1].list;
                that.crowd = res.data.data.conditions[2].list;
                that.drugsPrice = res.data.data.conditions[3].list;
              } else {
                //加载更多
                that.isGet = false;
                that.showTj = true;
                mpvue.showToast({
                  title: "已加載全部數據",
                  icon: "none",
                  duration: 2000
                });
              }
            }
          } //只更换筛选条件
          else {
            if (res.data.code == 1) {
              mpvue.hideLoading();
              if (
                res.data.data.products.length == 0 &&
                that.searchPageNum != 1
              ) {
                that.isGet = false;
                that.showTj = true;
                mpvue.showToast({
                  title: "已加載全部數據",
                  icon: "none",
                  duration: 2000
                });
              } else {
                if (that.searchPageNum == 1) {
                  //刷新数据
                  that.parameter = res.data.data.products;
                  if (that.parameter.length < 4) {
                    that.showTj = true;
                  }
                } else {
                  //加载更多
                  that.parameter = that.parameter.concat(
                    res.data.data.products
                  );
                }
                that.recommends = res.data.data.recommends;
              }
            } else {
              if (that.searchPageNum == 1) {
                //刷新数据
                that.isGet = false;
                that.parameter = res.data.data.products;
                that.recommends = res.data.data.recommends;
                that.showTj = true;
                mpvue.showToast({
                  title: "暫無數據",
                  icon: "none",
                  duration: 2000
                });
              } else {
                //加载更多
                that.isGet = false;
                that.showTj = true;
                mpvue.showToast({
                  title: "已加載全部數據",
                  icon: "none",
                  duration: 2000
                });
              }
            }
          }
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
.weui-input {
  /* background:"../../../image/icon_foot.png" no-repeat 5px 5px;   */

  height: 2.58823529em;
  min-height: 2.58823529em;
  line-height: 2.58823529em;
  margin: 5px auto;
  text-align: 10px;
  border-radius: 24px;
  border: 0.25px solid rgb(240, 240, 240);
  padding-left: 40px;
  padding-right: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 1);
}

.weui-input:before {
  content: "";
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZTJjODIzZC1hYjM1LTA2NDItOGVlMC0yZDI3ZWM1ZmMzYzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkM2MjgyNDczQzk2MTFFOEI2ODdCMzdEQUMzOUY2REIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkM2MjgyNDYzQzk2MTFFOEI2ODdCMzdEQUMzOUY2REIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N2U2ZTVkYzQtNTNiMi04MTRiLWJlN2UtZGE2MGUwM2U5Y2MzIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGNlMGEzODYtMjM2ZC0xMWU4LWFhMTItZjczM2NiOTlhY2IzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+rOuCTgAAAMlQTFRFqqqqtLS08vLy8PDw7+/vsLCw5ubm8fHx+vr69PT0sbGx8/Pz+Pj4tbW139/fuLi40tLSra2twMDAvb29y8vLsrKyrKyss7Oz9vb2zc3NxsbG4uLix8fHq6ur6urq19fX0NDQ2NjYt7e3+/v7yMjI9fX129vb1NTU7u7uz8/Pw8PDzMzM/Pz8ysrK2traxMTEr6+vrq6uycnJ5eXl+fn54eHhurq61dXVxcXFzs7O/v7+7e3t09PTu7u7v7+/3d3dvr6+ubm5////vdqAPgAAAEN0Uk5T////////////////////////////////////////////////////////////////////////////////////////AEFiBO8AAAEqSURBVHjadNLXdoMwDAbgnxkgrBAgu9mrSdO9R1q//0PVGGMMpbqA4/NhI0sC4aGf9oPt/QORA/lrFIGFEvbraF9nkCgpffb8KmoG3bLVXKs9yr6aybh2gNjia1MBThJeAtJR6wXwLtAEBnKKGtAV2EVvWbnAFLjg2AKeK0aOBqYcN0CriuQFQ457JFYNr/DE8QBvWcMYAccQN+6fnd8cH0VuIiIcOLq3WFXNTnEu7rmqpztGp12g2hEVYeEDr2VtP4DhUZg5AQJV4ButfGDy/81Yzx2tbPaYrj9DfzQfdvKBgKGXYzL3UMTdIp8XvZwha/NFW54GgxbpO0wnO4E0XH2X36CtME10CaV252qYTUhsg2nUiETNEvxRm5GoPXh98g8SLaZV+hVgAKMlkIY2VWZ8AAAAAElFTkSuQmCC")
    no-repeat left;
  background-size: 20px 20px;
  background-position: 10px;
  position: absolute;
  left: 0px;
  width: 40px;
  height: 40px;
}

.backs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.table-show {
  width: 100%;
  height: auto;
  display: block;
}
.screeningbut {
  width: 25%;
  margin-top: 20rpx;
  display: flex;
  flex: 1;
  text-align: center;
  height: 80rpx;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 80rpx;
  color: rgb(153, 153, 153);
  float: right;
}
.screeningbut_image {
  height: 30px;
  width: 30px;
  float: right;
}

.screeningbut_text {
  height: 100%;
  color: rgb(153, 153, 153);
  float: right;
}

.buttview {
  flex-direction: row;
  width: 75%;
  margin-top: 20rpx;
  display: flex;
  flex: 1;
  text-align: center;
  height: 80rpx;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 80rpx;
}

.nav-son {
  width: 33%;
}

/* .nav-son.active {
  background: -webkit-gradient(linear, 10% 10%, 10% 100%, from(rgba(36, 165, 73, 1)), to(rgba(53, 189, 77, 1)));
} */

.nav-son.active .content {
  color: rgb(39, 169, 74);
}

.nav-son.active .line_view {
  background: #00a980;
}

.content {
  width: 100%;
  color: rgb(153, 153, 153);
}
.line_view {
  background: rgba(255, 255, 255, 0);
  height: 6rpx;
  margin-left: 10%;
  margin-right: 10%;
}

.table-hidden {
  width: 100%;
  height: 100vh;
  /* display: block;
   */
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
}

.flex-wrp {
  flex-direction: row;
}
.screening_item_container {
  flex-direction: row;
}

.drugimage {
  width: 100%;
  background-color: #fff;
}

.drugintroduce {
  flex-direction: column;
}

.parameterwrap {
  flex-direction: row;
  margin-top: 30rpx;
  padding-left: 2%;
  padding-right: 2%;
  /* background: #FFFF99; */
  overflow: hidden;
}

.parameter-info {
  /* background: #f69; */
  width: 44%;
  float: left;
  margin-bottom: 20px;
  padding-bottom: 10rpx;
  margin-left: 2.5%;
  margin-right: 2.5%;
  display: block;
  border-radius: 16rpx;
  border: 1px solid rgb(150, 150, 150);
}

.screening-info {
  /* background: #f69; */
  width: 27%;
  float: left;
  margin-bottom: 20rpx;
  margin-left: 3%;
  margin-right: 3%;
  display: block;
  text-align: center;
}

.text-infoleft {
  /* height: 100%;
  width: 50%; */
  /* background: #ff0; */
  /* display:block; */ /* float:left; */
  display: -webkit-box;
  font-size: 28rpx;
  line-height: 40rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 80rpx;
  padding-left: 5%;
  padding-right: 5%;
  color: rgb(153, 153, 153);
}
.screeningtext {
  /* width: 100%; */
  background: rgb(220, 220, 220);
  text-align: center;
  display: block;
  font-size: 28rpx;
  color: #000;
  height: 55rpx;
  line-height: 55rpx;
  border-radius: 15rpx;
  border: 0.25px solid rgb(220, 220, 220);
}

.text-inforight {
  display: -webkit-box;
  font-size: 32rpx;
  color: rgb(34, 34, 34);
  font-weight: bold;
  line-height: 60rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
  /* background: #f00; */
  padding-left: 5%;
  padding-right: 5%;
}

.price_view {
  padding-left: 5%;
  padding-right: 5%;
}

.price_left {
  font-size: 26rpx;
  color: rgb(34, 34, 34);
  font-weight: bold;
  line-height: 40rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40rpx;
}

.price_yuan {
  font-size: 24rpx;
  color: rgb(252, 53, 58);
  font-weight: bold;
  line-height: 40rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40rpx;
}

.price_right {
  font-size: 28rpx;
  color: rgb(252, 53, 58);
  font-weight: bold;
  line-height: 40rpx;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40rpx;
}

.weui-cell1 {
  padding: 10px 15px;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  background: #00a980;
}

.animation {
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 999;
  right: 0;
  /* 动画初始前向右移100vh */
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  flex-direction: row;
}

.animation-content {
  width: 80%;
  height: 100vh;
  background: #fff;
  position: absolute;
  right: -80%;
  display: block;
  transition: 0.3s right;
  z-index: 9;
}

.shadow {
  width: 10%;
  height: 100vh;
}

.pztitles {
  width: 90%;
  margin-left: 5%;
  margin-top: 10rpx;
}

.inputzone {
  width: 90%;
  margin-left: 5%;
}

.line {
  height: 2rpx;
  width: 90%;
  margin-left: 5%;
  background: rgb(220, 220, 220);
  margin-top: 30rpx;
  margin-bottom: 45rpx;
}

.checked_animation {
  background: white;
}

.checked_animation .screeningtext {
  background: white;
  border-radius: 15rpx;
  border: 0.25px solid #00a980;
  color: #00a980;

  text-align: center;
  display: block;
  font-size: 28rpx;
  height: 55rpx;
  line-height: 55rpx;
}
.pricezone {
  position: absolute;
  bottom: 45px;
  top: 0;
  left: 0;
  overflow-y: auto;
  width: 100%;
}
.butview {
  width: 100%;
  flex-direction: row;
  bottom: 0;
  left: 0;
  height: 45px;
  position: absolute;
}
.butview button {
  width: 50%;
  float: left;
  position: relative;
  display: block;
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  line-height: 45px;
  height: 45px;
  overflow: hidden;
  color: rgb(50, 50, 50);
  background-color: rgb(242, 242, 242);
  margin: 0;
  border-radius: 0;
}

.butview button:last-child {
  background:#00a980;
  color: white;
}

.slide-image {
  width: 100%;
  height: 43.2vw;
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
}
.tj {
  margin-top: 20rpx;
}
.tj .title {
  text-align: center;
  font-size: 35rpx;
  padding-bottom: 50rpx;
  font-weight: 600;
}
</style>