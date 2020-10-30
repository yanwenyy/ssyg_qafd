// pages/industry/industryZCYW/zcywContent/zcywContent.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    navText: '政策',
    isIphoneX: app.globalData.isIphoneX,
    policyId: '',
    policyContent: null, //政策详情
    fjList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      policyId: options.policyId
    });
    //政策详情
    app.ajax("/minitax/policyoriginal/details", {
      "policyId": that.data.policyId,
    }, function (res) {
      res.data.data.content = res.data.data.content.replace(/\<img/gi, '<img class="rich-img" ');
      res.data.data.content = res.data.data.content.replace(/(\\r)|(\\n)/g, '<br>');
      that.setData({
        policyContent: res.data.data
      });
    });

    //附件列表
    app.ajax("/minitax/annex/list", {
      "id": that.data.policyId,
      "type": "2"
    }, function (res) {
      that.setData({
        fjList: res.data.data
      });
    });

    //相关解读
    app.ajax("/minitax/policy/expert", {
      "policyId": this.data.policyId,
      "current": 0,
      "pageSize": 1000,
      "type": 2
    }, function (res) {
      that.setData({
        releatedetails: res.data.data
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
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
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

  onPageScroll: function (e) {
    // 页面滚动时执行
    // console.log(e.scrollTop);
    this.setData({
      scrollTop: e.scrollTop
    })
  },

    //相关解读点击
    xgjdClick: function (e) {
      var that=this;
      wx.navigateTo({
        url: '../../industryZCGJ/XGJDcontent/XGJDcontent?id=' + e.currentTarget.dataset.id,
      })
      // wx.navigateTo({
      //   url: './zcywContent?policyId=' + e.currentTarget.dataset.id,
      // })
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

  //附件预览
  downLoad: function (e) {
    var that = this,
      dataUrl = "https://" + e.currentTarget.dataset.url;
    var url = "https://" + e.currentTarget.dataset.url,
      fileUrl = url.split("/"),
      fileUrl = fileUrl[fileUrl.length - 1];
    var rootPath = wx.env.USER_DATA_PATH,
      cachePath = rootPath + "/cache";
    wx.getFileSystemManager().access({
      // path: cachePath+"/"+fileUrl,
      path: cachePath + "/" + fileUrl,
      success: function (res) {
        console.log(res);
        wx.openDocument({
          filePath: cachePath + "/" + fileUrl,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        wx.getFileSystemManager().mkdir({
          dirPath: cachePath,
          recursive: true,
          success: function (res) {
            console.log(res);
            that.downLoadHS(dataUrl, cachePath, fileUrl)
          },
          fail: function (res) {
            console.log(res);
            if (res.errMsg.indexOf("already exists") > -1) {
              that.downLoadHS(dataUrl, cachePath, fileUrl)
            }
          }
        })
      }
    })

  },
  downLoadHS: function (url, cachePath, fileUrl) {
    wx.showLoading({
      title: '下载中',
    });
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      filePath: cachePath + '/' + fileUrl,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        wx.hideLoading();
        if (res.statusCode === 200) {
          // const filePath = res.filePath;
          // console.log(filePath+"/"+fileUrl)
          wx.openDocument({
            filePath: res.filePath,
            showMenu: true,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
          console.log(res.filePath)
        }
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading();
        wx.showToast({
          title: "下载失败",
          icon: 'none',
          duration: 2000
        })
      }
    })
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
        "type": "10"
      }, function (res) {
        if (res.data.code == 10000) {
          data.policyContent.ifCollect = 1;
          that.setData({
            policyContent: data.policyContent
          });
        }
      })
    } else {
      app.ajax("/minitax/collect/add", {
        "id": data.policyId,
        "status": 1,
        "type": "10"
      }, function (res) {
        if (res.data.code == 10000) {
          data.policyContent.ifCollect = 0;
          that.setData({
            policyContent: data.policyContent
          });
        }
      })
    }
  },

  //去个人中心页面
  goPerson: function (e) {
    app.goPerson(e.currentTarget.dataset.id)
  },
})