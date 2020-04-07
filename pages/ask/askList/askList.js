// pages/ask/askList/askList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMsg: '企业咨询',
    timer: null,
    systimestamp: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var time = new Date().getTime();
    that.setData({
      systimestamp: time
    })
    //调用函数开始计时
    this.data.timer = setInterval(function () {
      var time = new Date().getTime();
      that.setData({
        systimestamp: time
      })
    }, 1000)
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
    this.data.timer = null;
    clearInterval(this.data.timer)
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

  //问答规则点击
  ruleClick:function(){
    wx.navigateTo({
      url: '../askRule/askRule',
    })
  }
})