//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl:app.globalData.imgUrl,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ifDZ: false, //是否需要定制行业
    industryIndex: null, //用户开通行业信息
    tradeId: '', //行业id
    imgList: [], //轮播图
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    liveList: [], //直播答疑列表
    courseList: [], //精选好课列表
    newList: [], //新闻中心列表
    newStart: 1, //起始页
    newNum: 3, //每页显示条数
    askMsg: null, //咨询信息
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    var that = this;
    if (app.globalData.userInfo) {
      console.log(1);
      this.getMsg();
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log(2);
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.data.data,
          hasUserInfo: true
        });
        this.getMsg();
      }
    } else {
      console.log(3);
      // 在没有 open-type=getUserInfo 版本的兼容处理
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.data.data,
          hasUserInfo: true
        });
        this.getMsg();
      }
    }
  },

  onMyEvent: function (e) {
    this.onShow();
  },


  onPageScroll: function (e) {
    // console.log(e.scrollTop)
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //页面初始化数据
  getMsg: function () {
    console.log("我是数据啦");
    app.getToken();
    var that = this;
    //是否需要定制行业
    app.ajax_nodata("/minitax/trade/user", function (res) {
      that.setData({
        ifDZ: res.data.data.ifCustomize == '1' ? false : true,
        industryIndex: res.data.data,
        vipTime:res.data.data.trVipTime
      })
    });

    //用户当前定制的行业
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        tradeId: res.data.data.tradeId,
        mfk: res.data.data.tradeVisiblePower
      })
    });

    //轮播图
    app.ajax("/star/quan/list", {
      "type": "1"
    }, function (res) {
      that.setData({
        imgList: res.data.data
      })
    });

    //用户当前定制的行业
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        tradeId: res.data.data.tradeId
      });

      //直播答疑
      app.ajax("/minitax/broadacast/list", {
        "current": 1,
        "pageSize": 10,
        "tradeId": that.data.tradeId,
      }, function (res) {
        var datas=res.data.data;
        var list_change = [];
        for (var i in datas) {
          datas[i].title=datas[i].title.length>18?datas[i].title.slice(0,18)+"...":datas[i].title
          list_change.push(datas[i])
        }
        that.setData({
          liveList: list_change
        })
      })

      //精选好课
      app.ajax("/minitax/goodclass/list", {
        "current": 1,
        "pageSize": 10,
        "tradeId": that.data.tradeId,
      }, function (res) {
        var datas=res.data.data;
        var list_change = [];
        for (var i in datas) {
          datas[i].title=datas[i].title.length>16?datas[i].title.slice(0,16)+"...":datas[i].title
          list_change.push(datas[i])
        }
        that.setData({
          courseList: list_change
        })
      });

      //新闻中心
      that.getNew(that.data.newStart, that.data.newNum, that.data.tradeId);

    });

    //咨询信息
    app.ajax_nodata("/minitax/advisory/information", function (res) {
      that.setData({
        askMsg: res.data.data
      })
    })
  },

  //更换行业
  changeIndustry: function () {
    wx.navigateTo({
      url: '../industry/industryChange/industryChange',
    })
  },

  //行业四个tab点击
  indexTabClick: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  //精选好课点击
  courseClick: function (e) {
    wx.navigateTo({
      url: '../course/coursContent/coursContent?id=' + e.currentTarget.dataset.id
    })
  },

  //直播答疑点击
  liveClick: function (e) {
    wx.navigateTo({
      url: '../liveAnswer/liveAnswerContent/liveAnswerContent?id=' + e.currentTarget.dataset.id
    })
  },

  //新闻中心列表
  getNew: function (current, pageSize, tradeId) {
    var that = this;
    app.ajax("/minitax/newcenter/list", {
      "current": current,
      "pageSize": pageSize,
      "tradeId": tradeId
    }, function (res) {
      if (res.data.data != '') {
        var datas=res.data.data;
        var i=0,len=datas.length;
        for(;i<len;i++){
          datas[i].title=datas[i].title.length>32?datas[i].title.slice(0,32)+"...":datas[i].title;
        }
        that.setData({
          newList: datas
        })
      } else {
        // wx.showToast({
        //   title: '没有更多了',
        //   icon: 'none',
        //   duration: 2000
        // })
        that.setData({
          newStart:1,
          newNum:3,
          // newList:[],
        })
        // //新闻中心
        that.getNew(that.data.newStart, that.data.newNum, that.data.tradeId);
      }

    })
  },

  //新闻中心列表点击
  newClick: function (e) {
    if(e.currentTarget.dataset.type=="1"){
      wx.navigateTo({
        url: '/pages/index/bannerWeb/bannerWeb?url='+e.currentTarget.dataset.url
      })
    }else{
      wx.navigateTo({
        url: '../newCenter/newContent/newContent?id=' + e.currentTarget.dataset.id
      })
    }
  },

  //新闻中心刷一刷点击
  sysClick: function () {
    var that = this;
    this.setData({
      newStart: that.data.newStart + 1,
    });
    //列表数据
    var data = that.data;
    that.getNew(data.newStart, data.newNum, data.tradeId)
  },

  //微咨询模块的按钮点击
  queClick:function(e){
    if (app.ifVip(this.data.askMsg.isVip != 1)) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },

  //banner点击
  bannerClick:function(e){
    var target=e.currentTarget.dataset;
    if(target.type==2){
      wx.navigateTo({
        url: 'bannerWeb/bannerWeb?url='+target.url,
      })
    }
  },

  //行业介绍点击
  introClick:function(e){
    var target=e.currentTarget.dataset;
    wx.showModal({
      title: target.title,
      content: target.msg,
      showCancel:false,
      confirmText:'关闭'
    })
  }

})