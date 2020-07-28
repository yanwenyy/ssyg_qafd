// pages/industry/industryZCGJ/industryZCGJ.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    headTrade: null, //头部行业信息
    headHeight:0,//头部的高度
    scrollTop: null,
    navText: '', //导航选中文字
    navSel: false, //导航选择框显示
    tradeId: '', //行业id
    province: '',//省份
    region: '', //地区
    regionMsg: '', //tab地区显示
    customItem: '全部',
    regionList: ['北京市', '北京市', '东城区'], //地区列表
    taxId: '', //税种id
    taxMsg: '',
    timeLinessId: '', //时效性id
    timeMsg: '',
    year: '', //发布年份
    start: 1, //起始页
    num: 10, //每页显示条数
    status: true, //是否还有数据
    list: [], //政策列表
    taxList: [], //税种列表
    yearList: [], //年份列表
    timeList: [], //时效性列表
    tabType:"1",//行业,普适筛选
    labelList:[],//标签列表
    tagId:'',//标签id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var query = wx.createSelectorQuery();
    query.select('.bannercontainer').boundingClientRect(function (rect) {
      that.setData({
        headHeight: rect.height
      })
    }).exec();
    query.select('.new-head-tab').boundingClientRect(function (rect) {
      that.setData({
        paddingHeight: rect.height+20
      })
    }).exec();
    //税种列表
    app.ajax("/minitax/tax/list",{
      type:2
    } ,function (res) {
      that.setData({
        taxList: res.data.data
      })
    });

    //发布年份列表
    app.ajax_nodata("/minitax/releaseyear/list", function (res) {
      that.setData({
        yearList: res.data.data
      })
    });

    //时效性列表
    app.ajax("/minitax/timeliness/list", {
      type:2
    } ,function (res) {
      that.setData({
        timeList: res.data.data
      })
    });

     //标签列表
     app.ajax("/minitax/tag/list", {
      type:2
    } ,function (res) {
      that.setData({
        labelList: res.data.data
      })
    });


    var data = this.data;
    //获取头部行业信息
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        headTrade: res.data.data,
        tradeId: res.data.data.tradeId
      })
      that.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
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
    var data = this.data;
    if (this.data.status == true) {
      var start = this.data.start + 1
      this.setData({
        start: start
      });
      this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //滚动条监听
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    this.setData({
      scrollTop: e.scrollTop,
      navSel: false
    })
  },

  //导航点击事件
  navClick: function (e) {
    this.setData({
      // scrollTop: this.data.headHeight+1,
      navText: e.currentTarget.dataset.txt,
      navSel: e.currentTarget.dataset.region!='yes'?true:false
    });
  },

  //导航筛选点击
  navOptClick: function (e) {
    var data = this.data;
    var dataset = e.currentTarget.dataset;
    this.goFrist();
    this.setData({
      // scrollTop: this.data.headHeight-1,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    });
    if (dataset.type == 'sz') {
      this.setData({
        taxId: dataset.id,
        taxMsg: dataset.msg.length > 4 ? dataset.msg.slice(0, 4) + "..." : dataset.msg
      });
    } else if (dataset.type == 'fbnf') {
      this.setData({
        year: dataset.msg
      });
    } else if (dataset.type == 'sxx') {
      this.setData({
        timeLinessId: dataset.id,
        timeMsg: dataset.msg.length<5?dataset.msg:dataset.msg.slice(0,5)+".."
      });
    }
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
  },

  //政策列表点击
  zcClick: function (e) {
    wx.navigateTo({
      url: 'policyContent/policyContent?policyId=' + e.currentTarget.dataset.id,
    })
  },

  //获取列表
  getList: function (current, pageSize, tradeId, province, region, taxId, timeLinessId, year,tagId,property) {
    var that = this;
    app.ajax('/minitax/policy/list', {
      "current": current,
      "pageSize": pageSize,
      "tradeId": tradeId,
      "province": province,
      "region": region,
      "taxId": taxId,
      "timeLinessId": timeLinessId,
      "year": year,
      "tagId":tagId,
      "property":property
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
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

  //地区选择点击
  bindRegionChange: function (e) {
    var data = this.data;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      province: e.detail.value[0] == '全部' ? '' : e.detail.value[0],
      region: e.detail.value[1] == '全部' ? '' : e.detail.value[1],
      regionMsg: e.detail.value[1] == '全部' ? e.detail.value[0] : (e.detail.value[1].length > 4 ? e.detail.value[1].slice(0, 4) + "..." : e.detail.value[1]),
      // scrollTop: this.data.headHeight-1,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    })
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
  },

  //地区取消点击
  bindRegionCancel: function () {
    var data = this.data;
    this.setData({
      // scrollTop: this.data.headHeight-1,
      navSel: false
    })
  },

  //搜索框点击
  search: function () {
    wx.navigateTo({
      url: 'search/search',
    })
  },

  //地区组件传值
  regionChange: function(e){
    // console.log(e.detail);
    var data = this.data;
    this.goFrist();
    this.setData({
      province: e.detail.province!='全部'?e.detail.province:'',
      region: e.detail.city!='全部'?e.detail.city:'',
      regionMsg: e.detail.province == '全国'||e.detail.city == '全部' ? e.detail.province : (e.detail.city.length > 4 ? e.detail.city.slice(0, 4) + "..." : e.detail.city),
      // scrollTop: this.data.headHeight-1,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    })
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
  },

  //列表滚动到第一条
  goFrist:function(){
    wx.pageScrollTo({
      scrollTop: this.data.headHeight,
      duration: 300
    })
  },

  //tab筛选
  tabClick:function(e){
    var data=this.data;
    this.setData({
      tabType:e.currentTarget.dataset.type,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    });
    this.goFrist();
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
  },

  //标签点击
  labelClick:function(e){
    var id=e.currentTarget.dataset.id,
        data=this.data;
    this.goFrist();
    this.setData({
      tagId:this.data.tagId==id?'':id,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    });
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId,data.tabType)
  }
})