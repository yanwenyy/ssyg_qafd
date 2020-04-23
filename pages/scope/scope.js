// pages/scope/scope.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户信息
    hasUserInfo: false,
    phone:'',//用户手机号
    scope:true,//用户授权信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
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

  //获取用户信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      scope:false
    })
  },

  //授权手机号
  getPhoneNumber(e) {
    var that=this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        app.ajax("/wx/authorize",{
            "encryptedData": res.encryptedData,
            "iv": res.iv,
            "openid": app.globalData.logMsg.authorize==1?app.globalData.logMsg.openid:app.globalData.logMsg.taxOpenid,
            "rawData": res.rawData,
            "signature": res.signature,
            "phoneEncryptedData":e.detail.encryptedData,
            "phoneIv":e.detail.iv,
            "userType":'MINITAX'
        },function(res){
          if(res.data.code==10000){
            app.globalData.userInfo = res.data.data;
            app.globalData.logMsg=res.data.data;
            // if (app.userInfoReadyCallback) {
            //   app.userInfoReadyCallback(res)
            // }
            wx.reLaunch({
              url: '../index/index',
            })
          }
        })
      }
    })
  },
})