// pages/industry/industryZCGJ/industryDZ/industryDZ.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    id: '', //业务id
    type: '', //类型
    start: 1, //起始页
    num: 10, //每页显示条数
    status: true, //是否还有数据
    list: [], //政策列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      type: options.type
    })

    var data = that.data;
    that.getList(data.start, data.num, data.id, data.type)
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
    var that = this;
    if (this.data.status == true) {
      var start = this.data.start + 1
      this.setData({
        start: this.data.start
      });
      //列表数据
      var data = that.data;
      that.getList(data.start, data.num, data.id, data.type)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取数据
  getList: function (current, pageSize, id, type) {
    var that = this;
    app.ajax("/minitax/praiselist", {
      "current": current,
      "pageSize": pageSize,
      "id": id,
      "type": type
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          datas[i].identity=datas[i].identity.split(",");
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

   //去个人中心
   goPages: function (e) {
    wx.navigateTo({
      url: '../../../mine/minePage/minePage?id=' + e.currentTarget.dataset.id,
    })
  },
})