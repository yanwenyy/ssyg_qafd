// components/shareModel/shareModel.js
const app = getApp();
const base64src = require('../../utils/base64src.js');
var imgUrl=app.globalData.imgUrl;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String, //分享标题
      value: ''
    },
    shareName: {
      type: String, //分享来源
      value: ''
    },
    shareUrl: {
      type: String, //分享page
      value: ''
    },
    shadow: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userInfo: null,
    // 分享
    screenWidth: '',//屏幕宽
    screenHeight: '',//屏幕高
    shadow: true,
    shadowTitle: '', //分享弹框标题
    shareName: '',
    share_pintuan_productid: 0,
    phonewidth: 750,
    fixwidth: 750,
    margin: 0,
    canvas: false,
    code_src: '', //小程序码
    qrcodeUrl: '', //转换的base64
    headImg: '', //分享的用户头像
    //分享结束
  },

  observers: {
    'shadow': function (shadow) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      if (shadow) {
        wx.hideTabBar();
      } else {
        wx.showTabBar();
      }
    }
  },

  ready: function () {
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      screenWidth: wx.getSystemInfoSync().windowWidth,
      screenHeight: wx.getSystemInfoSync().windowHeight,
      margin: this.data.screenHeight
    });
    //画网络图片需先解码
    wx.getImageInfo({
      src: that.data.userInfo.headImg,
      success: function (res) {
        console.log(res.path)
        that.setData({
          headImg: res.path
        })
      }
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //关闭分享
    closeShadow: function () {
      this.setData({
        shadow: false
      })
    },

    /**
     * 生成分享图
     */
    share: function () {
      var that = this;
      if (this.properties.shareName == "yqts") {
        this.saveCode('pages/share/acspetYq/acspetYq?uuid=' + this.data.userInfo.uuid)
      } else if (this.properties.shareName == "yqhy") {
        this.saveCode('pages/index/index')
      }
    },

    /**
     * 保存到相册
     */
    save: function () {
      var that = this;
      console.log(that.data.prurl)
      //生产环境时 记得这里要加入获取相册授权的代码
      wx.saveImageToPhotosAlbum({
        filePath: that.data.prurl,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好哒',
            confirmColor: '#72B9C3',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                that.setData({
                  canvas: false,
                  margin: that.data.screenHeight,
                })
                // setTimeout(function () {
                //   wx.navigateBack({});
                // }, 1000)
              }
            }
          })
        },
        fail: function (err) {
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    console.log("settingdata", settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击图片即可保存',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      })
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData)
                  },
                  complete(finishData) {
                    console.log("finishData", finishData)
                  }
                })
              }
            })
          }
        },
      })

    },

    //小程序码
    saveCode: function (url) {
      var that = this;
      //小程序码
      app.ajax_nodata("/applet/trade/getaccesstoken", function (res) {
        if (res.data.code == 10000) {
          app.ajax("/applet/trade/getorcode", {
            // "accessToken": res.data.data,
            "path": url,
            "width": 430,
            "hyaline": true,
            "autoColor":false,
            "r": "238", 
            "g": "238", 
            "b": "238"
          }, function (res) {
            // console.log(res);
            var base64 = base64src.base64src("data:image/png;base64," + res.data.data);
            base64.then(function (filePath) {
              // console.log(filePath);
              that.setData({
                qrcodeUrl: filePath
              })
              that.data.qrcodeUrl = filePath;
              if (that.data.shareName == "yqts") {
                that.canvasYqts();
              } else {
                that.canvasFxdy();
              }
            });
            that.setData({
              code_src: res.data.data
            });

          })
        }
      })
    },

    //邀请同事canvas
    canvasYqts: function () {
      var that = this;
      const ctx = wx.createCanvasContext('shareImg', this);
      var unit = that.data.screenWidth / 375;
      ctx.rect(0, 0, unit * 297, unit * 356)
      ctx.setFillStyle('#fff')
      ctx.fill();
      ctx.drawImage(imgUrl+'/yqts-bg.png', unit * 22, unit * 23, unit * 260, unit * 304);
      ctx.save();
      ctx.setFontSize('19');
      ctx.setFillStyle('#9B601F');
      ctx.setTextBaseline('top');
      ctx.fillText('加入企业邀请', (297 - ctx.measureText('加入企业邀请').width) / 2, 56);
      ctx.save();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(unit * 73, unit * 130, unit * 24, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(this.data.headImg, unit * 49, unit * 106, unit * 48, unit * 48);
      ctx.restore();
      ctx.setFontSize('17');
      ctx.setFillStyle('#333');
      ctx.fillText(this.data.userInfo.nickname || this.data.userInfo.userName, unit * 49, unit * 168);
      ctx.setFontSize('16');
      ctx.setFillStyle('#333');
      ctx.fillText('邀请您加入企业', unit * 49, unit * 195);
      ctx.closePath();
      ctx.beginPath();
      ctx.rect(unit * 38, unit * 229, unit * 226, unit * 65);
      ctx.setFillStyle("#FCF9F6");
      ctx.fill();
      ctx.setStrokeStyle("#E2B279");
      ctx.stroke();
      ctx.drawImage(imgUrl+'/conform-order-icon.png', unit * 59, unit * 244, unit * 14, unit * 16);
      ctx.setFontSize('15');
      ctx.setFillStyle('#B07937');
      var str = this.data.userInfo.companyName || '';
      ctx.fillText(str.slice(0, 11), unit * 78, unit * 246);
      str.length > 11 ? ctx.fillText(str.slice(11, 22), unit * 78, unit * 266) : '';
      ctx.save();
      ctx.setFillStyle("#F7FCFB");
      ctx.fillRect(0, unit * 356, unit * 297, unit * 118);
      ctx.setFontSize('14');
      ctx.setFillStyle('#333');
      ctx.fillText('行税之星系统 ', unit * 24, unit * 399);
      ctx.setFontSize('12');
      ctx.setFillStyle('#999');
      ctx.fillText('长按二维码进入小程序', unit * 24, unit * 417);
      ctx.drawImage(this.data.qrcodeUrl, unit * 197, unit * 375, unit * 73, unit * 73);
      ctx.draw(false, function () {
        wx.showLoading({
          title: '努力生成中...'
        })
        wx.canvasToTempFilePath({
          canvasId: 'shareImg',
          fileType: 'png',
          quality: 1,
          success: function (res) {
            that.setData({
              prurl: res.tempFilePath,
              canvas: true,
              margin: '0',
            });
            wx.hideLoading()
          },
          fail: function (res) {
            console.log(res)
          }
        }, that)
      });
    },

    //分享代言
    canvasFxdy: function () {
      var that = this;
      const ctx = wx.createCanvasContext('shareImg', this);
      var unit = that.data.screenWidth / 375;
      ctx.rect(0, 0, unit * 297, unit * 356)
      ctx.setFillStyle('#fff')
      ctx.fill();
      ctx.drawImage(imgUrl+'/yqts-bg.png', unit * 22, unit * 23, unit * 260, unit * 304);
      ctx.save();
      ctx.arc(72, 70, 18, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(this.data.headImg, 54, 52, 37, 37);
      ctx.restore();
      ctx.setFontSize('16');
      ctx.setFillStyle('#333');
      ctx.fillText(this.data.userInfo.realName || this.data.userInfo.userName, 110, 73);
      ctx.fillText('我为“省税一哥”代言', 54, 116);
      // ctx.drawImage(imgUrl+'/yqts-share-dy.png', 44, 149, 209, 122);
      ctx.setFontSize('7');
      ctx.setFillStyle('#fff');
      ctx.fillText('省税一哥', 20, 400);
      ctx.setFontSize('10');
      ctx.fillText('您的财税顾问', 20, 422);
      // ctx.drawImage("data:image/png;base64," + this.data.code_src, 212, 346, 66, 66);
      ctx.drawImage(this.data.qrcodeUrl, 212, 346, 66, 66);
      ctx.fillText('长按二维码查看', 212, 430);
      ctx.draw(false, function () {
        wx.showLoading({
          title: '努力生成中...'
        })
        wx.canvasToTempFilePath({
          // x: 0,
          // y: 0,
          // width: 297,
          // height: 454,
          // destWidth: 1188,
          // destHeight: 1816,
          canvasId: 'shareImg',
          fileType: 'png',
          quality: 1,
          success: function (res) {
            that.setData({
              prurl: res.tempFilePath,
              canvas: true,
              margin: '0',
            });
            wx.hideLoading()
          },
          complete: function (res) {
            console.log(res)
          }
        }, that)
      });
    },

    //关闭生成分享图
    closeCanvas: function () {
      this.setData({
        canvas: false,
        margin: this.data.screenHeight,
      })
    }
  }
})