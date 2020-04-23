// pages/vip/confirmOrder/confirmOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: '', //来源
    productId: '', //商品id
    goodsInfo: null, //商品信息
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      productId: options.productId,
      userInfo: app.globalData.userInfo
    })
    app.ajax("/minitax/trade/goods", {
      "goodsId": this.data.productId
    }, function (res) {
      that.setData({
        goodsInfo: res.data.data
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
    if (this.data.source == 'coupon') {
      wx.navigateBack({
        delta: 2
      })
    }
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

  //去优惠券页面
  goCoupon: function () {
    wx.redirectTo({
      url: '../coupon/coupon',
    })
  },

  //去支付点击
  goPay: function () {
    var that = this;
    app.ajax_nodata("/minitax/pay/goods/" + that.data.goodsInfo.confirmId, function (res) {
      var datas=res.data.data;
      wx.requestPayment({
        timeStamp: datas.timeStamp,
        nonceStr: datas.nonceStr,
        package: datas.packageValue,
        signType: datas.signType,
        paySign: datas.paySign,
        success(res) {
          console.log("支付成功了");
          wx.reLaunch({
            url: '../../index/index',
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    })
  }
})