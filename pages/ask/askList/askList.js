// pages/ask/askList/askList.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMsg: '企业咨询',
    timer: null,
    systimestamp: '',
    list:[],
    headSrc:'',//头像路径
    start: 1,//起始页
    num: 1,
    end: 10,//每页显示条数
    status: true,//是否还有数据
    time:0,//剩余次数
    c_uuid:'',//企业的所有用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var time = new Date().getTime();
    that.setData({
      systimestamp: time,
    })
    //调用函数开始计时
    this.data.timer = setInterval(function () {
      var time = new Date().getTime();
      that.setData({
        systimestamp: time
      })
    }, 1000);


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
    this.setData({
      list: [],
      start: 1,//起始页
      num: 1,
      end: 10,//每页显示条数
      status: true,//是否还有数据
    })
    //获取剩余次数
    app.ajax_nodata("/applet/getQuestionNum",function(res){
      that.setData({
        time:res.data.data
      })
    })
    
    //获取用户id
    app.ajax("/applet/getUserIdByCompanyId",{
      companyId: app.globalData.userInfo.companyId
      },function(res){
        that.setData({
          c_uuid:res.data.data
        });
        //获取列表数据
        that.getList(that.data.start, that.data.end, that.data.c_uuid,that.data.tabMsg)
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
    this.data.timer = null;
    clearInterval(this.data.timer)
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
      var num = this.data.num + 1
      this.setData({
        num: num,
        start: ((num - 1) * 10) + 1,
        end: num * 10
      });
      this.getList(this.data.start, this.data.end, this.data.c_uuid,this.data.tabMsg)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //问答规则点击
  ruleClick:function(){
    wx.navigateTo({
      url: '../askRule/askRule',
    })
  },

  //tab点击
  tabClick:function(e){
    var that=this;
    this.setData({
      tabMsg:e.currentTarget.dataset.msg,
      list: [],
      start: 1,//起始页
      num: 1,
      end: 10,//每页显示条数
      status: true,//是否还有数据
    });
     //获取列表数据
     that.getList(that.data.start, that.data.end, that.data.c_uuid,that.data.tabMsg)
  },

  //去提问点击
  askClick:function(){
    wx.navigateTo({
      url: '../ask',
    })
  },

   //获取列表
   getList: function (start, num, uuid,type){
    var that = this;
    if(type=="企业咨询"){
      app.ajax_wzx("/question/companyQuestionList/third", {
        "sinceId": start, 
        "maxId": num, 
        "uuid":app.globalData.userInfo.uuid,
        'userIds': uuid
      }, function (res) {
        if (res.data.questions != '') {
          var datas = res.data.questions,
              i,
              list_change = that.data.list;
          for (i in datas) {
            datas[i].date = app.format(datas[i].date);
            list_change.push(datas[i])
          }
          that.setData({
            list: list_change
          });
        } else {
          that.setData({
            status: false
          });
        }
  
      })
    }else{
      app.ajax_wzx("/question/admireList/third", {
        "sinceId": start,
        "maxId": num,
        'uuid': app.globalData.userInfo.uuid
      }, function (res) {
        if (res.data.questions != '') {
          var datas = res.data.questions,
            i,
            list_change = that.data.list;
          for (i in datas) {
            datas[i].date = that.format(datas[i].date);
            list_change.push(datas[i])
          }
          that.setData({
            list: list_change
          });
        } else {
          that.setData({
            status: false
          });
        }
  
      })
    }
    
  },

   //去详情页面
   goDetail:function(e){
    wx.navigateTo({
      url: '../askDetail/askDetail?id=' + e.currentTarget.dataset.id + "&uuid="+e.currentTarget.dataset.uuid,
    })
  },

  format: function (shijianchuo) {
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