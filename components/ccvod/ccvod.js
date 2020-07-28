// let calldata = require('../../app.js');
let app = getApp();
Component({
  // 组件外部样式
  externalClasses:['course-video'],
  /**
   * 组件的属性列表
   */
  properties: {
    vid: {
      type: String,
      value: '',
    },
    siteid: {
      type: String,
      value: '',
    },
    vc: {
      type: String,
      value: '',
    },
    custom_id: {
      type: String,
      value: ''
    },
    show:{//显示类型
      type: String,
      value: ''
    },
    title: {//显示类型
      type: String,
      value: ''
    },
    videoPoster:{//视频封面
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    videoSrcList: [], // 获取视频地址列表
    videoSrc: '', // 显示的视频地址
    videoPoster: '', // 视频封面
    videoControls: false, // controls
    isPlaying: false, // 是否正在播放
    percent: 0, // 进度条
    cPlayBtn: false,
    dragBtnleft: -15, // 进度条按钮
    vCurrentTime: 0, // video播放时间
    vDuration: 0, // video总时间
    second_width: 0, // 手机宽度
    uaModel: 'iPhone', //ua信息，用于接口请求参数
    ccH5TimeCurrent: '00:00',
    ccH5TimeTotal: '00:00',
    btnsShow: true, // 界面显示隐藏
    interFaceShow: true, // 界面按钮显示隐藏
    ccH5spTxt: '常速',
    spShow: false, // 倍速显示隐藏
    hdShow: false, // 清晰度显示隐藏
    ccH5hdTxt: '', // 清晰度按钮信息
    authenable: null, // 授权播放
    freetime: null, // 授权播放时间
    authmessage: '', // 授权播放提示信息
    isPlayAuth: false, // 授权播放界面隐藏
    videoBoxShow: true, // video盒子显示
    authCallback: null, // 授权播放回调
    authOpen: false,
    custom_id: '',
    spList: [
      {
        "num": "1.5",
        "txt": "1.5倍",
      },
      {
        "num": "1.25",
        "txt": "1.25倍",
      },
      {
        "num": "1",
        "txt": "常速",
      },
      {
        "num": "0.8",
        "txt": "0.8倍",
      },
    ],
  },
  ready: function () {
    this.ccVideo = wx.createVideoContext('ccVideo', this)
   
    let that = this;
    let vid = this.data.vid;
    let siteid = this.data.siteid;
    let vc = this.data.vc;
    let custom_id = this.data.custom_id;

    let res = wx.getSystemInfoSync();
    let uaModel = 'iPhone';
    let lowerCaseModel = res.system.toLowerCase();
    if (lowerCaseModel.startsWith('android')) {
      uaModel = 'Android';
    }

    // 计算主体部分高度,单位为px
    that.setData({
      uaModel: uaModel,
      second_width: res.windowWidth
    });

    this.getData(vid, siteid, vc, that.showPlayer);
    if (this.data.show == 'radio'){
      // let myaudio = wx.createAudioContext('myAudio');
      // if (wx.setInnerAudioOption) {
      //   wx.setInnerAudioOption({
      //     obeyMuteSwitch: false,
      //     autoplay: true
      //   })
      // } else {
      //   myaudio.obeyMuteSwitch = false;
      //   myaudio.autoplay = true;
      // }

      // //监听各个阶段
      // myaudio.onCanplay(() => {
      //   console.log('可以播放');
      // });
      // myaudio.onPlay(() => {
      //   console.log('监听到音频开始播放');
      // });
      // myaudio.onEnded(() => {
      //   console.log('音频自然播放结束事件');
      // });
      // myaudio.onStop(() => {
      //   console.log('音频停止事件');
      // });
      // myaudio.onError((res) => {
      //   console.log(res.errMsg);
      //   console.log(res.errCode);
      // });
      // myaudio.onWaiting((res) => {
      //   console.log('音频加载中事件，当音频因为数据不足，需要停下来加载时会触发')
      // });
    }
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 播放器点击播放
    videoPlay: function () {
      if (this.data.authenable == 0 && this.data.authOpen == false) {
        this.playAuth();
        this.setData({
          authOpen: true,
        })
      }
      if (this.data.isPlaying == false) {
        this.ccVideo.play();
        this.setData({
          isPlaying: true
        })
      } else {
        this.ccVideo.pause();
        this.setData({
          isPlaying: false
        })
      }
    },

    // 监听video暂停事件
    vPause: function () {
      this.setData({
        isPlaying: false
      })
    },

    // 监听video播放事件
    vPlay: function () {
      this.setData({
        isPlaying: true
      })
    },

    // 点击切换倍速
    changeSpeed: function (e) {
      if (e.target.dataset.txt == this.data.ccH5spTxt) {
        this.setData({
          spShow: false,
        })
        return;
      }
      let index = e.target.dataset.key;
      let spNum = e.target.dataset.num;
      let spTxt = e.target.dataset.txt;
      this.setData({
        ccH5spTxt: spTxt,
        spShow: false,
      })
      this.ccVideo.playbackRate(Number(spNum));
    },

    // 点击切换清晰度
    changeQuality: function (e) {
      if (e.target.dataset.txt == this.data.ccH5hdTxt) {
        this.setData({
          hdShow: false,
        })
        return;
      }
      let hdTxt = e.target.dataset.txt;
      let vTime = this.data.vCurrentTime;
      let hdUrl = '';
      if (!!this.data.custom_id) {
        hdUrl = e.target.dataset.url + '&custom_id=' + this.data.custom_id;
      } else {
        hdUrl = e.target.dataset.url;
      }
      this.setData({
        ccH5spTxt: '常速',
        ccH5hdTxt: hdTxt,
        videoSrc: hdUrl,
        hdShow: false
      })
      let that = this;
      this.ccVideo.playbackRate(1);
      setTimeout(function () {
        that.ccVideo.seek(vTime);
        that.ccVideo.play();
      }, 300)
    },

    // 点击显示隐藏倍速列表
    clickSpShow: function () {
      if (this.data.spShow == true) {
        this.setData({
          spShow: false,
          hdShow: false,
        })
      } else {
        this.setData({
          spShow: true,
          hdShow: false,
        })
      }
    },

    // 点击显示隐藏清晰度列表
    clickHdShow: function () {
      if (this.data.hdShow == true) {
        this.setData({
          spShow: false,
          hdShow: false
        })
      } else {
        this.setData({
          spShow: false,
          hdShow: true
        })
      }
    },

    // 界面显示隐藏
    clickBtnsShow: function () {
      if (this.data.interFaceShow == false) {
        this.setData({
          interFaceShow: true,
          spShow: false,
          hdShow: false
        })
      } else {
        this.setData({
          interFaceShow: false,
          spShow: false,
          hdShow: false
        })
      }
    },

    // 监听播放器的播放进度
    vTimeupdate: function (e) {
      this.setData({
        ccH5TimeCurrent: this.timeFormat(e.detail.currentTime),
        ccH5TimeTotal: this.timeFormat(e.detail.duration),
        dragBtnleft: e.detail.currentTime / e.detail.duration * (this.data.second_width - 116) - 15,
        percent: e.detail.currentTime / e.detail.duration * 100,
        vCurrentTime: e.detail.currentTime,
        vDuration: e.detail.duration,
      })
    },

    // 时间转成00:00格式
    timeFormat: function (time) {
      var t = parseInt(time),
        h, i, s;
      h = Math.floor(t / 3600);
      h = h ? (h + ':') : '';
      i = h ? Math.floor(t % 3600 / 60) : Math.floor(t / 60);
      s = Math.floor(t % 60);
      i = i > 9 ? i : '0' + i;
      s = s > 9 ? s : '0' + s;
      return (h + i + ':' + s);
    },

    // 全屏播放
    fullScreen: function () {
      this.ccVideo.requestFullScreen();
    },

    // 监听全屏后显示系统进度条
    vFullScreen: function (e) {
      if (e.detail.fullScreen) {
        this.setData({
          videoControls: true,
          cPlayBtn: true,
          btnsShow: false,
        })
      } else {
        this.setData({
          videoControls: false,
          cPlayBtn: false,
          btnsShow: true,
        })
      }
    },

    // 拖拽跳转时间
    dragTime: function (e) {
      this.ccVideo.pause();
      if (e.touches[0].clientX <= 56) {
        this.setData({
          dragBtnleft: -15,
          percent: 0,
          vCurrentTime: 0,
        })
      } else if (e.touches[0].clientX >= this.data.second_width - 56) {
        this.setData({
          dragBtnleft: this.data.second_width - 131,
          percent: 100,
          vCurrentTime: this.data.vDuration,
        })
      } else {
        this.setData({
          dragBtnleft: e.touches[0].clientX - 73,
          percent: (e.touches[0].clientX - 58) / (this.data.second_width - 116) * 100,
          vCurrentTime: this.data.vDuration * this.data.percent / 100
        })
      }
    },

    // 拖拽抬起跳转时间
    dragTimeEnd: function () {
      let that = this;
      this.ccVideo.seek(this.data.vCurrentTime);
      setTimeout(function () {
        that.ccVideo.play();
      }, 300);
    },

    // 播放授权
    playAuth: function () {
      let that = this;
      if (this.data.authmessage == '') {
        this.setData({
          authmessage: '不允许观看或试看时间用尽',
        })
      }
      if (this.data.freetime == 0) {
        this.setData({
          isPlayAuth: true,
          videoBoxShow: false,
        })
        if (that.data.authCallback != '') {
          if (typeof app[that.data.authCallback] == "function") {
            app[that.data.authCallback]();
          }
        }
      } else {
        let freeT = setInterval(function () {
          if (that.data.vCurrentTime >= that.data.freetime) {
            clearTimeout(freeT);
            that.setData({
              isPlayAuth: true,
              videoBoxShow: false,
              authOpen: false,
            })
            if (that.data.authCallback != '') {
              if (typeof that.data.authCallback == "function") {
                that.data.authCallback();
              }
            }
          }
        }, 500);
      }
    },

    // 获取视频后的回调
    showPlayer: function (that, data) {
      data = data.substring(data.indexOf('(') + 1, data.length - 1);
      let dataObj = JSON.parse(data);

      // custom_id
      let custom_id = that.data.custom_id;
      let vSrc = '';
      if (!!that.data.custom_id) {
        vSrc = dataObj.copies[0].playurl + '&custom_id=' + custom_id;
      } else {
        vSrc = dataObj.copies[0].playurl
      }

      that.setData({
        videoSrcList: dataObj.copies,
        videoSrc: vSrc,
        videoPoster: dataObj.img,
        ccH5hdTxt: dataObj.copies[0].desp,
      })
      if (dataObj.authenable == 0) {
        that.setData({
          authenable: dataObj.authenable,
          authmessage: dataObj.authmessage,
          authCallback: dataObj.callback,
          freetime: dataObj.freetime,
        })
      }
    },

    // 请求接口
    getData: function (vid, siteid, vc, callback) {
      var _this = this;
      wx.request({
        url: 'https://p.bokecc.com/servlet/getvideofile',
        data: {
          vid: vid,
          siteid: siteid,
          hlssupport: 1,
          useragent: _this.data.uaModel,
          vc: vc,
        },
        header: {
          "Content-Type": "applciation/json"
        },
        method: "GET",
        success: function (res) {
          callback(_this, res.data);
        },
        fail: function (err) { }
      })
    }
  },
})
