// pages/mine/minePage/minePage.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intro:false,
    userId:'',//用户id
    introMsg:'',//个人介绍
    userInfo:null,//用户信息
    tabMsg:'',//关注数,粉丝数,是否关注
    navMsg:'动态',//导航信息
    wzTabMsg:'政策归集',//文章里的tabmsg
    httpUrl:'trendlist',//接口请求url
    list: [],
    start: 1,
    num: 10,
    status: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      userId:options.id,
      // userId:'deaea64e71e44fa4bcf7ea80b27d232c',
      userInfo:app.globalData.userInfo,
    });

    //用户信息
    app.ajax_get("/minitax/home/usersmal?userId="+that.data.userId,function(res){
      var datas=res.data.data;
      datas.identity=datas.identity.split(",")
      that.setData({
        introMsg:datas
      })
    });

    //关注数,粉丝数,是否关注
    app.ajax_get("/minitax/home/attentionnum?userId="+that.data.userId,function(res){
      that.setData({
        tabMsg:res.data.data
      })
    });

    this.getList(this.data.start, this.data.num)
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
      this.getList(this.data.start, this.data.num)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //个人介绍点击
  introClick:function(){
    this.setData({
      intro:true
    })
  },

  //关闭弹窗点击
  closeShadow:function(){
    this.setData({
      intro:false
    })
  },

  //个人介绍输入
  introInput:function(e){
    this.setData({
      introMsg:e.detail.value
    })
  },

  //提交个人介绍
  sub:function(){
    console.log(this.data.introMsg);
    this.setData({
      intro:false
    })
  },

   //关注按钮点击
   gzClick:function(e){
    var that=this;
    app.ajax_get("/minitax/attention/add?userId="+that.data.userId,function(res){
      if(res.data.code==10000){
        that.data.tabMsg.ifAttention=true;
        that.setData({
          tabMsg:that.data.tabMsg
        })
      }
    })
  },

  //查看粉丝或关注列表
  lookfans:function(e){
    if(e.currentTarget.dataset.code==0){
      wx.navigateTo({
        url: '../mineAttention/mineAttention?userId='+this.data.userId,
      })
    }else{
      wx.navigateTo({
        url: '../mineFans/mineFans?userId='+this.data.userId,
      })
    }
  },

  //导航tab点击
  navClick:function(e){
    this.setData({
      navMsg:e.currentTarget.dataset.msg,
      httpUrl:e.currentTarget.dataset.url,
      list: [],
      start: 1,
      num: 10,
      status: true,
    })
    this.getList(this.data.start, this.data.num)
  },

  //文章tab栏点击
  wzTabClick:function(e){
    this.setData({
      wzTabMsg:e.currentTarget.dataset.msg,
      httpUrl:e.currentTarget.dataset.url,
      list: [],
      start: 1,
      num: 10,
      status: true,
    })
    this.getList(this.data.start, this.data.num)
  },

  getList: function (current, pageSize) {
    var that = this;
    app.ajax("/minitax/home/"+this.data.httpUrl, {
      "current": current,
      "pageSize": pageSize,
      "userId": this.data.userId
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