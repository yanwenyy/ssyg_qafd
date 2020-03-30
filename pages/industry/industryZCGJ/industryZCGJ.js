// pages/industry/industryZCGJ/industryZCGJ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: null,
    navText:'税种',//导航选中文字
    navSel:false,//导航选择框显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  //滚动条监听
  scroll: function (e) {
    this.setData({ scrollTop: e.detail.scrollTop })
  },

  //导航点击事件
  navClick:function(e){
    this.setData({
      scrollTop: 141,
      navText:e.currentTarget.dataset.txt,
      navSel:true
    })
  },

  //导航筛选点击
  navOptClick:function(){
    this.setData({
      scrollTop: 139,
      navSel:false
    });
  },
  
  //政策列表点击
  zcClick:function(){
    wx.navigateTo({
      url: 'policyContent/policyContent',
    })
  }
})