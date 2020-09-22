// pages/newCenter/newContent/newContent.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    id:'',
    detail:null,//详情信息
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
    dzList: [], //点赞列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    this.setData({
      id: options.id,
      userInfo: app.globalData.userInfo,
      year: Y,
      isIphoneX:app.globalData.isIphoneX
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
    this.setData({
      commentList: [], //评论列表
      commentStart: 1, //起始页
      commentNum: 10, //每页显示条数
      commentStatus: true, //是否还有数据
    })
    var that=this;
     //详情
     app.ajax("/minitax/newcenter/detailse",{
      "id":this.data.id,
    },function(res){
      res.data.data.content=res.data.data.content.replace(/\<img/gi, '<img class="rich-img" ');
      that.setData({
        detail:res.data.data
      })
    });

     //点赞列表
     that.getDzList();
    
    //评论列表
    that.getCommentList(that.data.commentStart, that.data.commentNum, that.data.id);
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
      this.getCommentList(this.data.commentStart, this.data.commentNum, this.data.id);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.detail.title,
      path: '/pages/share/newCenter/newCenter?id='+this.data.id
    }
  },

  //评论列表
  getCommentList: function (current, pageSize, id) {
    var that = this;
    app.ajax("/minitax/list", {
      "current": current,
      "pageSize": pageSize,
      "id": id,
      "type": "6"
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.commentList;
        for (var i in datas) {
          datas[i].discussUsers_change = datas[i].discussUsers.slice(0, 1);
          datas[i].zk = false;
          list_change.push(datas[i])
        }
        that.setData({
          commentList: list_change
        });
      } else {
        that.setData({
          commentStatus: false
        })
      }
    })
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

  //提交评论信息
  subComment: function () {
    var that = this;
    if (this.data.commentMsg != '') {
      app.ajax("/minitax/add", {
        "content": this.data.commentMsg,
        "id": this.data.commentId == '' ? this.data.id : this.data.commentId,
        "status": this.data.commentId == '' ? '1' : '2',
        "type": "6"
      }, function (res) {

        // that.onShow();
        that.setData({
          commentInput: false,
          commentList: [], //评论列表
          commentStart: 1, //起始页
          commentNum: 10, //每页显示条数
          commentStatus: true, //是否还有数据
        });
        that.onShow();
        // that.getCommentList(that.data.commentStart, that.data.commentNum, that.data.id);
      })
    } else {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //评论内容点击
  contentClick: function (e) {
    this.setData({
      commentId: e.currentTarget.dataset.id,
      commentPlaceHolder: '回复 ' + e.currentTarget.dataset.name,
      commentInput: true,
      focus:true
    })
  },

  //展开收起点击
  sqClick: function (e) {
    var data = this.data;
    if (e.currentTarget.dataset.msg == '收起') {
      data.commentList[e.currentTarget.dataset.id].zk = false;
      data.commentList[e.currentTarget.dataset.id].discussUsers_change = data.commentList[e.currentTarget.dataset.id].discussUsers.slice(0, 1);
      this.setData({
        commentList: data.commentList
      })
    } else {
      data.commentList[e.currentTarget.dataset.id].zk = true;
      data.commentList[e.currentTarget.dataset.id].discussUsers_change = data.commentList[e.currentTarget.dataset.id].discussUsers;
      this.setData({
        commentList: data.commentList
      })
    }
  },

  //评论点赞
  plDz: function (e) {
   var target = e.currentTarget.dataset,
     id = target.id,
     index = target.index,
     type=target.type,
     parnetIndex=target.parentindex,
     that=this;
   if (target.parse == 0) {
     app.ajax("/minitax/praiseadd", {
       "id": id,
       "status": 0,
       "type": "9"
     }, function (res) {
       if (res.data.code == 10000) {
         if(type=="hf"){
           console.log(parnetIndex);
           that.data.commentList[parnetIndex].discussUsers_change[index].ifPrase = 1;
           that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum = that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum + 1;
         }else{
           that.data.commentList[index].ifPrase = 1;
           that.data.commentList[index].praiseNum = that.data.commentList[index].praiseNum + 1;
         }
         that.setData({
           commentList: that.data.commentList
         })
       }
     })
   } else {
     app.ajax("/minitax/praiseadd", {
       "id": id,
       "status": 1,
       "type": "9"
     }, function (res) {
       if (res.data.code == 10000) {
         if(type=="hf"){
           console.log(parnetIndex);
           that.data.commentList[parnetIndex].discussUsers_change[index].ifPrase = 0;
           that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum = that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum - 1;
         }else{
           that.data.commentList[index].ifPrase = 0;
           that.data.commentList[index].praiseNum = that.data.commentList[index].praiseNum - 1;
         }
         that.setData({
           commentList: that.data.commentList
         })
       }
     })
   }
 },

 //文章点赞
 wzdzClick:function(e){
   var target = e.currentTarget.dataset,
       data=this.data,
       that=this;
   if (target.parse == 0) {
     app.ajax("/minitax/praiseadd", {
       "id":data.detail.id,
       "status": 0,
       "type": "6"
     }, function (res) {
       if (res.data.code == 10000) {
         data.detail.ifPrase=1;
         data.detail.praiseNum=data.detail.praiseNum+1;
         that.setData({
           detail: data.detail
         });
         that.getDzList();
       }
     })
   } else {
     app.ajax("/minitax/praiseadd", {
       "id":data.detail.id,
       "status": 1,
       "type": "6"
     }, function (res) {
       if (res.data.code == 10000) {
         data.detail.ifPrase=0;
         data.detail.praiseNum=data.detail.praiseNum-1;
         that.setData({
           detail: data.detail
         });
         that.getDzList();
       }
     })
   }
 },
 
  //查看点赞列表
  lookDZlist: function () {
    wx.navigateTo({
      url: '../../industry/industryZCGJ/industryDZ/industryDZ?type=6&id=' + this.data.id,
    })
  },

  //收藏点击
  scClick: function (e) {
    var target = e.currentTarget.dataset,
      data = this.data,
      that = this;
    if (target.collect == 0) {
      app.ajax("/minitax/collect/add", {
        "id": data.detail.id,
        "status": 0,
        "type": "6"
      }, function (res) {
        if (res.data.code == 10000) {
          data.detail.ifCollect = 1;
          // data.detail.collectNum = data.detail.collectNum + 1;
          that.setData({
            detail: data.detail
          });
          // that.onShow();
        }
      })
    } else {
      app.ajax("/minitax/collect/add", {
        "id": data.detail.id,
        "status": 1,
        "type": "6"
      }, function (res) {
        if (res.data.code == 10000) {
          data.detail.ifCollect = 0;
          // data.detail.collectNum = data.detail.collectNum - 1;
          that.setData({
            detail: data.detail
          });
          // that.onShow();
        }
      })
    }
   
  },

  //删除评论点击
  delComment:function(e){
    var target=e.currentTarget.dataset,that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此条评论吗?',
      success (res) {
        if (res.confirm) {
          app.ajax_get("/minitax/discuss/del?id="+target.id,function(res){
            if(res.data.code==10000){
              that.onShow();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

   //指导专家点击
   goPerson: function (e) {
    app.goPerson(e.currentTarget.dataset.id)
  },

  //点赞列表
  getDzList:function(){
    var that=this;
     //点赞列表
     app.ajax("/minitax/praiselist", {
      "current": 1,
      "id": this.data.id,
      "pageSize": 8,
      "type": "6"
    }, function (res) {
      that.setData({
        dzList: res.data.data
      })
    });
  },

  //去个人中心页面
  goPerson: function (e) {
    app.goPerson(e.currentTarget.dataset.id)
  },
})