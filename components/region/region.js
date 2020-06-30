// components/region/region.js
var districts = require("../../utils/districts.js")
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
    multiArray: [],
    multiIndex: [0, 0],
  },

  ready: function (options) {

    var province = districts[100000], provinceList = [{id:'100002',name:'全部'}];
    for (var i in province) {
      let o = {};
      o.id = i;
      o.name = province[i]
      provinceList.push(o)
    }
    var city = districts[110000], cityList = {id:'0',name:''};
    // for (var i in city) {
    //   let o = {};
    //   o.id = i;
    //   o.name = city[i]
    //   cityList.push(o)
    // }
    this.setData({
      multiArray: [provinceList, cityList]
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindMultiPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      });
      var multiArray=this.data.multiArray,
          multiIndex=this.data.multiIndex;
      var myEventDetail = {
        province:multiArray[0][multiIndex[0]].name,
        city:multiArray[0][multiIndex[0]].name!='全国'&&multiArray[0][multiIndex[0]].name!='全部'?multiArray[1][multiIndex[1]].name:''
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('change', myEventDetail, myEventOption)
    },
    bindMultiPickerColumnChange: function (e) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      if (e.detail.column == 0&&e.detail.name!='全国'&&e.detail.name!='全部') {
        this.setData({
          multiIndex: [e.detail.value, 0]
        });
        var province = this.data.multiArray[0];
        var city = districts[province[e.detail.value].id], cityList = [];
        for (var i in city) {
          let o = {};
          o.id = i;
          o.name = city[i]
          cityList.push(o)
        }
        this.data.multiArray[1] = cityList;
        this.setData({
          multiArray: this.data.multiArray
        })
      }
  
    },
  }
})
