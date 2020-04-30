// pages/industry/industryZCGJ/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    start: 1, //起始页
    num: 5, //每页显示条数
    status: true, //是否还有数据
    list: [], //政策列表
    tradeId: '', //行业id
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
    var that = this;
    //获取头部行业信息
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        tradeId: res.data.data.tradeId
      })
    })
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
      this.setData({
        start: this.data.start + 1
      });
      var data = this.data;
      this.getList(data.start, data.num, data.content, data.tradeId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取列表
  getList: function (current, pageSize, content, tradeId) {
    var that = this;
    app.ajax('/minitax/policy/list', {
      "current": current,
      "pageSize": pageSize,
      "content": content,
      "tradeId": tradeId,
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

  //输入框输入
  inputClick: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  //搜索按钮点击
  searchClick: function () {
    this.setData({
      start: 1, //起始页
      num: 5, //每页显示条数
      status: true, //是否还有数据
      list: [], //政策列表
    })
    var data = this.data;
    this.getList(data.start, data.num, data.content, data.tradeId)
  },

  //政策列表点击
  goContent: function (e) {
    wx.navigateTo({
      url: '../policyContent/policyContent?policyId=' + e.currentTarget.dataset.id,
    })
  }
})