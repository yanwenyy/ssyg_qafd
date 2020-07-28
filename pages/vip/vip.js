// pages/vip/vip.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    sq_btn: false, //授权信息
    pn_btn: false, //获取手机号后开通
    kt_btn: false, //授权过的开通按钮
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentItemId:1,
    industryIndex:null,//定制行业信息
    industryList:[],//用户选择开通行业列表
    industryId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      console.log(1);
      this.setData({
        userInfo: app.globalData.userInfo,
        sq_btn: false,
        pn_btn: false,
        kt_btn: true,
      })
      that.getMsg();
    } else if (this.data.canIUse) {
      console.log(2);
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.getMsg();
        if (res.data.data.phone != '' && res.data.data.phone != null) {
          this.setData({
            userInfo: res.data.data,
            sq_btn: false,
            pn_btn: false,
            kt_btn: true,
          });
        } else {
          this.setData({
            userInfo: res.data.data,
            sq_btn: true,
            pn_btn: false,
            kt_btn: false,
          });
        }
      }
    } else {
      console.log(3);
      // 在没有 open-type=getUserInfo 版本的兼容处理
      app.userInfoReadyCallback = res => {
        that.getMsg();
        if (res.data.data.phone != '' && res.data.data.phone != null) {
          this.setData({
            userInfo: res.data.data,
            sq_btn: false,
            pn_btn: false,
            kt_btn: true,
          });
        } else {
          this.setData({
            userInfo: res.data.data,
            sq_btn: true,
            pn_btn: false,
            kt_btn: false,
          });
        }
      }
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

  //获取用户信息按钮点击
  getUserInfo: function () {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      sq_btn: false,
      pn_btn: true,
      kt_btn: false,
    })
  },

  //授权手机号
  getPhoneNumber(e) {
    var that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        app.ajax("/wx/authorize", {
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": app.globalData.logMsg.authorize == 1 ? app.globalData.logMsg.openid : app.globalData.logMsg.taxOpenid,
          "rawData": res.rawData,
          "signature": res.signature,
          "phoneEncryptedData": e.detail.encryptedData,
          "phoneIv": e.detail.iv,
          "userType": 'MINITAX'
        }, function (res) {
          if (res.data.code == 10000) {
            wx.navigateTo({
              url: 'openIndustry/openIndustry',
            })
          }
        })
      }
    })
  },

  //授权过的开通按钮点击
  commenKt:function(){
    wx.navigateTo({
      url: 'openIndustry/openIndustry',
    })
  },

  swiperChange:function(e){
    var currentItemId = e.detail.currentItemId;
    this.setData({
      currentItemId:currentItemId
    })
  },
  clickChange:function(e){
    var itemId = e.currentTarget.dataset.itemId;
    this.setData({
      currentItemId: itemId
    })
  },

  //初始化数据
  getMsg:function(){
    var that=this;
     //定制行业信息
     app.ajax_nodata("/minitax/trade/user",function(res){
      that.setData({
        industryIndex:res.data.data
      })
    });

    //用户选择开通行业
    app.ajax_nodata("/minitax/user/opentrade",function(res){
      var data=res.data.data;
      that.setData({
        industryList:data,
        currentItemId:data.length>1?1:0
      })
    });
  },

  //开通行业列表按钮点击
  ktClick:function(e){
    var target=e.currentTarget.dataset;
    if (this.data.userInfo.companyId != '' && this.data.userInfo.companyId != null) {
      if(Number(target.ifvip)==1){
        wx.navigateTo({
          url: 'confirmOrder/confirmOrder?productId='+target.goodid,
        })
      }else{
        wx.navigateTo({
          url: 'openIndustry/openIndustry?id='+target.id+"&productName="+target.name,
        })
      }
    } else {
      wx.navigateTo({
        url: 'editMsg/editMsg?source=company&tradeId=' + target.id+"&productName="+target.name,
      })
    }
    
  }
})