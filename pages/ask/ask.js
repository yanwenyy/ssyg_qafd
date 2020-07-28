// pages/ask/ask.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    imgList: [], //添加图片list,
    content: '', //输入的问题
    industry: [], //行业
    industrySelName: '', //行业选中数组id
    industrySelId: '', //行业选中数组name
    ifClick: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //行业
    app.ajax_wzx("category/tree/third", {}, function (res) {
      console.log(res)
      that.setData({
        industry: res.data.categorys
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

  //提交信息
  subMsg: function () {
    var that = this;
    if (this.data.ifClick) {
      wx.showLoading({
        title: '提交中',
      })
      console.log(this.data.content);
      console.log(this.data.industrySelId)
      this.data.ifClick = false;
      if (this.data.content != '' && this.data.industrySelId != '') {
        app.ajax_wzx("/question/releaseQuestion/third", {
          "content": this.data.content,
          "payType": "free",
          "money": 10,
          "trade": this.data.industrySelName,
          "images": this.data.imgList,
          "thirdUserHeadImg": app.globalData.userInfo.headImg,
          "uuid": app.globalData.userInfo.uuid,
          "thirdUserName": app.globalData.userInfo.realName || app.globalData.userInfo.userName,
          "source": 2,
          "area": app.globalData.userInfo.province != null && app.globalData.userInfo.province != 'null' ? app.globalData.userInfo.province : null,
        }, function (res) {
          console.log(res);
          var uuid=res.data.uuid;
          if (res.data.code == 1) {
            wx.hideLoading();
            app.ajax_nodata("/applet/reduceQuestionNum", function (res) {
              app.ajax_get("/applet/addQuestionRecord?uuid=" +uuid, function (res) {
                that.setData({
                  ifClick: true
                })
                wx.navigateBack();
              })
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }

        })
      } else {
        this.data.ifClick = true;
        wx.showToast({
          title: '问题或行业不能为空',
          icon: 'none',
          duration: 2000
        })
      }
    }

  },

  //选择图片
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        var imgList = that.data.imgList;
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: "base64", //这个是很重要的
          success: res => { //成功的回调
            //返回base64格式
            imgList.push(res.data);
            that.setData({
              imgList: imgList
            })
            //console.log(that.data.imgList)
          }
        })

      }
    })
  },

  //删除图片
  delImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var imgList = this.data.imgList;
    app.remove(imgList, src);
    this.setData({
      imgList: imgList
    })
  },

  //图片预览
  imgLook: function (e) {
    var that = this;
    var imgLook = [],
      i, imgList = that.data.imgList;
    for (i in imgList) {
      imgLook.push('data:image/png;base64,' + imgList[i])
    }
    wx.previewImage({
      current: 'data:image/png;base64,' + e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgLook // 需要预览的图片http链接列表
    })
  },

  //输入问题
  contentInput: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  //行业列表点击
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    // this.data.userInfo.trade = null;
    this.setData({
      industrySelId: e.detail.value
    })
  },
  hyLabelClick: function (e) {
    var num = e.currentTarget.dataset.index,
      name = e.currentTarget.dataset.name;
    this.data.industrySelName = name;
  },
  hySub: function () {
    var industrySelName = this.data.industrySelName;
    var industry = this.data.industry;
    console.log(industrySelName)
    this.setData({
      industrySelName: industrySelName,
      industry: industry,
      shadow: false,
    })
  },

  //关闭弹窗
  closeShadow: function () {
    this.setData({
      shadow: false,
    })
  },

  //行业选择点击
  hyClick: function () {
    this.setData({
      shadow: true
    })
  },
})