// pages/mine/mine/set/set.js
const app = getApp();
const md5 = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    phone: '', //手机号
    code: '', //验证码
    smsMessageSid: '', //验证码id
    imgCodeid: '', //图形验证码id
    imgcode: '', //输入的图形验证码
    imgcodeSrc: '', //图形验证码src
    shadow: false, //弹窗显示状态
    userInfo: '',
    nums: 61, //倒计时秒数
    clock: '', //
    codeMsg: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    this.data.userInfo='';
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.ajax("/wx/applet/userinfo", {
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": app.globalData.logMsg.openid,
          "phone": app.globalData.logMsg.phone,
          "rawData": res.rawData,
          "signature": res.signature,
          "userType":'MINITAX'
        }, function (data) {
          var data = data.data.data;
          that.setData({
            userInfo: data
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //打开弹窗
  openShadow: function() {
    this.getImgCode();
    this.setData({
      shadow: true
    });
  },

  //关闭弹窗
  closeShadow: function() {
    this.setData({
      shadow: false
    })
  },

  //提交手机号
  subPhone: function() {
    var that = this;
    if (this.data.phone != '' && this.data.code != "") {
      app.ajax("/applet/editPhone", {
        "phone": this.data.phone,
        "smsCode": this.data.code,
        "smsMessageSid": this.data.smsMessageSid,
        "imgCode": this.data.imgcode,
        "imgCodeSid": this.data.imgCodeid,
      }, function(res) {
        console.log(res);
        if (res.data.code == 10000) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.data.userInfo.phone = that.data.phone;
          that.setData({
            shadow: false,
            userInfo: that.data.userInfo
          });
          //that.onShow();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请完善信息!',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //解除手机绑定
  delCompany: function() {
    var that = this;
    wx.showModal({
      title: '解除公司绑定',
      content: '您确认解除当前绑定么?解除后将不能继续使用企业会员权限！',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.ajax_nodata("/applet/untyingStateion", function(res) {
            console.log(res);
            if (res.data.code == 10000) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              });
             wx.navigateBack()
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //退出登录点击
  toLogin: function() {
    wx.reLaunch({
      url: '../../scope/scope',
    })
  },

  //手机号输入
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //验证码输入
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  //图形验证码输入
  imgCodeInput: function(e) {
    this.setData({
      imgcode: e.detail.value
    })
  },

  //获取验证码点击
  sedCode: function(e) {
    var that = this;
    if (e.currentTarget.dataset.msg =="获取验证码"){
      if (this.data.phone == '' || this.data.imgcode == '') {
        wx.showToast({
          title: '手机号和图形验证码不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      };

      var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!reg.test(this.data.phone) && this.data.phone != '') {
        wx.showToast({
          title: '手机号码输入有误!',
          icon: 'none',
          duration: 2000
        })
        return false;
      };

      //请求验证码
      app.ajax("/applet/sendSms", {
        "codeType": "update",
        "phoneNum": this.data.phone,
        "imgCode": this.data.imgcode,
        "imgCodeSid": this.data.imgCodeid,
      }, function (res) {
        if (res.data.code == 10000) {
          that.setData({
            smsMessageSid: res.data.data
          });
          that.clock = setInterval(function () {
            that.data.nums--;
            if (that.data.nums > 0) {
              that.setData({
                codeMsg: '重新发送(' + that.data.nums + ')'
              })
            } else {
              clearInterval(that.clock); //清除js定时器
              that.setData({
                codeMsg: '获取验证码'
              })
              that.data.nums = 61; //重置时间
            }
          }, 1000);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{

    }
   
  },

  //获取图形验证码
  getImgCode:function(){
    //获取图片验证码
    var timestamp = new Date().getTime();
    var sjstring = Math.random().toString(36).substr(2);
    var codemessages = md5.hex_md5(sjstring + timestamp); //手机号+时间戳的MD5加密
    this.setData({
      imgCodeid: codemessages,
      imgcodeSrc: app.public().url + "/RandomCodeImage/randCode/" + codemessages + ""
    })
  },

  //去免责声明页面
  goDis:function(){
    wx.navigateTo({
      url: '../disclaimers/disclaimers',
    })
  }
})