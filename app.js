//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.public().url+'/wx/minilogin', //仅为示例，并非真实的接口地址
          data: {
            js_code: res.code
          },
          method:"POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            that.globalData.logMsg = res.data.data;
            console.log(that.globalData.logMsg)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    
  },
  globalData: {
    userInfo: null,
    logMsg:null
  },
  public:function(){
    var test={
      url: 'https://test.jieshuibao.com/jsb_applet/',
      token_url:'https://test.jieshuibao.com/jsb_webserver/',
      head_src: 'https://test.jieshuibao.com/jsb_webserver/showImg/head/',
      question_src:'https://test.jieshuibao.com/jsb_webserver/showImg/question/'
    };
    var formal={
      url:'https://1g.jieshuibao.com',
      token_url: 'https://api.jieshuibao.com/',
      head_src: 'https://api.jieshuibao.com/showImg/head/',
      question_src: 'https://api.jieshuibao.com/showImg/question/'
    }
    return test
  },
  //ajax
  ajax: function (url,data,succ){
    wx.request({
      url: this.puplic().url + url, //仅为示例，并非真实的接口地址
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
      url: this.puplic().url + url, //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.cookieId
      },
      success(res) {
        succ(res)
      }
    })
  },
})