// pages/vip/editMsg/editMsg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userInfo: {},
    company: true, //企业用户
    personal: false, //个人用户
    tryVip: false, //试用领取
    source: '', //来源
    companyName: '',
    userName: '',
    region: ['北京市', '北京市', '东城区'], //地区
    industry: [], //行业
    industryindex: -1, //公司行业下标
    personalIndustryindex: -1, //个人行业下标
    companyNature: [], //公司性质
    companyNatureIndex: -1, //公司性质下标
    companyScalee: [], //规模
    companyScaleeIndex: -1, //规模下标
    post: [], //职务
    postIndex: -1, //职务下标
    userInfo: {},
    must: '',
    productId:'',//行业id
    productName:'',//行业名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getUser(function (res) {
      var data = res.data.data;
      that.setData({
        userInfo: data,
        tradeId:options.tradeId,
        productName:options.productName
      });
    })
    if (options.must == 1) {
      wx.hideHomeButton();
      this.setData({
        must: options.must
      })
    }
    this.setData({
      source: options.source,
      companyName: options.name != null && options.name != 'null' ? options.name : null
    });
    if (options.source == "company" || options.source == "tryVip") {
      this.setData({
        company: true,
        personal: false,
        // tryVip:false
      });
    } else {
      this.setData({
        personal: true,
        company: false,
        tryVip: false
      });
    };

    //行业
    app.ajax_nodata("/applet/getTrade", function (res) {
      that.setData({
        industry: res.data.data
      })
    });

    //公司性质
    app.ajax("/applet/getSysCode", {
      "category": "3"
    }, function (res) {
      that.setData({
        companyNature: res.data.data
      })
    });

    //规模
    app.ajax("/applet/getSysCode", {
      "category": "2"
    }, function (res) {
      that.setData({
        companyScalee: res.data.data
      })
    });

    //职务
    app.ajax("/applet/getSysCode", {
      "category": "1"
    }, function (res) {
      that.setData({
        post: res.data.data
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

  //地区选择
  bindRegionChange: function (e) {
    if (e.detail.value[0] == "北京市" || e.detail.value[0] == "上海市" || e.detail.value[0] == "天津市" || e.detail.value[0] == "重庆市") {
      e.detail.value[0] = e.detail.value[0].split("市")[0];
      e.detail.value[1] = e.detail.value[1].split("市")[0];
    } else {
      e.detail.value[0] = e.detail.value[0].split("省")[0];
      e.detail.value[1] = e.detail.value[1].split("市")[0];
    }
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //行业选择器
  industryChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      industryindex: e.detail.value
    })
  },

  //个人行业选择
  personalIndustryChange: function (e) {
    this.setData({
      personalIndustryindex: e.detail.value
    })
  },

  //职务选择
  postChange: function (e) {
    this.setData({
      postIndex: e.detail.value
    })
  },

  //规模选择
  companyScaleeChange: function (e) {
    this.setData({
      companyScaleeIndex: e.detail.value
    })
  },

  //公司性质选择
  companyNatureChange: function (e) {
    this.setData({
      companyNatureIndex: e.detail.value
    })
  },

  //公司姓名
  companyNameInput: function (e) {
    this.setData({
      companyName: e.detail.value
    })
  },

  //用户昵称
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  //确定按钮点击
  subMsg: function () {
    var that = this;
    // wx.navigateTo({
    //   url: '../confirmOrder/confirmOrder',
    // })
    var that = this,
      data = this.data;
    if (data.companyName != '' && data.companyNatureIndex > -1 && data.companyScaleeIndex > -1 && data.industryindex > -1 && data.userName != '' && data.personalIndustryindex > -1 && data.postIndex > -1 && data.personalIndustryindex > -1 && data.userName != '') {
      app.ajax("/applet/compay/add", {
        "ePCompanyName": data.companyName,
        "ePCompanyNature": data.companyNature[data.companyNatureIndex].uuid,
        "ePcity": data.region[1],
        "ePprovince": data.region[0],
        "ePtrade": data.industry[data.industryindex].tradeId,
        "epCompanyScale": data.companyScalee[data.companyScaleeIndex].uuid,
        "positiotn": data.post[data.postIndex].uuid,
        "realName": data.userName,
        "trades": "," + data.industry[data.personalIndustryindex].tradeId + ",",
      }, function (res) {
        if (res.data.code == 10000) {
          app.getUser(function (res) {
            app.globalData.userInfo = res.data.data;
            wx.redirectTo({
              url: '../openIndustry/openIndustry?id='+that.data.tradeId+"&productName="+that.data.productName,
            })
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 2000
      })
    }
  }
})