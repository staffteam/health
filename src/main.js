import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://old.szyinghe.net';
var head = 'https://old.szyinghe.net/Healthsmallpro';
var config = {
  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    barcodeSearch:`${host}/drugs/barcodeSearch`,
    searchCode:`${head}/drugs/searchCode`,
    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,
    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,
    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,
    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,
    //首页排行榜 top10
    GetLeaderboard: `${head}/drugs/GetLeaderboard`,
    //产品搜索
    goodsSearch: `${head}/drugs/goodsSearch`,
    //扫码查询
    barcodeSearch: `${head}/drugs/barcodeSearch`,
    //产品详情
    goodsDetail: `${head}/drugs/goodsDetail`,
    //提交意见
    suggest: `${head}/weixinUser/suggest`,
    //我的消息
    searchMyMessage: `${head}/weixinUser/searchMyMessage`,
    //消息状态修改
    updateMyRecordStatus: `${head}/weixinUser/updateMyRecordStatus`,
    //关于我们
    aboutUs: `${head}/weixinUser/aboutUs`,
    //我的搜索记录
    searchMyRecord: `${head}/weixinUser/searchMyRecord`,
    //删除搜索记录
    deleteMyRecord: `${head}/weixinUser/deleteMyRecord`,
    //未读消息条数
    searchUnreadMessage: `${head}/weixinUser/searchUnreadMessage`,
    //登录
    login: `${head}/weixinUser/login`,
    //登录状态判断
    timeout: `${head}/weixinUser/timeout`
  }
};

Vue.prototype.config = config;

var api = 'https://health.szyinghe.net/index.php/api';
var imgHost = 'https://health.szyinghe.net';
Vue.prototype.$api = api;
Vue.prototype.$imgHost = imgHost;
let getInfo = (e, fn) => {
  if (e.detail.userInfo) {
    //用户按了允许授权按钮
    mpvue.showLoading({
      title: "正在登录"
    });
    mpvue.login({
      success: function (res) {
        if (res.code) {
          // 发起网络请求
          let _code = res.code;
          let _userInfo = e.detail.userInfo;
          mpvue.request({
            url: `${api}/member/login`,
            method: "POST",
            data: {
              "code": res.code,
              nickname:_userInfo.nickName,
              sex:_userInfo.gender==1?'男':'女',
              img:_userInfo.avatarUrl,
            },
            success: function (success) {
              if (success.data.code == 1) {
                mpvue.getSetting({
                  success(res) {
                    console.log('res', res.authSetting);
                    mpvue.getUserInfo({
                      success: function (res) {
                        mpvue.hideLoading();
                        mpvue.showToast({
                          title: "登录成功",
                          icon: "success",
                          duration: 2000
                        });
                        if (fn) {
                          fn(e.detail.userInfo)
                        };
                        var userInfo = res.userInfo
                        var nickNames = userInfo.nickName
                        var avatarUrls = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country
                        mpvue.setStorageSync('loginCode', _code)
                        mpvue.setStorageSync('nickName', nickNames)
                        mpvue.setStorageSync('avatarUrl', avatarUrls)
                        //保存数据
                        mpvue.setStorageSync('sessionId', success.data.data.sessionId)
                        mpvue.setStorageSync('userId', success.data.data.userId)
                        console.log('request登录成功！' + success.data.data)
                        mpvue.navigateBack({
                          delta: 1
                        })
                      }
                    })
                  }
                })
              } else {
                mpvue.showToast({
                  title: success.data.data,
                  icon: "none",
                  duration: 2000
                });
              }
            },
            fail: function (fail) {
              // debugger
              mpvue.showToast({
                title: "网络发生异常！",
                icon: "none",
                duration: 2000
              });
              mpvue.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          mpvue.showToast({
            title: "网络发生异常！",
            icon: "none",
            duration: 2000
          });
          mpvue.navigateBack({
            delta: 1
          })
        }
      }
    })
  } else {
    //用户按了拒绝按钮
    mpvue.navigateBack({
      delta: 1
    })
  }
}
// 查看是否授权
mpvue.getSetting({
  success: function (res) {
    if (res.authSetting['scope.userInfo']) {
      mpvue.getUserInfo({
        success: function (res) {
          //用户已经授权过
          if (!mpvue.getStorageSync("sessionId")) {
            getInfo({
              detail: {
                userInfo: res.userInfo
              }
            });
          }
        }
      })
    }
  }
})
Vue.prototype.getInfo = getInfo;
const app = new Vue(App)
app.$mount()
