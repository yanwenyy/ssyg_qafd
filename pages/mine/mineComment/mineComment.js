// pages/mine/mineComment/mineComment.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMsg: '评论我的',
    list: [],
    start: 1,
    num: 10,
    status: true,
    userInfo: null,
    commentInput: false,
    commentMsg: '', //评论内容
    commentId: '', //评论id
    type: '', //评论类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
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
    this.setData({
      list: [],
      start: 1,
      num: 10,
      status: true,
    })
    this.getList(this.data.start, this.data.num, this.data.tabMsg)
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
      this.getList(this.data.start, this.data.num, this.data.tabMsg)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //tab切换
  tabClick: function (e) {
    this.setData({
      tabMsg: e.currentTarget.dataset.msg,
      list: [],
      start: 1,
      num: 10,
      status: true,
      commentInput: false
    });
    this.getList(this.data.start, this.data.num, this.data.tabMsg)
  },

  //获取列表
  getList: function (current, pageSize, tabMsg) {
    var that = this;
    if (tabMsg == "评论我的") {
      app.ajax("/minitax/otherlist", {
        "current": current,
        "pageSize": pageSize
      }, function (res) {
        var datas = res.data.data;
        if (datas && datas != '') {
          var list_change = that.data.list;
          for (var i in datas) {
            datas[i].title = datas[i].title.length > 15 ? datas[i].title.slice(0, 15) + "..." : datas[i].title;
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
    } else {
      app.ajax("/minitax/mylist", {
        "current": current,
        "pageSize": pageSize
      }, function (res) {
        var datas = res.data.data;
        if (datas && datas != '') {
          var list_change = that.data.list;
          for (var i in datas) {
            datas[i].title = datas[i].title.length > 15 ? datas[i].title.slice(0, 15) + "..." : datas[i].title;
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
    }
  },

  //个人头像和名称点击
  goPerson: function (e) {
    wx.navigateTo({
      url: '../minePage/minePage?id=' + e.currentTarget.dataset.id,
    })
  },

  //回复按钮点击
  hfClick: function (e) {
    this.setData({
      commentId: e.currentTarget.dataset.id,
      commentInput: true,
      type: e.currentTarget.dataset.type
    })
  },

  //评论框输入
  commentInput: function (e) {
    this.setData({
      commentMsg: e.detail.value
    })
  },

  //提交评论信息
  subComment: function () {
    var that = this;
    if (this.data.commentMsg != '') {
      app.ajax("/minitax/add", {
        "content": this.data.commentMsg,
        "id": this.data.commentId,
        "status": '2',
        "type": this.data.type
      }, function (res) {
        that.setData({
          commentInput: false,
          list: [],
          start: 1,
          num: 10,
          status: true,
        });
        that.getList(that.data.start, that.data.num, that.data.tabMsg)
      })
    } else {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //标题点击
  titleClick: function (e) {
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