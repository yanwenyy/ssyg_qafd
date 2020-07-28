// components/scope/scope.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userInfo: {},//用户信息
    hasUserInfo: false,
    phone: '',//用户手机号
    scope: true,//用户授权信息
  },
  ready: function () {
    wx.hideHomeButton();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取用户信息
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        scope: false
      })
    },

    //授权手机号
    getPhoneNumber(e) {
      var that = this;
      console.log(e.detail.errMsg)
      console.log(e.detail.iv)
      console.log(e.detail.encryptedData);
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          app.ajax("/wx/authorize", {
            "encryptedData": res.encryptedData,
            "iv": res.iv,
            "openid": app.globalData.logMsg.authorize == 1 ? app.globalData.logMsg.openid : app.globalData.logMsg.taxOpenid,
            "rawData": res.rawData,
            "signature": res.signature,
            "phoneEncryptedData": e.detail.encryptedData,
            "phoneIv": e.detail.iv,
            "userType": 'MINITAX'
          }, function (res) {
            if (res.data.code == 10000) {
              app.globalData.userInfo = res.data.data;
              app.globalData.logMsg = res.data.data;
              var myEventDetail = {} // detail对象，提供给事件监听函数
              var myEventOption = {} // 触发事件的选项
              that.triggerEvent('myevent', myEventDetail, myEventOption)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    },
  }
})
