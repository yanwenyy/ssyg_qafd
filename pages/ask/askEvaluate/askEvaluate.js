// pages/ask/askEvaluate/askEvaluate.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    starNum: 1,//星星数量
    id:'',//咨询师的id
    name:'',//咨询师的名字
    dj:'',//咨询师的等级
    appraisal:'',//评价内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,//咨询师的id
      name: options.name,//咨询师的名字
      dj: options.dj,//咨询师的等级
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

   //星星点击
   starClick: function (e) {
    this.setData({
      starNum: e.currentTarget.dataset.value
    })
  },

  //提交评价
  sub:function(){
    app.ajax_wzx("/answer/score/third",{
      "score":this.data.starNum,
      "answerUuid":this.data.id,
      "uuid": app.globalData.userInfo.uuid,
      "appraisal": this.data.appraisal
    },function(res){
      if(res.data.code==1){
        wx.navigateBack()
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //评价内容输入
  textInput:function(e){
    this.setData({
      appraisal:e.detail.value
    })
  }
})