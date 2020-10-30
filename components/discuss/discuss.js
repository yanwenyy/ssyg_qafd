// components/discuss/discuss.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: { // 属性名
      type: String,
      value: ''
    },
    dId: { // 属性名
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.getCommentList(this.data.commentStart, this.data.commentNum);
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    userInfo: null,
    commentList: [],
    commentStart: 1, //起始页
    commentNum: 10, //每页显示条数
    commentStatus: true, //是否还有数据
    commentMsg: '', //评论内容
    commentInput: false, //评论框状态
    commentPlaceHolder: "", //评论框占位符
    commentId: '', //评论id
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      var that = this;
      var timestamp = Date.parse(new Date());
      var date = new Date(timestamp);
      //获取年份  
      var Y = date.getFullYear();
      this.setData({
        userInfo: app.globalData.userInfo,
        year: Y,
        isIphoneX: app.globalData.isIphoneX
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  onReachBottom(){
    console.log(666)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init: function () {
      this.setData({
        commentList: [], //评论列表
        commentStart: 1, //起始页
        commentNum: 10, //每页显示条数
        commentStatus: true, //是否还有数据
      });
      this.getCommentList(this.data.commentStart, this.data.commentNum);
    },
    //评论列表
    getCommentList: function (current, pageSize) {
      var id = this.data.dId;
      var that = this;
      if(this.data.commentStatus){
        app.ajax("/minitax/list", {
          "current": current,
          "pageSize": pageSize,
          "id": id,
          "type": this.data.type
        }, function (res) {
          var datas = res.data.data;
          that.data.commentData=datas.total;
          if (datas && datas != '') {
            var list_change = that.data.commentList;
            for (var i in datas) {
              var _v = datas[i];
              for (var j in _v.discussUsers) {
                var _vChild = _v.discussUsers[j];
                if (_vChild.uDel == 1) {
                  _v.discussUsers.splice(j, 1)
                }
              }
              _v.discussUsers_change = _v.discussUsers.slice(0, 1);
              _v.zk = false;
              list_change.push(_v)
            }
            that.setData({
              commentData: res.data,
              commentList: list_change
            });
          } else {
            that.setData({
              commentStatus: false
            })
          }
        })
      }
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
        type = target.type,
        parnetIndex = target.parentindex,
        that = this;
      if (target.parse == 0) {
        app.ajax("/minitax/praiseadd", {
          "id": id,
          "status": 0,
          "type": "9"
        }, function (res) {
          if (res.data.code == 10000) {
            if (type == "hf") {
              console.log(parnetIndex);
              that.data.commentList[parnetIndex].discussUsers_change[index].ifPrase = 1;
              that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum = that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum + 1;
            } else {
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
            if (type == "hf") {
              console.log(parnetIndex);
              that.data.commentList[parnetIndex].discussUsers_change[index].ifPrase = 0;
              that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum = that.data.commentList[parnetIndex].discussUsers_change[index].praiseNum - 1;
            } else {
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

    //删除评论点击
    delComment: function (e) {
      var target = e.currentTarget.dataset,
        that = this;
      wx.showModal({
        title: '提示',
        content: '确定要删除此条评论吗?',
        success(res) {
          if (res.confirm) {
            app.ajax_get("/minitax/discuss/del?id=" + target.id, function (res) {
              if (res.data.code == 10000) {
               that.init();
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    //评论内容点击
    contentClick: function(e){
      this.triggerEvent('callSomeFun', e.currentTarget.dataset)
    }
  }
})
