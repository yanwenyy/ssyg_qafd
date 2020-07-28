// pages/ask/askDetail/askDetail.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    starNum:1,//星星等级
    id:'',//问题id
    msg:{},//问题信息
    userInfo:'',
    queImg:'',//问题图片路径
    imgLook:[],
    uuid:'',//被查看的人的uuid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.msg={};
    console.log(options)
    this.setData({
      id:options.id,
      uuid: options.uuid,
      userInfo:app.globalData.userInfo,
      queImg: app.public().question_src
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
    var that=this;
    app.ajax_wzx("/question/acceptAnswer/third", {
      "questionUuid": this.data.id,
      "sinceId": "1",
      "maxId": "20",
      "uuid": this.data.uuid||app.globalData.userInfo.uuid
    }, function (res) {
      var datas = res.data, answerUsers = datas.answerUsers, changerAnswer = datas.changerAnswer;
      datas.question.date = that.format(datas.question.date);
      if (answerUsers != '') {
        for (var i in answerUsers) {
          answerUsers[i].time = that.format(answerUsers[i].time);
        }
      }
      if (changerAnswer != '') {
        for (var i in changerAnswer) {
          changerAnswer[i].time = that.format(changerAnswer[i].time)
        }
      }
      that.setData({
        msg: datas
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

  //采纳按钮点击
  cn:function(e){
    var that=this;
    app.ajax_wzx("/answer/updateStatus/third",{
      "status": "2", 
      "answerUuid": e.currentTarget.dataset.id, 
      "uuid": app.globalData.userInfo.uuid
    },function(res){
      console.log(res);
      that.onShow();
    })
  },

  //去评价
  goPj:function(e){
    wx.navigateTo({
      url: '../askEvaluate/askEvaluate?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&dj=" + e.currentTarget.dataset.dj,
    })
  },

  //图片预览
  imgLook: function (e) {
    var that = this;
    var images = that.data.msg.question.images,i;
    for (i in images){
      if (this.data.imgLook[i]){
        
      }else{
        this.data.imgLook.push(this.data.queImg + images[i])
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: that.data.imgLook // 需要预览的图片http链接列表
    })
  },

  format: function (shijianchuo){
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + app.add0(m) + '-' + app.add0(d) + " " + app.add0(h) + ":" + app.add0(mm);
  }
})