// pages/home-video/index.js
import { getTopMV } from '../../service/api_movie'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    centerLoading: true, //居中loading
    loading: true, // 加载
    topMvs: [], // 请求的数据
    hasMore: true // 是否还有跟多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getTopMvData()
    this.setData({
      centerLoading: false
    })
  },

  // 不传offset参数默认为0
  async getTopMvData(offset) {
    if (!this.data.hasMore && offset) {
      return
    }

    wx.showNavigationBarLoading()
    this.setData({
      loading: true
    })

    const { data, hasMore } = await getTopMV(offset)
    let newData = this.data.topMvs
    // 没有offset参数时为第一次请求数据或刷新
    if (!offset) {
      newData = data
      wx.stopPullDownRefresh()
    } else {
      newData = [...newData, ...data]
    }
    this.setData({
      topMvs: newData,
      hasMore,
      loading: false
    })
    wx.hideNavigationBarLoading()
  },

  videoDetail(event) {
    const { item } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/packageDetail/pages/detail-video/index?id=${item.id}`,
    })
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
  onPullDownRefresh: async function () {
    this.getTopMvData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    this.getTopMvData(this.data.topMvs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})