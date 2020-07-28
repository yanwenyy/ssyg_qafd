// pages/share/acspetYq/acspetYq.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userId: '', //邀请人的uuid
    msg: {}, //用户信息
    yqUserInfo: null, //邀请者的信息
    userInfo: {},
    hasUserInfo: false,
    logMsg: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scope: true,
    getPhoneBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userId: options.uuid
    });
    app.cookieIdReadyCallback = res => {
      that.setData({
        logMsg: res.data.data
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            if (that.data.logMsg.phone != '' && that.data.logMsg.phone != null) {
              that.data.getPhoneBtn = false;
              that.data.hasUserInfo = true;
            } else {
              that.data.getPhoneBtn = true;
              that.data.hasUserInfo = false;
            }
            that.setData({
              scope: false,
              getPhoneBtn: that.data.getPhoneBtn,
              hasUserInfo: that.data.hasUserInfo
            })
          }
        }
      });
    }



    //展示邀请者信息
    app.ajax("/yaoqing/joinStateionShow", {
      "userId": that.data.userId
    }, function (res) {
      that.setData({
        yqUserInfo: res.data.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goAccept: function () {
    var that=this;
    app.ajax("/yaoqing/joinStateion", {
      "userId": this.data.userId,
      "openid": app.globalData.logMsg.openid
    }, function (res) {
      if (res.data.code == 10000) {
        wx.navigateTo({
          url: '../yqts/yqts?company='+that.data.yqUserInfo.companyName,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  //获取用户信息
  getUserInfo: function (e) {
    var that = this;
    console.log(e.detail.userInfo);
    if (e.detail.userInfo != undefined) {
      this.setData({
        scope: false,
        getPhoneBtn: true,
        userInfo: e.detail.userInfo,
      })
    }
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
            "openid": that.data.logMsg.authorize==1?that.data.logMsg.openid:that.data.logMsg.taxOpenid,
            "rawData": res.rawData,
            "signature": res.signature,
            "phoneEncryptedData":e.detail.encryptedData,
            "phoneIv":e.detail.iv,
            "userType":'MINITAX'
        }, function (res) {
          if (res.data.code == 10000) {
            app.globalData.userInfo = res.data.data;
            that.setData({
              userInfo: res.data.data,
              hasUserInfo: true,
              getPhoneBtn: false
            })
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

  //直接去首页按钮
  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})