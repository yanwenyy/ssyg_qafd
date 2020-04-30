// pages/liveAnswer/liveAnswerContent/liveAnswerContent.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    detail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id:options.id
    })

    app.ajax("/minitax/broadacast/details",{
      "id": that.data.id,
    },function(res){
      that.setData({
        detail:res.data.data
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

  //预约按钮点击
  yuClick:function(){
    var that=this;
    app.ajax("/minitax/broadacast/book",{
      id:that.data.id
    },function(res){
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    })
  }
})