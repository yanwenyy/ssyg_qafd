// pages/industry/industryZCGJ/policyContent/policyContent.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navText:'政策',
    scrollTopscrollTop:0,
    policyContent:null,//政策详情
    policyId:'',//政策id
    releatfile:[],//相关文件
    releatedetails:[],//相关解读
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      policyId:options.policyId
    })
    
    //政策详情
    app.ajax("/minitax/policy/details",{
      "policyId": this.data.policyId,
    },function(res){
      that.setData({
        policyContent:res.data.data
      })
    });

    //相关文件
    app.ajax("/minitax/policy/releatfile",{
      "policyId": this.data.policyId,
      "current": 0,
      "pageSize": 1000,
    },function(res){
      that.setData({
        releatfile:res.data.data
      })
    });

     //相关解读
     app.ajax("/minitax/policy/expert",{
      "policyId": this.data.policyId,
      "current": 0,
      "pageSize": 1000,
    },function(res){
      that.setData({
        releatedetails:res.data.data
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

  onPageScroll: function(e) {
    // 页面滚动时执行
    // console.log(e.scrollTop);
    this.setData({
      scrollTop:e.scrollTop
    })
  },

  //锚点切换部分的功能实现
  navClick(e){
    this.setData({
      navText:e.currentTarget.dataset.text
    })
    wx.pageScrollTo({
      selector: ".v"+e.currentTarget.dataset.code,
      duration: 300
    })
  },

  //查看点赞列表
  lookDZlist:function(){
    wx.navigateTo({
      url: '../industryDZ/industryDZ',
    })
  }
})