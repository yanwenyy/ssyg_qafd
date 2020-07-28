// pages/mine/mineMsg/mineMsg.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userInfo:'',
    region: [],//地区
    industry: [],//行业
    industrySelName:[],//行业选中数组id
    industrySelId: [], //行业选中数组name
    personalIndustryindex: -1,//个人行业下标
    post: [],//职务
    postName:'',//职务名字
    postId:'',//职务id
    postIndex: -1,//职务下标
    shadow:false,
    shadowHy:false,
    shadowZw: false,
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
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.ajax("/wx/applet/userinfo", {
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": app.globalData.logMsg.openid,
          "phone": app.globalData.logMsg.phone,
          "rawData": res.rawData,
          "signature": res.signature,
          "userType":'MINITAX'
        }, function (data) {
          var data = data.data.data;
          // if (data.trade){
          //   var industrySelName = that.data.industrySelName;
          //   industrySelName.push(data.trade)
          // }
          that.setData({
            userInfo: data,
            region: [data.province || '', data.city || ''],
            postName: data.positiotn || '',
            // industrySelName: industrySelName
          });
        })
      }
    })

    //行业
    app.ajax_nodata("/applet/getTrade", function (res) {
      that.setData({
        industry: res.data.data
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
    var region = e.detail.value
    console.log('picker发送选择改变，携带值为', e.detail.value);
    if (region[0] == "北京市" || region[0] == "上海市" || region[0] == "天津市" || region[0] == "重庆市") {
      region[0] = region[0].split("市")[0];
      region[1] = region[1].split("市")[0];
    } else {
      region[0] = region[0].split("省")[0];
      region[1] = region[1].split("市")[0];
    }
    this.setData({
      region: region
    })
  },

  //个人行业选择
  personalIndustryChange: function (e) {
    this.data.userInfo.trade=null;
    this.setData({
      personalIndustryindex: e.detail.value
    })
  },

  //职务选择
  postChange: function (e) {
    this.data.userInfo.positiotn = null;
    this.setData({
      postIndex: e.detail.value
    })
  },

  //真实姓名输入
  realNameInput:function(e){
    this.data.userInfo.realName = e.detail.value;
  },

  //公司名称输入
  companyNameInput: function (e) {
    wx.showToast({
      title: '只有管理员可以编辑公司名称',
      icon: 'none',
      duration: 2000
    })
    // this.data.userInfo.companyName = e.detail.value;
  },

  //保存按钮提交
  sub:function(){
    var data = this.data;
    if (data.userInfo.realName != '' && data.userInfo.companyName != '') {
      if ((data.userInfo.trade == null && data.industrySelId != '') || (data.userInfo.trade != null && data.industrySelId == '')) {
        app.ajax("/applet/editUserInfo", {
          "province": data.region[0] != '' && data.region[0] != null ? data.region[0] : null,
          "city": data.region[1] != '' && data.region[1] != null ? data.region[1] : null,
          "companyId": data.userInfo.companyId,
          "companyName": data.userInfo.companyName,
          "openid": app.globalData.logMsg.openid,
          "positiotn": data.userInfo.positiotn != null ? null : data.postId,
          "realName": data.userInfo.realName,
          "trade": data.userInfo.trade != null ? null : "," + data.industrySelId + ",",
        }, function (data) {
          if (data.data.code == 10000) {
            wx.navigateBack();
          } else {
            wx.showToast({
              title: data.data.msg,
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
     
    } else {
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //关闭弹窗
  closeShadow:function(){
    this.setData({
      shadow: false,
    })
  },

  //行业选择点击
  hyClick:function(){
    this.setData({
      shadow:true,
      shadowHy:true,
      shadowZw:false
    })
  },

  //职务选择点击
  zwClick:function(){
    this.setData({
      shadow: true,
      shadowHy: false,
      shadowZw: true
    })
  },

  //行业列表点击
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.data.userInfo.trade = null;
    this.setData({
      industrySelId: e.detail.value
    })
  },
  hyLabelClick:function(e){
    var num = e.currentTarget.dataset.index,
        name = e.currentTarget.dataset.name;
    this.data.industrySelName=[];
    if (this.data.industrySelName.indexOf(name) > -1) {
      app.remove(this.data.industrySelName, name);
      this.data.industry[num].checked=false;
    } else {
      this.data.industrySelName.push(name);
      this.data.industry[num].checked = true;
    }
  },
  hySub:function(){
    var industrySelName = this.data.industrySelName;
    var industry = this.data.industry;
    this.setData({
      industrySelName: industrySelName,
      industry: industry,
      shadow: false,
      shadowHy: false,
      shadowZw: false
    })
  },

  //职务列表点击
  radioChange: function (e) {
    this.data.userInfo.positiotn = null;
    this.setData({
      postId: e.detail.value
    })
  },
  zwLabelClick: function (e) {
    var num = e.currentTarget.dataset.index,
      name = e.currentTarget.dataset.name;
      this.data.postName=name;
      for(var i in this.data.post){
        this.data.post[i].checked=false;
      }
      this.data.post[num].checked = true;
  },
  zwSub: function () {
    var postName = this.data.postName;
    var post = this.data.post;
    this.setData({
      postName: postName,
      post: post,
      shadow: false,
      shadowHy: false,
      shadowZw: false
    })
  },
})