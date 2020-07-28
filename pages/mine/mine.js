// pages/mine/mine.js
var app=getApp();
var imgUrl=app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userInfo:null,
    tabMsg:'',//收藏,评论,关注,粉丝数
    share:false,//分享框是否显示
    shareTitle:'',
    shareName:'',
    shareUrl:'',
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
    var that=this;
    app.getUser(function(res){
      that.setData({
        userInfo:res.data.data
      })
    });

    //收藏,评论,关注,粉丝数
    app.ajax_nodata("/minitax/home/attentionnum",function(res){
      that.setData({
        tabMsg:res.data.data
      })
    });

    //是否需要定制行业
    app.ajax_nodata("/minitax/trade/user", function (res) {
      that.setData({
        ifDZ: res.data.data.ifCustomize == '1' ? false : true,
        industryIndex: res.data.data
      })
    });
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
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      if (this.data.shareName == "fxdy") {
        return {
          title: '我为“省税一哥”代言',
          path: 'pages/index/index',
          imageUrl: imgUrl+'/share-zc.png'
        }
      } else {
        return {
          title: that.data.userInfo.companyName+'邀请您的加入',
          path: 'pages/share/acspetYq/acspetYq?uuid='+this.data.userInfo.uuid,
          imageUrl:imgUrl+'/share-yqts.png'
        }
      }
    }
  },

  goList:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  openShare:function(e){
    var target=e.currentTarget.dataset;
    console.log(target.url)
    this.setData({
      shareTitle:target.title,
      shareName:target.name,
      shareUrl:target.url,
      share:true
    })
  },

  //去省税一哥新政辅导小程序
  goSSYG:function(){
    wx.navigateToMiniProgram({
      appId: 'wxb522129e3ee3abe7',
    })
  }
})