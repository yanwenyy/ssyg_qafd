// pages/industry/industrySSCH/industrySSCH.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[],//tab列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //tab分类
    app.ajax_nodata("/minitax/attribute/list/2",function(res){
      that.setData({
        tabList:res.data.data
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

  //列表点击
  listClick:function(){
    wx.navigateTo({
      url: 'SSCHcontent/SSCHcontent',
    })
  }
})