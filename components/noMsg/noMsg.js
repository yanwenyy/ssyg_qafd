// components/noMsg/noMsg.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: String,
      value: '',
    },
    imgUrl:{
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    appimgUrl:app.globalData.imgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
