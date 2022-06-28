// components/area-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['title-cls'],
  properties: {
    title: {
      type: String,
      value: ''
    },
    rightText: {
      type: String,
      value: '更多'
    },
    line: {
      type: Boolean,
      value: true
    },
    showRight: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRight() {
      this.triggerEvent('click')
    }
  }
})
