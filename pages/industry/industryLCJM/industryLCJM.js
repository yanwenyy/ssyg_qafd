// pages/industry/industryLCJM/industryLCJM.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    var that = this;
    //获取行业信息
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        tradeId: res.data.data.tradeId
      });
      var data = that.data;
      that.getList(data.start, data.num, data.tradeId)
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
    if (this.data.status == true) {
      var start = this.data.start + 1
      this.setData({
        start: start
      });
      var data = this.data;
      this.getList(data.start, data.num, data.tradeId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取列表
  getList: function (current, pageSize, tradeId) {
    var that = this;
    app.ajax('/minitax/process/list', {
      "current": current,
      "pageSize": pageSize,
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

  //去详情页面
  goContent: function (e) {
    var target = e.currentTarget.dataset;
    app.ajax("/minitax/process/detailse", {
      "id": target.id,
    }, function (res) {
      var data = res.data.data;
      if (app.ifVip(data.isVip != 1 && data.tradePower ==0&&data.self==0)) {
        wx.navigateTo({
          url: 'LCJMcontent/LCJMcontent?id=' + target.id,
        })
      }
    });
  }
})