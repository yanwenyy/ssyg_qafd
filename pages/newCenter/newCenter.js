// pages/newCenter/newCenter.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[],//tab列表
    tabMsg:'全部',
    attributeid:null,//属性id
    tradeId: '', //行业id
    start: 1, //起始页
    num: 5, //每页显示条数
    status: true, //是否还有数据
    list: [], //政策列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //tab分类
    app.ajax_nodata("/minitax/attribute/list/3",function(res){
      that.setData({
        tabList:res.data.data
      })
    });

      //用户当前定制的行业
      app.ajax_nodata("/minitax/select/trade", function (res) {
        that.setData({
          tradeId: res.data.data.tradeId
        })
        //列表数据
        var data=that.data;
        that.getList(data.attributeid,data.start,data.num,data.tradeId)
      });
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
    var that=this;
    if (this.data.status == true) {
      var num = this.data.num + 1
      this.setData({
        num: num,
        start: ((num - 1) * 10) + 1,
        end: num * 10
      });
      //列表数据
      var data=that.data;
      that.getList(data.attributeid,data.start,data.num,data.tradeId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getList: function (attributeid, current, pageSize, tradeId) {
    var that=this;
    app.ajax("/minitax/newcenter/list", {
      "attributeid": attributeid,
      "current": current,
      "pageSize": pageSize,
      "tradeId": tradeId
    }, function (res) {
      var datas=res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          list_change.push(datas[i])
        }
        that.setData({
          list: list_change
        });
      }else{
        that.setData({
          status: false
        })
      }
    })
  },

   //tab点击
   tabClick:function(e){
    var that=this;
    this.setData({
      tabMsg:e.currentTarget.dataset.msg,
      attributeid:e.currentTarget.dataset.id,
      start:1,
      num:5,
      status:true,
      list:[]
    })
    //列表数据
    var data=that.data;
    that.getList(data.attributeid,data.start,data.num,data.tradeId)
  },

  //列表点击
  listClick:function(e){
    wx.navigateTo({
      url: 'newContent/newContent?id='+e.currentTarget.dataset.id
    })
  } 
})