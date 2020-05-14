// pages/mine/mineCollection/mineCollection.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMsg: '全部',
    type: '',
    list: [],
    start: 1,
    num: 10,
    status: true,
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
    this.setData({
      list: [],
      start: 1,
      num: 10,
      status: true,
    })
    this.getList(this.data.start, this.data.num, this.data.type)
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
    if (this.data.status == true) {
      var start = this.data.start + 1
      this.setData({
        start: start
      });
      this.getList(this.data.start, this.data.num, this.data.type)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //tab点击
  tabClick: function (e) {
    this.setData({
      tabMsg: e.currentTarget.dataset.msg,
      type: e.currentTarget.dataset.type,
      list: [],
      start: 1,
      num: 10,
      status: true,
    });
    this.getList(this.data.start, this.data.num, this.data.type)
  },

  //获取列表
  getList: function (current, pageSize, type) {
    var that = this;
    app.ajax("/minitax/collect/list", {
      "current": current,
      "pageSize": pageSize,
      "type": type
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          list_change.push(datas[i])
        }
        that.setData({
          list: list_change
        });
      } else {
        that.setData({
          status: false
        })
      }
    })
  },

  //列表点击
  listClick: function (e) {
    var target = e.currentTarget.dataset;
    var id = target.id,
      type = target.type;
    console.log(type);
    switch (type) {
      case '1':
        wx.navigateTo({
          url: '../../industry/industryZCGJ/policyContent/policyContent?policyId=' + id,
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../../industry/industryZCGJ/XGJDcontent/XGJDcontent?id=' + id,
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../../industry/industryFXTS/FXTScontent/FXTScontent?id=' + id,
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../../industry/industrySSCH/SSCHcontent/SSCHcontent?id=' + id,
        })
        break;
      case '5':
        wx.navigateTo({
          url: '../../industry/industryLCJM/LCJMcontent/LCJMcontent?id=' + id,
        })
        break;
      case '6':
        console.log(111);
        wx.navigateTo({
          url: '../../newCenter/newContent/newContent?id=' + id,
        })
        break;
      case '7':
        wx.navigateTo({
          url: '../../course/coursContent/coursContent?id=' + id,
        })
        break;
      case '8':
        wx.navigateTo({
          url: '../../liveAnswer/liveAnswerContent/liveAnswerContent?id=' + id,
        })
        break;
    }
  }
})