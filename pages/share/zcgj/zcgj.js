// pages/share/zcgj/zcgj.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    navText: '政策',
    id: '',//政策id
    policyContent: '',//政策详情
    releatfile: [], //相关文件
    releatedetails: [], //相关解读
    commentData: '', //评论详情
    commentList: [], //评论列表
    userInfo: null,
    year: '', //今年
    commentStart: 1, //起始页
    commentNum: 10, //每页显示条数
    commentStatus: true, //是否还有数据
    commentMsg: '', //评论内容
    commentInput: false, //评论框状态
    commentPlaceHolder: "", //评论框占位符
    // 是否显示授权登录按钮
    logMsg: '',
    hasUserInfo: false,
    scope: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取年份  
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    this.setData({
      id: options.id,
      year: Y,
      type:''
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
  onShow: function (id) {
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
      path: '/pages/share/zcgj/zcgj?id='+this.data.id
    }
  },

  //自定义组件事件
  onMyEvent: function (e) {
    this.setData({
      scope: true,
      hasUserInfo: true
    });
    this.onShow()
  },

  getuser:function(){
    var that=this;
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
    var that=this;
    //政策详情
    app.ajax("/minitax/share/policy/details", {
      "policyId": this.data.id,
    }, function (res) {
      res.data.data.content = res.data.data.content.replace(/\<img/gi, '<img class="rich-img" ');
      that.setData({
        policyContent: res.data.data
      });
      var query = wx.createSelectorQuery();
      query.select('.richClass').boundingClientRect(function (rect) {
        that.setData({
          richHeight: rect.height
        })
      }).exec();
    });

     //相关文件
     app.ajax("/minitax/share/policy/releatfile", {
      "policyId": this.data.id,
      "current": 0,
      "pageSize": 1000,
    }, function (res) {
      that.setData({
        releatfile: res.data.data
      })
    });

    //相关解读
    app.ajax("/minitax/share/policy/expert", {
      "policyId": this.data.id,
      "current": 0,
      "pageSize": 1000,
    }, function (res) {
      that.setData({
        releatedetails: res.data.data
      })
    });
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

  //相关解读点击
  xgjdClick: function (e) {
    if(e.currentTarget.dataset.type=="xgwj"){
      wx.navigateTo({
        url: '/pages/share/zcgj/zcgj?id=' + e.currentTarget.dataset.id,
      })
      // this.onShow(e.currentTarget.dataset.id)
    }else{
      wx.navigateTo({
        url: '../xgjd/xgjd?id=' + e.currentTarget.dataset.id,
      })
    }
  },

    //评论列表
    getCommentList: function (current, pageSize, id) {
      var that = this;
      app.ajax("/minitax/share/list", {
        "current": current,
        "pageSize": pageSize,
        "id": id,
        "type": "1"
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
            commentData: res.data,
            commentList: list_change
          });
        } else {
          that.setData({
            commentStatus: false
          })
        }
      })
    },

  //去vip页面
  goVip() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },

  //去首页
  goHome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})