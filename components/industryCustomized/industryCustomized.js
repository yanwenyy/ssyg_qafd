// pages/industry/industryCustomized/industryCustomized.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    mask:true,
    items: [],
    selectId:'',//选中的id
  },
  ready:function(){
    var that=this;
    app.ajax_nodata("/minitax/tradelist",function(res){
      that.setData({
        items:res.data.data,
        selectId:res.data.data[0].tradeId
      })
    })
    // app.cookieIdReadyCallback = res => {
    //   console.log(4444)
    //   wx.request({
    //     url: app.public().url +'/minitax/tradelist', //仅为示例，并非真实的接口地址
    //     method: "POST",
    //     header: {
    //       'content-type': 'application/json', // 默认值
    //       'cookieId': res.data.data.cookieId
    //     },
    //     success(res) {
    //       that.setData({
    //         items:res.data.data,
    //         selectId:res.data.data[0].tradeId
    //       })
    //       console.log(that.data.items)
    //     }
    //   })
    // }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹框
    closeMask:function(){
      this.setData({
        mask:false
      });
      this.update(this.data.selectId)
    },
    //行业改变
    radioChange: function (e) {
      this.setData({
        selectId:e.detail.value
      })
    },

    //确定按钮点击
    subMsg:function(){
      this.setData({
        mask:false
      });
      // console.log(this.data.selectId)
      this.update(this.data.selectId)
    },

    //提交信息
    update:function(id){
      var that=this;
      app.ajax_nodata("/minitax/trade/custome/"+id,function(res){
        console.log(res)
        if(res.data.code==10000){
          var myEventDetail = {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          that.triggerEvent('myevent', myEventDetail, myEventOption)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})
