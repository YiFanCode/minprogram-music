// custom-tab-bar/index.js
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
    currentIndex: 0,
    list: [{
      pagePath: "/pages/home-music/index",
      iconPath: "/assets/images/tabbar/music_normal.png",
      selectedIconPath: "/assets/images/tabbar/music_active.png",
      text: "音乐"
    }, {
      pagePath: "/pages/home-video/index",
      iconPath: "/assets/images/tabbar/video_normal.png",
      selectedIconPath: "/assets/images/tabbar/video_active.png",
      text: "视频"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset
      wx.switchTab({
        url: path
      })
      this.setData({
        currentIndex: index
      })
    }
  }
})
