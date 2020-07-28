// pages/share/fxts/fxts.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    // 是否显示授权登录按钮
    logMsg: '',
    hasUserInfo: false,
    scope: true,
    from:'',
    id: '',
    detail: null, //详情信息
    commentList: [], //评论列表
    userInfo: null,
    year: '', //今年
    commentStart: 1, //起始页
    commentNum: 10, //每页显示条数
    commentStatus: true, //是否还有数据
    commentMsg: '', //评论内容
    commentInput: false, //评论框状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    this.setData({
      id: options.id,
      year: Y,
      from:options.from
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
    var that = this;
    if(app.globalData.logMsg){
      that.getuser();
    }else{
      app.cookieIdReadyCallback = res => {
        that.setData({
          logMsg: res.data.data
        })
        // 获取用户信息
        that.getuser();
      };
    }
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
    if (this.data.commentStatus == true) {
      var start = this.data.commentStart + 1
      this.setData({
        commentStart: start
      });
      this.getCommentList(this.data.commentStart, this.data.commentNum, this.data.id);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这是一条与您行业相关的税收政策',
      path: '/pages/share/fxts/fxts?from='+this.data.from+'&&id='+this.data.id
    }
  },

  //自定义组件事件
  onMyEvent: function (e) {
    this.setData({
      scope: true,
      hasUserInfo: true
    })
  },

  //锚点切换部分的功能实现
  navClick(e) {
    this.setData({
      navText: e.currentTarget.dataset.text
    })
    wx.pageScrollTo({
      selector: ".v" + e.currentTarget.dataset.code,
      duration: 300
    })
  },

  getuser: function () {
    var that = this;
    wx.getSetting({
      success: res => {

        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          if (that.data.logMsg.phone != '' && that.data.logMsg.phone != null) {
            that.data.hasUserInfo = true;
          } else {
            that.data.hasUserInfo = false;
          }
          that.setData({
            scope: false,
            hasUserInfo: that.data.hasUserInfo
          });
          that.getMsg();
          //评论列表
          that.getCommentList(that.data.commentStart, that.data.commentNum, that.data.id);
        }
      }
    });
  },
  getMsg: function () {
    var that = this;
     //详情
     app.ajax(this.data.from=='fxts'?"/minitax/share/trisk/detailse":"/minitax/share/taxplan/detailse", {
      "id": this.data.id,
    }, function (res) {
      res.data.data.content=res.data.data.content.replace(/\<img/gi, '<img class="rich-img" ');
      that.setData({
        detail: res.data.data
      });
      var query = wx.createSelectorQuery();
      query.select('.richClass').boundingClientRect(function (rect) {
        that.setData({
          richHeight: rect.height
        })
      }).exec();
    });
  },

   //评论列表
   getCommentList: function (current, pageSize, id) {
    var that = this;
    app.ajax("/minitax/list", {
      "current": current,
      "pageSize": pageSize,
      "id": id,
      "type": this.data.from=='fxts'?"3":"4"
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.commentList;
        for (var i in datas) {
          datas[i].discussUsers_change = datas[i].discussUsers.slice(0, 1);
          datas[i].zk = false;
          list_change.push(datas[i])
        }
        that.setData({
          commentList: list_change
        });
      } else {
        that.setData({
          commentStatus: false
        })
      }
    })
  },

   //展开收起点击
   sqClick: function (e) {
    var data = this.data;
    if (e.currentTarget.dataset.msg == '收起') {
      data.commentList[e.currentTarget.dataset.id].zk = false;
      data.commentList[e.currentTarget.dataset.id].discussUsers_change = data.commentList[e.currentTarget.dataset.id].discussUsers.slice(0, 1);
      this.setData({
        commentList: data.commentList
      })
    } else {
      data.commentList[e.currentTarget.dataset.id].zk = true;
      data.commentList[e.currentTarget.dataset.id].discussUsers_change = data.commentList[e.currentTarget.dataset.id].discussUsers;
      this.setData({
        commentList: data.commentList
      })
    }
  },

  //去vip页面
  goVip() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },

  //去首页
  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})