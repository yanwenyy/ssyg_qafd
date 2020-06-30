// pages/vip/openIndustry/openIndustry.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    industryList: [], //行业列表
    industryId: '', //行业id
    product: false, //商品弹框
    productName:'',
    productList: [],
    userInfo: null,
    productId: '', //商品id
    from:'',//來源
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      industryId: options.id || '',
      product: options.id ? true : false,
      productName:options.productName||'',
      from:options.id ? 'other' : '',
    });
    //用户选择开通行业
    app.ajax_nodata("/minitax/user/opentrade", function (res) {
      that.setData({
        industryList: res.data.data
      })
    });
    if (this.data.industryId != '') {
      app.ajax_nodata("/minitax/trade/goods/" + that.data.industryId, function (res) {
        that.setData({
          product: true,
          industryId: that.data.industryId,
          productList: res.data.data,
          productId: res.data.data[0].goodsId
        });
      })
    }
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

  hyClick: function (e) {
    var that = this;
    if (this.data.userInfo.companyId != '' && this.data.userInfo.companyId != null) {
      if (e.currentTarget.dataset.status == 1) {
        console.log(e.currentTarget.dataset)
        wx.navigateTo({
          url: '../confirmOrder/confirmOrder?productId=' + e.currentTarget.dataset.goodsid,
        })
      } else {
        app.ajax_nodata("/minitax/trade/goods/" + e.currentTarget.dataset.id, function (res) {
          that.setData({
            product: true,
            industryId: e.currentTarget.dataset.id,
            productList: res.data.data,
            productId: res.data.data[0].goodsId,
            productName:e.currentTarget.dataset.name
          });
        })
      }
    } else {
      wx.navigateTo({
        url: '../editMsg/editMsg?source=company&tradeId=' + e.currentTarget.dataset.id+"&productName="+e.currentTarget.dataset.name
      })
    }

  },

  //关闭弹窗
  closeShadow: function () {
    this.setData({
      product: false
    })
  },

  //商品确定按钮点击
  subMsg: function () {
    // wx.navigateTo({
    //   url: '../editMsg/editMsg?source=company',
    // })
    if (this.data.userInfo.companyId != '' && this.data.userInfo.companyId != null) {
      console.log(this.data.userInfo.companyId);
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder?productId=' + this.data.productId,
      })
    } else {
      wx.navigateTo({
        url: '../editMsg/editMsg?source=company&tradeId=' + this.data.industryId+"&productName="+this.data.productName
      })
    }
  },

  //商品列表点击
  productClick: function (e) {
    this.setData({
      productId: e.currentTarget.dataset.id
    })
  }
})