// pages/mine/company/teamManage/teamManage.js
const app=getApp();
const base64src = require('../../../utils/base64src.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{},//团队信息
    shadow:false,
    shadowId:'',//操作的用户id
    shadowName:'',//操作用户的姓名
    userInfo:'',//用户信息
    // 分享
    shadow_share: false,
    shadowTitle: '',//分享弹框标题
    shareName: '',
    share_pintuan_productid: 0,
    phonewidth: 750,
    fixwidth: 750,
    margin: 0,
    canvas: false,
    code_src: '',//小程序码
    qrcodeUrl:'',//转换的base64
    headImg: '',//分享的用户头像
    //分享结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.globalData.userInfo.vaildLastTime = app.format(app.globalData.userInfo.vaildLastTime)
    that.setData({
      userInfo:app.globalData.userInfo
    })
    wx.getImageInfo({
      src: that.data.userInfo.headImg,
      success: function (res) {
        console.log(res.path)
        that.setData({
          headImg: res.path
        })
      }
    });
    //团队信息
    app.ajax_nodata("/applet/getStation",function(res){
      that.setData({
        msg:res.data.data
      })
    });

    //小程序码
    app.ajax_nodata("/applet/getAccessToken",function(res){
      if(res.data.code==10000){
        app.ajax("/applet/getQrcode",{
          "accessToken": res.data.data,
          "path": 'pages/share/acceptShareMsg/acceptShareMsg?uuid=' + that.data.userInfo.uuid,
          "width": 430
        },function(res){
          // console.log(res);
          var base64=base64src.base64src("data:image/png;base64,"+res.data.data);
          base64.then(function (filePath) {
            // console.log(filePath);
            that.setData({
              qrcodeUrl: filePath
            })
          });
          that.setData({
            code_src:res.data.data
          })
        })
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
     
    }
    return {
      title: that.data.userInfo.companyName + '邀请您的加入',
      path: 'pages/share/acceptShareMsg/acceptShareMsg?uuid=' + this.data.userInfo.uuid,
      imageUrl: '../../../../img/share-yq.png'
    }
  },
  //去分享页面
  goShare: function (e) {
    this.setData({
      shadow_share: true,
      shareName: e.currentTarget.dataset.name,
      shadowTitle: e.currentTarget.dataset.msg
    })
  },

  //关闭分享
  closeShadowShare: function () {
    console.log(111111)
    this.setData({
      shadow_share: false
    })

  },

  /**
  * 生成分享图
  */
  share: function () {
    var that = this;
    const ctx = wx.createCanvasContext('shareImg');
    ctx.drawImage('../../../../img/canvas-share-bg.png', 0, 0, 297, 454);
    ctx.setFontSize('15');
    ctx.setFillStyle('#333');
    // ctx.setTextAlign('center');
    ctx.fillText(this.data.userInfo.companyName.slice(0,10), 62, 67);
    ctx.fillText(this.data.userInfo.companyName.slice(11, 20), 62, 87);
    ctx.setFillStyle('#F37540')
    ctx.fillRect(62, 95,161, 1.5);
    ctx.save();
    ctx.arc(74, 127, 12, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.headImg, 62, 115, 24, 24);
    ctx.restore();
    ctx.setFontSize('15');
    ctx.setFillStyle('#333');
    ctx.fillText(this.data.userInfo.realName|| this.data.userInfo.userName, 100, 130);
    ctx.setFillStyle('#F56A32');
    ctx.fillText('邀请您加入', 170, 130);
    ctx.drawImage('../../../../img/yqts-share-cp.png', 62, 159, 177, 108);
    ctx.setFontSize('13');
    ctx.setFillStyle('#fff');
    ctx.fillText('省税一哥', 20, 400);
    ctx.setFontSize('10');
    ctx.fillText('您的财税顾问', 20,422);
    // ctx.drawImage("data:image/png;base64," + this.data.code_src, 212, 346, 66, 66);
    ctx.drawImage(this.data.qrcodeUrl, 212, 346, 66, 66);
    ctx.fillText('长按二维码查看', 210, 430);
    ctx.draw(false, function () {
      wx.showLoading({
        title: '努力生成中...'
      })
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 297,
        height: 454,
        destWidth: 1188,
        destHeight: 1816,
        canvasId: 'shareImg',
        fileType:'jpg',
        quality:1,
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
      })
    });

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
                margin: '80%',
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

  //关闭弹窗
  closeShadow:function(){
    this.setData({
      shadow:false
    })
  },

  //打开弹窗
  openShadow:function(e){
    console.log(e)
    this.setData({
      shadow: true,
      shadowId: e.currentTarget.dataset.id,
      shadowName: e.currentTarget.dataset.name,
    })
  },

  //转移管理层
  transferManage:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要转移权限给“' + this.data.shadowName+'”吗？转移后您将失去管理权限',
      success(res) {
        if (res.confirm) {
          app.ajax("/applet/updateStateion", {
            userId: that.data.shadowId
          }, function (res) {
            if (res.data.code == 10000) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                shadow: false
              });
              wx.navigateBack()
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //删除员工
  deletStaff: function () {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除员工么？',
      success(res) {
        if (res.confirm) {
          app.ajax("/applet/deleteStation", {
            userId: that.data.shadowId
          }, function (res) {
            if (res.data.code == 10000) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                shadow: false
              });
              that.onLoad()
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  //去续费点击
  goPay:function(e){
    wx.navigateTo({
      url: '../../../propaganda/propaganda',
    })
  },

  //关闭生成分享图
  closeCanvas: function () {
    this.setData({
      canvas: false,
      margin: '70%',
    })
  }
})