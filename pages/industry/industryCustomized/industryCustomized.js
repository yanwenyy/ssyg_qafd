// pages/industry/industryCustomized/industryCustomized.js
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
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'FRA', value: '法国' },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹框
    closeMask:function(){
      this.setData({
        mask:false
      })
    }
  }
})
