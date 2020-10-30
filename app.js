//app.js
App({
  onLaunch: function() {
    let _self = this;
    wx.getSystemInfo({
     success: res => {
     let modelmes = res.model;
     _self.globalData.birpx= res.windowWidth / 375;
     if (modelmes.search('iPhone X') != -1) {
      _self.globalData.isIphoneX = true;
     }
     wx.setStorageSync('modelmes', modelmes)
     }
    })
   },
  onShow: function (options) {
    // var path=options.path,
    //     ifAcspetYq=path.indexOf('acspetYq');
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.globalData.system = res;
      }
    })
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.public().url + '/wx/minilogin', //仅为示例，并非真实的接口地址
          data: {
            js_code: res.code
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            const pages = getCurrentPages()
            var currentPage = pages[pages.length-1] //获取当前页面的对象
            console.log(currentPage.route)
            var url = currentPage.route //当前页面url
            that.globalData.logMsg = res.data.data;
            var data = res.data.data;
            if (that.cookieIdReadyCallback) {
              that.cookieIdReadyCallback(res)
            }
            if (data.authorize == 0&&url.indexOf("pages/share")==-1) {
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  var system = wx.getStorageSync('system');
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        that.ajax("/wx/applet/userinfo",{
                          "encryptedData": res.encryptedData,
                          "iv": res.iv,
                          "openid": that.globalData.logMsg.taxOpenid,
                          "phone": that.globalData.logMsg.phone,
                          "rawData": res.rawData,
                          "signature": res.signature,
                          "userType": "MINITAX"
                        },function(res){
                           // 可以将 res 发送给后台解码出 unionId
                          that.globalData.userInfo = res.data.data

                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (that.userInfoReadyCallback) {
                            that.userInfoReadyCallback(res)
                          }
                        })
                       
                      }
                    })
                  }else if(url.indexOf("pages/share")==-1){
                    wx.reLaunch({
                      url: '/pages/scope/scope',
                    })
                  }
                }
              });
            } else {
              wx.reLaunch({
                url: '/pages/scope/scope',
              })
            }
          }
        })
      }
    })

  },
  globalData: {
    userInfo: null,
    logMsg: null,
    system: null,
    logMsg: '',
    token:'',
    imgUrl:'https://ssyg-xcx-img.oss-cn-beijing.aliyuncs.com/qafd',
    birpx:''
  },
  public: function () {
    var test = {
      url: 'https://test.jieshuibao.com/jsb-tax-star/',
      token_url: 'https://test.jieshuibao.com/jsb_webserver/',
      head_src: 'https://test.jieshuibao.com/jsb_webserver/showImg/head/',
      question_src: 'https://test.jieshuibao.com/jsb_webserver/showImg/question/'
    };
    var formal = {
      url: 'https://1g.jieshuibao.com',
      token_url: 'https://api.jieshuibao.com/',
      head_src: 'https://api.jieshuibao.com/showImg/head/',
      question_src: 'https://api.jieshuibao.com/showImg/question/'
    }
    return test;
  },
  //ajax
  ajax: function (url, data, succ) {
    wx.request({
      url: this.public().url + url, //仅为示例，并非真实的接口地址
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.logMsg.cookieId
      },
      success(res) {
        succ(res)
      }
    })
  },
  ajax_nodata: function (url, succ) {
    wx.request({
      url: this.public().url + url, //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.logMsg.cookieId
      },
      success(res) {
        succ(res)
      }
    })
  },
  ajax_get: function (url, succ) {
    wx.request({
      url: this.public().url + url, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.logMsg.cookieId
      },
      success(res) {
        succ(res)
      }
    })
  },
  getToken: function () {
    var that = this;
    wx.request({
      url: this.public().token_url + "/app/accessToken/third", //仅为示例，并非真实的接口地址
      data: {
        "appid": "gwb",
        "secret": "4f6f9adefc52b88458c6bc08f98d0601"
      },
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.logMsg.cookieId
      },
      success(res) {
        that.globalData.token = res.data.token;
      }
    })
  },
  ajax_wzx: function (url, data, succ) {
    wx.request({
      url: this.public().token_url + url, //仅为示例，并非真实的接口地址
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'token': this.globalData.token,
      },
      success(res) {
        succ(res)
      }
    })
  },
  //获取用户信息
  getUser:function(succ){
    wx.getUserInfo({
      success: res => {
        this.ajax("/wx/applet/userinfo",{
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": this.globalData.logMsg.taxOpenid,
          "phone": this.globalData.logMsg.phone,
          "rawData": res.rawData,
          "signature": res.signature,
          "userType": "MINITAX"
        },function(res){
          succ(res)
        })
      }
    })
  },

   //时间戳转换
   add0: function (m) {
    return m < 10 ? '0' + m : m
  },
  format: function (shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d);
  },

  //去除数组里某项
  indexOf: function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) return i;
    }
    return -1;
  },
  remove: function (arr, val) {
    var index = this.indexOf(arr, val);
    if (index > -1) {
      arr.splice(index, 1);
    }
  },

  //是否是会员
  ifVip:function(data){
    if(data){
      wx.showModal({
        confirmText: '立即开通',
        content: '您还不是VIP开通后解锁全部权限',
        // showCancel:false,
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/vip/vip',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }else{
      return true;
    }
  },

  //去个人中心页
  goPerson:function(id){
    if(id&&id!=''){
      wx.navigateTo({
        url: '/pages/mine/minePage/minePage?id=' +id,
      })
    }
  }
})