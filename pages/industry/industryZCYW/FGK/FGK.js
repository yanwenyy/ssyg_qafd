// pages/industry/industryZCYW/FGK/FGK.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
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
    tabType: 'hy',//行业,普适筛选
    labelList: [],//标签列表
    tagId: '',//标签id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //税种列表
    app.ajax("/minitax/tax/list", {
      type: 1
    }, function (res) {
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
      type: 1
    }, function (res) {
      that.setData({
        timeList: res.data.data
      })
    });

    //标签列表
    app.ajax("/minitax/tag/list", {
      type: 1
    }, function (res) {
      that.setData({
        labelList: res.data.data
      })
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
    var data = this.data,that=this;
    //获取头部行业信息
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        headTrade: res.data.data,
        tradeId: res.data.data.tradeId,
        navSel: false,
        start: 1, //起始页
        num: 10, //每页显示条数
        status: true, //是否还有数据
        list: [],
      })
      that.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year, data.tagId)
    });
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

  //导航点击事件
  navClick: function (e) {
    this.setData({
      // scrollTop: this.data.headHeight+1,
      navText: e.currentTarget.dataset.txt,
      navSel: e.currentTarget.dataset.region != 'yes' ? true : false
    });
  },

  //导航筛选点击
  navOptClick: function (e) {
    var data = this.data;
    var dataset = e.currentTarget.dataset;
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
        timeMsg: dataset.msg.length < 4 ? dataset.msg : dataset.msg.slice(0, 4) + ".."
      });
    }
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year, data.tagId)
  },

  //政策列表点击
  zcClick: function (e) {
    wx.navigateTo({
      url: '../zcywContent/zcywContent?policyId=' + e.currentTarget.dataset.id,
    })
  },

  //获取列表
  getList: function (current, pageSize, tradeId, province, region, taxId, timeLinessId, year, tagId) {
    var that = this;
    app.ajax('/minitax/policyoriginal/list', {
      "current": current,
      "pageSize": pageSize,
      // "tradeId": tradeId,
      "province": province,
      "region": region,
      "taxId": taxId,
      "timeLinessId": timeLinessId,
      "year": year,
      "tagId": tagId
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

  //加载更多
  getMore:function(){
    var data = this.data;
    if (this.data.status == true) {
      var start = this.data.start + 1
      this.setData({
        start: start
      });
      this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year,data.tagId)
    }
  },

  //搜索框点击
  search: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  //地区组件传值
  regionChange: function (e) {
    // console.log(e.detail);
    var data = this.data;
    this.setData({
      province: e.detail.province != '全部' ? e.detail.province : '',
      region: e.detail.city != '全部' ? e.detail.city : '',
      regionMsg: e.detail.province == '全国' || e.detail.city == '全部' ? e.detail.province : (e.detail.city.length > 4 ? e.detail.city.slice(0, 4) + "..." : e.detail.city),
      // scrollTop: this.data.headHeight-1,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    })
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year, data.tagId)
  },

  //tab筛选
  tabClick: function (e) {
    this.setData({
      tabType: e.currentTarget.dataset.type
    });
  },

  //标签点击
  labelClick: function (e) {
    var id = e.currentTarget.dataset.id,
      data = this.data;
    this.setData({
      tagId: this.data.tagId == id ? '' : id,
      navSel: false,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    });
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year, data.tagId)
  },

  //税种点击
  taxClick: function (e) {
    var id = e.currentTarget.dataset.id,
      data = this.data;
    this.setData({
      taxId: id,
      start: 1, //起始页
      num: 10, //每页显示条数
      status: true, //是否还有数据
      list: [],
    });
    this.getList(data.start, data.num, data.tradeId, data.province, data.region, data.taxId, data.timeLinessId, data.year, data.tagId)
  }
})