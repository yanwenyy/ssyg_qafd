//app.js
App({
  onShow: function () {
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
            that.globalData.logMsg = res.data.data;
            var data = res.data.data;
            if (that.cookieIdReadyCallback) {
              that.cookieIdReadyCallback(res)
            }
            if (data.authorize == 0) {
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
                  }else{
                    wx.reLaunch({
                      url: '../scope/scope',
                    })
                  }
                }
              });
            } else {
              wx.reLaunch({
                url: '../scope/scope',
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
    token:''
  },
  public: function () {
    var test = {
      url: 'https://test.jieshuibao.com/jsb_applet/',
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
    return test
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
})