// pages/industry/industryChange/industryChange.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],//已开通行业
    itemsno:[],//未开通行业
    selectId:'',//已选择的行业
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that=this;
    //已开通行业
    app.ajax_nodata('/minitax/trade/open',function(res){
      that.setData({
        items:res.data.data
      })
    });

    //未开通行业
    app.ajax_nodata('/minitax/trade/no/open',function(res){
      that.setData({
        itemsno:res.data.data
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

  //行业改变
  openChange:function(e){
    console.log(e.detail.value);
    this.setData({
      selectId:e.detail.value
    })
  },

  subMsg:function(){
    if(this.data.selectId==''){
      wx.navigateBack();
    }else{
      app.ajax_nodata("/minitax/trade/custome/"+this.data.selectId,function(res){
       if(res.data.code==10000){
        wx.navigateBack();
       }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
       }
      })
    }
  }
})