//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ifDZ:false,//是否需要定制行业
    industryIndex:null,//用户开通行业信息
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    
    var that=this;
    if (app.globalData.userInfo) {
      console.log(1);
      this.getMsg();
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //页面初始化数据
  getMsg:function(){
    console.log("我是数据啦");
    var that=this;
    //是否需要定制行业
    app.ajax_nodata("/minitax/trade/user",function(res){
      that.setData({
        ifDZ:res.data.data.ifCustomize=='1'? false:true,
        industryIndex:res.data.data
      })
    })
  },

  //更换行业
  changeIndustry:function(){
    wx.navigateTo({
      url: '../industry/industryChange/industryChange',
    })
  },

  //行业四个tab点击
  indexTabClick:function(e){
    var url=e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }
})
