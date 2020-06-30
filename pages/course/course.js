// pages/course/course.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradeId: '', //行业id
    start: 1, //起始页
    num: 10, //每页显示条数
    status: true, //是否还有数据
    list: [], //政策列表
    content:'',//搜索内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //用户当前定制的行业
    app.ajax_nodata("/minitax/select/trade", function (res) {
     that.setData({
       tradeId: res.data.data.tradeId
     })
     //列表数据
     var data=that.data;
     that.getList(data.start,data.num,data.tradeId,data.content)
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
      var start = this.data.start + 1
      this.setData({
        start: start
      });
      //列表数据
      var data=that.data;
      that.getList(data.start,data.num,data.tradeId,data.content)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

   //获取数据
   getList: function (current, pageSize, tradeId,content) {
    var that=this;
    app.ajax("/minitax/goodclass/list", {
      "current": current,
      "pageSize": pageSize,
      "tradeId": tradeId,
      "content":content
    }, function (res) {
      var datas=res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          datas[i].title=datas[i].title.length>16?datas[i].title.slice(0,16)+"...":datas[i].title
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

  //去精选好课内容
  goContent:function(e){
    wx.navigateTo({
      url: 'coursContent/coursContent?id='+e.currentTarget.dataset.id
    })
  },

   //输入框输入
   inputClick:function(e){
    this.setData({
      content:e.detail.value
    })
  },

  //搜索按钮点击
  searchClick:function(){
    this.setData({
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [], //政策列表
    })
    var data=this.data;
    this.getList(data.start,data.num,data.tradeId,data.content)
  },
})