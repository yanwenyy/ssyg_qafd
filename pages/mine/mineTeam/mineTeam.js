// pages/mine/company/teamManage/teamManage.js
const app=getApp();
const base64src = require('../../../utils/base64src.js');
var imgUrl=app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    msg:{},//团队信息
    shadow:false,
    shadowId:'',//操作的用户id
    shadowName:'',//操作用户的姓名
    userInfo:'',//用户信息
    // 分享
    share:false,//分享框是否显示
    shareTitle:'',
    shareName:'',
    shareUrl:'',
    //分享结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.globalData.userInfo.vaildLastTime = app.format(app.globalData.userInfo.vaildLastTime)
    that.setData({
      userInfo:app.globalData.userInfo
    })
    //团队信息
    app.ajax_nodata("/applet/getStation",function(res){
      that.setData({
        msg:res.data.data
      })
    });
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
     
    }
    return {
      title: that.data.userInfo.companyName+'邀请您的加入',
      path: 'pages/share/acspetYq/acspetYq?uuid='+this.data.userInfo.uuid,
      imageUrl:imgUrl+'/share-yqts.png'
    }
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

  //关闭弹窗
  closeShadow:function(){
    this.setData({
      shadow:false
    })
  },

  //打开弹窗
  openShadow:function(e){
    console.log(e)
    this.setData({
      shadow: true,
      shadowId: e.currentTarget.dataset.id,
      shadowName: e.currentTarget.dataset.name,
    })
  },

  //转移管理层
  transferManage:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要转移权限给“' + this.data.shadowName+'”吗？转移后您将失去管理权限',
      success(res) {
        if (res.confirm) {
          app.ajax("/applet/updateStateion", {
            userId: that.data.shadowId
          }, function (res) {
            if (res.data.code == 10000) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                shadow: false
              });
              wx.navigateBack()
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //删除员工
  deletStaff: function () {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除员工么？',
      success(res) {
        if (res.confirm) {
          app.ajax("/applet/deleteStation", {
            userId: that.data.shadowId
          }, function (res) {
            if (res.data.code == 10000) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                shadow: false
              });
              that.onLoad()
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  //去续费点击
  goPay:function(e){
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
})