// pages/industry/industrySSCH/industrySSCH.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[],//tab列表
    tabMsg:'全部',
    attributeid:null,//属性id
    tradeId: '', //行业id
    start: 1, //起始页
    num: 10, //每页显示条数
    status: true, //是否还有数据
    list: [], //政策列表
    shareId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //tab分类
    app.ajax_nodata("/minitax/attribute/list/2",function(res){
      that.setData({
        tabList:res.data.data
      })
    });

      //用户当前定制的行业
      app.ajax_nodata("/minitax/select/trade", function (res) {
        that.setData({
          tradeId: res.data.data.tradeId
        })
        //列表数据
        var data=that.data;
        that.getList(data.attributeid,data.start,data.num,data.tradeId)
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
    var that=this;
    if (this.data.status == true) {
      var start = this.data.start + 1
      this.setData({
        start: start
      });
      //列表数据
      var data=that.data;
      that.getList(data.attributeid,data.start,data.num,data.tradeId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '这是一条与您行业相关的税收政策',
        path: '/pages/share/fxts/fxts?from=ssch&&id=' + res.target.id
      }
    }
    
  },

  getList: function (attributeid, current, pageSize, tradeId) {
    var that=this;
    app.ajax("/minitax/taxplan/list", {
      "attributeid": attributeid,
      "current": current,
      "pageSize": pageSize,
      "tradeId": tradeId
    }, function (res) {
      var datas=res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          list_change.push(datas[i])
        }
        that.setData({
          list: list_change
        });
      }else{
        that.setData({
          status: false
        })
      }
    })
  },

   //tab点击
   tabClick:function(e){
    var that=this;
    this.setData({
      tabMsg:e.currentTarget.dataset.msg,
      attributeid:e.currentTarget.dataset.id,
      start:1,
      num:10,
      status:true,
      list:[]
    })
    //列表数据
    var data=that.data;
    that.getList(data.attributeid,data.start,data.num,data.tradeId)
  },

  //列表点击
  listClick:function(e){
    wx.navigateTo({
      url: 'SSCHcontent/SSCHcontent?id='+e.currentTarget.dataset.id
    })
  },

    //点赞
    dzClick: function (e) {
      var target = e.currentTarget.dataset,
        id = target.id,
        index = target.index,
        that = this;
      if (target.parse == 0) {
        app.ajax("/minitax/praiseadd", {
          "id": id,
          "status": 0,
          "type": "4"
        }, function (res) {
          if (res.data.code == 10000) {
            that.data.list[index].ifPrase = 1;
            that.data.list[index].praiseNum = that.data.list[index].praiseNum + 1;
            that.setData({
              list: that.data.list
            })
          }
        })
      } else {
        app.ajax("/minitax/praiseadd", {
          "id": id,
          "status": 1,
          "type": "4"
        }, function (res) {
          if (res.data.code == 10000) {
            that.data.list[index].ifPrase = 0;
            that.data.list[index].praiseNum = that.data.list[index].praiseNum - 1;
            that.setData({
              list: that.data.list
            })
          }
        })
      }
    },
  
    //收藏点击
    scClick: function (e) {
      var target = e.currentTarget.dataset,
        data = this.data,
        id = target.id,
        index = target.index,
        that = this;
      if (target.collect == 0) {
        app.ajax("/minitax/collect/add", {
          "id": id,
          "status": 0,
          "type": "4"
        }, function (res) {
          if (res.data.code == 10000) {
            data.list[index].ifCollect = 1;
            // data.list[index].collectNum = data.detail.collectNum + 1;
            that.setData({
              list: that.data.list
            })
          }
        })
      } else {
        app.ajax("/minitax/collect/add", {
          "id": id,
          "status": 1,
          "type": "4"
        }, function (res) {
          if (res.data.code == 10000) {
            data.list[index].ifCollect = 0;
            // data.list[index].collectNum = data.detail.collectNum - 1;
            that.setData({
              list: that.data.list
            })
          }
        })
      }
    },
  
    //评论点击
    plClick: function (e) {
      wx.navigateTo({
        url: 'SSCHcontent/SSCHcontent?from=sschList&id=' + e.currentTarget.dataset.id,
      })
    },

    //分享按钮点击
    share:function(e){
      this.setData({
        shareId:e.currentTarget.id
      })
     
    }
})