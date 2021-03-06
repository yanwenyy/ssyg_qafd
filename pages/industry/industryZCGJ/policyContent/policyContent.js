// pages/industry/industryZCGJ/policyContent/policyContent.js
const query = wx.createSelectorQuery()
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    navText: '政策',
    scrollTopscrollTop: 0,
    policyContent: null, //政策详情
    policyId: '', //政策id
    releatfile: [], //相关文件
    releatfileYw: [],//原文的相关文件
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
    commentId: '', //评论id
    tradeDz: null, //定制的行业信息
    dzList: [], //点赞列表,
    // 可拖动按钮
    x: 300 * app.globalData.birpx,
    y: 430 * app.globalData.birpx,
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
      policyId: options.policyId,
      userInfo: app.globalData.userInfo,
      year: Y,
      isIphoneX: app.globalData.isIphoneX
    })


    //获取头部行业信息
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        tradeId: res.data.data.tradeId
      })
      //政策详情
      app.ajax("/minitax/policy/details", {
        "policyId": that.data.policyId,
        "tradeId": that.data.tradeId
      }, function (res) {
        res.data.data.content = res.data.data.content.replace(/\<img/gi, '<img class="rich-img" ');
        res.data.data.content = res.data.data.content.replace(/(\\r)|(\\n)/g, '<br>');
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
    });


    //相关文件
    app.ajax("/minitax/policy/releatfile", {
      "id": this.data.policyId,
      "current": 0,
      "pageSize": 1000,
      "type": "2"
    }, function (res) {
      that.setData({
        releatfile: res.data.data
      })
    });
    //原文相关文件
    app.ajax("/minitax/policy/releatfile", {
      "id": this.data.policyId,
      "current": 0,
      "pageSize": 1000,
      "type": "1",
    }, function (res) {
      that.setData({
        releatfileYw: res.data.data
      })
    });

    //相关解读
    app.ajax("/minitax/policy/expert", {
      "policyId": this.data.policyId,
      "current": 0,
      "pageSize": 1000,
      "type": 1
    }, function (res) {
      that.setData({
        releatedetails: res.data.data
      })
    });

    //评论列表
    that.getCommentList(that.data.commentStart, that.data.commentNum, that.data.policyId);

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
      commentList: [], //评论列表
      commentStart: 1, //起始页
      commentNum: 10, //每页显示条数
      commentStatus: true, //是否还有数据
    })
    var that = this;
    //获取头部行业信息
    app.ajax_nodata("/minitax/select/trade", function (res) {
      that.setData({
        tradeDz: res.data.data
      })
    });

    //点赞列表
    that.getDzList();
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
      this.selectComponent("#discussList").getCommentList(this.data.commentStart, this.data.commentNum);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这是一条与您行业相关的税收政策',
      path: '/pages/share/zcgj/zcgj?id=' + this.data.policyId
    }
  },

  onPageScroll: function (e) {
    // 页面滚动时执行
    // console.log(e.scrollTop);
    this.setData({
      scrollTop: e.scrollTop
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

  //查看点赞列表
  lookDZlist: function () {
    wx.navigateTo({
      url: '../industryDZ/industryDZ?type=1&id=' + this.data.id,
    })
  },

  //相关解读点击
  xgjdClick: function (e) {
    var that = this;
    if (app.ifVip(this.data.policyContent.isVip != 1 && this.data.policyContent.tradePower == 0 && this.data.policyContent.self == 0)) {
      if (e.currentTarget.dataset.type == "xgwj") {
        //政策详情
        app.ajax("/minitax/policy/details", {
          "policyId": e.currentTarget.dataset.id,
          "tradeId": that.data.tradeId
        }, function (res) {
          if (res.data.data) {
            wx.navigateTo({
              url: '/pages/industry/industryZCGJ/policyContent/policyContent?policyId=' + e.currentTarget.dataset.id,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '该政策已被删除或隐藏',
              showCancel: false
            })
          }
        });

      } else if (e.currentTarget.dataset.type == "ywxgwj") {
        var relativePolicyId = e.currentTarget.dataset.id;
        //政策详情
        app.ajax("/minitax/policyoriginal/details", {
          "policyId": that.data.policyContent.policyOriginalId,
        }, function (res) {
          if (res.data.data) {
            wx.navigateTo({
              url: '../../industryZCYW/zcywContent/zcywContent?policyId=' + relativePolicyId,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '该政策下暂无原文，或原文被隐藏',
              showCancel: false
            })
          }
        });

      } else {
        wx.navigateTo({
          url: '../XGJDcontent/XGJDcontent?id=' + e.currentTarget.dataset.id,
        })
      }
    };
  },

  //指导专家点击
  zdzjClick: function (e) {
    app.goPerson(e.currentTarget.dataset.id)
  },

  //评论框点击
  inputClick: function (e) {
    this.setData({
      commentInput: true,
      focus: true,
    })
  },

  //评论框输入
  commentInput: function (e) {
    this.setData({
      commentMsg: e.detail.value
    })
  },

  //评论列表
  getCommentList: function (current, pageSize, id) {
    var that = this;
    app.ajax("/minitax/list", {
      "current": current,
      "pageSize": pageSize,
      "id": id,
      "type": "1"
    }, function (res) {
      var datas = res.data.data;
      console.log(datas)
      if (datas && datas != '') {
        var list_change = that.data.commentList;
        for (var i in datas) {
          datas[i].discussUsers_change = datas[i].discussUsers.slice(0, 1);
          datas[i].zk = false;
          list_change.push(datas[i])
        }
        that.setData({
          commentList: list_change,
          commentData: res.data,
        });
      } else {
        that.setData({
          commentStatus: false
        })
      }
    })
  },

  //提交评论信息
  subComment: function () {
    var that = this;
    if (app.ifVip(this.data.policyContent.isVip != 1 && this.data.policyContent.tradePower == 0 && this.data.policyContent.self == 0)) {
      if (this.data.commentMsg != '') {
        app.ajax("/minitax/add", {
          "content": this.data.commentMsg,
          "id": this.data.commentId == '' ? this.data.policyId : this.data.commentId,
          "status": this.data.commentId == '' ? '1' : '2',
          "type": "1"
        }, function (res) {

          // that.setData({
          //   commentInput: false,
          //   commentList: [], //评论列表
          //   commentStart: 1, //起始页
          //   commentNum: 10, //每页显示条数
          //   commentStatus: true, //是否还有数据
          // });
          // that.getCommentList(that.data.commentStart, that.data.commentNum, that.data.policyId);

          that.setData({
            commentInput: false
          });
          that.selectComponent("#discussList").init();
        })
      } else {
        wx.showToast({
          title: '请输入评论内容',
          icon: 'none',
          duration: 2000
        })
      }
    };
  },

  //评论内容点击
  contentClick: function (e) {
    if (app.ifVip(this.data.policyContent.isVip != 1 && this.data.policyContent.tradePower == 0 && this.data.policyContent.self == 0)) {
      this.setData({
        commentId: e.detail.id,
        commentPlaceHolder: '回复 ' + e.detail.name,
        commentInput: true,
        focus: true,
      })
    }
  },

  //文章点赞
  wzdzClick: function (e) {
    var target = e.currentTarget.dataset,
      data = this.data,
      that = this;
    if (target.parse == 0) {
      app.ajax("/minitax/praiseadd", {
        "id": data.policyContent.id,
        "status": 0,
        "type": "1"
      }, function (res) {
        if (res.data.code == 10000) {
          data.policyContent.ifPrase = 1;
          data.policyContent.praiseNum = data.policyContent.praiseNum + 1;
          that.setData({
            policyContent: data.policyContent
          });
          that.getDzList();
        }
      })
    } else {
      app.ajax("/minitax/praiseadd", {
        "id": data.policyContent.id,
        "status": 1,
        "type": "1"
      }, function (res) {
        if (res.data.code == 10000) {
          data.policyContent.ifPrase = 0;
          data.policyContent.praiseNum = data.policyContent.praiseNum - 1;
          that.setData({
            policyContent: data.policyContent
          });
          that.getDzList();
        }
      })
    }

  },

  //收藏点击
  scClick: function (e) {
    var target = e.currentTarget.dataset,
      data = this.data,
      that = this;
    if (target.collect == 0) {
      app.ajax("/minitax/collect/add", {
        "id": data.policyId,
        "status": 0,
        "type": "1"
      }, function (res) {
        if (res.data.code == 10000) {
          data.policyContent.ifCollect = 1;
          // data.policyContent.collectNum = data.policyContent.collectNum + 1;
          that.setData({
            policyContent: data.policyContent
          });
          // that.onShow();
        }
      })
    } else {
      app.ajax("/minitax/collect/add", {
        "id": data.policyId,
        "status": 1,
        "type": "1"
      }, function (res) {
        if (res.data.code == 10000) {
          data.policyContent.ifCollect = 0;
          // data.policyContent.collectNum = data.policyContent.collectNum - 1;
          that.setData({
            policyContent: data.policyContent
          });
          // that.onShow();
        }
      })
    }
  },

  //去vip页面
  goVip() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },

  //点赞列表
  getDzList: function () {
    var that = this;
    //点赞列表
    app.ajax("/minitax/praiselist", {
      "current": 1,
      "id": that.data.policyId,
      "pageSize": 8,
      "type": "1"
    }, function (res) {
      that.setData({
        dzList: res.data.data
      })
    });
  },

  //可拖动按钮
  transmit(e) {
    var that = this;
    //政策详情
    app.ajax("/minitax/policyoriginal/details", {
      "policyId": that.data.policyContent.policyOriginalId,
    }, function (res) {
      if (res.data.data) {
        wx.navigateTo({
          url: '../../industryZCYW/zcywContent/zcywContent?policyId=' + that.data.policyContent.policyOriginalId,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '该政策下暂无原文，或原文被隐藏',
          showCancel: false
        })
      }
    });

  },

  //去个人中心页面
  goPerson: function (e) {
    console.log(1111)
    app.goPerson(e.currentTarget.dataset.id)
  },
})