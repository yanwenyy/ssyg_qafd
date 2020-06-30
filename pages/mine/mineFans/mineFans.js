// pages/mine/mineFans/mineFans.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    start: 1,
    num: 10,
    status: true,
    userId:'',//用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:options.userId//从个人中心页面进必传
      // userId:'b36b9758b5844ab59bdf46041ec0d755'
    })
    console.log(this.data.userId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      list: [],
      start: 1,
      num: 10,
      status: true,
    })
    this.getList(this.data.start, this.data.num)
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

  getList: function (current, pageSize) {
    var that = this;
    app.ajax(this.data.userId?'/minitax/home/fans':"/minitax/my/fans/list", {
      "current": current,
      "pageSize": pageSize,
      "userId": this.data.userId
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          datas[i].identity=datas[i].identity.split(",");
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

  //关注按钮点击
  gzClick:function(e){
    var that=this;
    var target=e.currentTarget.dataset;
    if(target.status==0){
      app.ajax_get("/minitax/attention/add?userId="+target.id,function(res){
        if(res.data.code==10000){
          that.data.list[target.index].status=1;
          that.setData({
            list:that.data.list
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确定要取消关注吗?',
        success (res) {
          if (res.confirm) {
            app.ajax_get("/minitax/attention/remove?userId="+target.id,function(res){
              if(res.data.code==10000){
                that.data.list[target.index].status=0;
                that.setData({
                  list:that.data.list
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

   //列表点击
   goPerson: function (e) {
    app.goPerson(e.currentTarget.dataset.id)
  },
})