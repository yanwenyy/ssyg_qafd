// pages/mine/mineCollection/mineCollection.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMsg: '全部',
    type: '',
    list: [],
    start: 1,
    num: 10,
    status: true
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
    this.setData({
      list: [],
      start: 1,
      num: 10,
      status: true,
    })
    this.getList(this.data.start, this.data.num, this.data.type)
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
      this.getList(this.data.start, this.data.num, this.data.type)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //tab点击
  tabClick: function (e) {
    this.setData({
      tabMsg: e.currentTarget.dataset.msg,
      type: e.currentTarget.dataset.type,
      list: [],
      start: 1,
      num: 10,
      status: true,
    });
    this.getList(this.data.start, this.data.num, this.data.type)
  },

  //获取列表
  getList: function (current, pageSize, type) {
    var that = this;
    app.ajax("/minitax/collect/list", {
      "current": current,
      "pageSize": pageSize,
      "type": type
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          if (datas[i].moudle == '8') {
            datas[i].title = datas[i].title.length > 38 ? datas[i].title.slice(0, 38) + "..." : datas[i].title
          } else if (datas[i].moudle == '7') {
            datas[i].title = datas[i].title.length > 16 ? datas[i].title.slice(0, 16) + "..." : datas[i].title
          }
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

  //列表点击
  listClick: function (e) {
    var target = e.currentTarget.dataset;
    var id = target.id,
      type = target.type;
    switch (type) {
      case '1':
        //政策详情
        app.ajax("/minitax/policy/details", {
          "policyId": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../industry/industryZCGJ/policyContent/policyContent?policyId=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });
        break;
      case '2':
        //政策详情
        app.ajax("/minitax/policy/releatedetails", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../industry/industryZCGJ/XGJDcontent/XGJDcontent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });

        break;
      case '3':
        //政策详情
        app.ajax("/minitax/trisk/detailse", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../industry/industryFXTS/FXTScontent/FXTScontent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });

        break;
      case '4':
        //政策详情
        app.ajax("/minitax/taxplan/detailse", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../industry/industrySSCH/SSCHcontent/SSCHcontent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });

        break;
      case '5':
        //政策详情
        app.ajax("/minitax/process/detailse", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../industry/industryLCJM/LCJMcontent/LCJMcontent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });

        break;
      case '6':
        //政策详情
        app.ajax("/minitax/newcenter/detailse", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../newCenter/newContent/newContent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });

        break;
      case '7':
        //政策详情
        app.ajax("/minitax/goodclass/details", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../course/coursContent/coursContent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });
        break;
      case '8':
        //政策详情
        app.ajax("/minitax/broadacast/details", {
          "id": id,
        }, function (res) {
          if (res.data.data != null && res.data.data != '') {
            wx.navigateTo({
              url: '../../liveAnswer/liveAnswerContent/liveAnswerContent?id=' + id,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您收藏的内容已被删除或隐藏',
              showCancel:false,
            })
          }
        });
        break;
    }
  },

  ifDel: function (val, id) {
    var url = '', dataName = {}, that = this;
    if (val == 1) {
      dataName = {
        "policyId": id
      }
    } else {
      dataName = {
        "id": id
      }
    }
    switch (val) {
      case '1':
        url = '/minitax/policy/details';
        break;
      case '2':
        url = '/minitax/policy/releatedetails';
        break;
      case '3':
        url = '/minitax/trisk/detailse';
        break;
      case '4':
        url = '/minitax/taxplan/detailse';
        break;
      case '5':
        url = '/minitax/process/detailse';
        break;
      case '6':
        url = '/minitax/newcenter/detailse';
        break;
      case '7':
        url = '/minitax/goodclass/details';
        break;
      case '8':
        url = '/minitax/broadacast/details';
        break;
    }
    //政策详情
    app.ajax(url, dataName, function (res) {
      that.setData({
        detailData: res.data.data
      })
    });
  }
})