import { getMVUrl, getMVDetail, getRelatedVideo } from '../../../service/api_movie'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvid: '',
    loading: true,
    mvURLInfo: {}, // 播放地址
    mvDetail: {}, // 视频信息
    relatedVideo: [] // 先关视频
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   mvid: options.id
    // })
    // this.LoadMVUrl()
    // this.LoadMVDetail()
    // this.LoadRelatedVideo()
    this.getPageData(options.id)
  },

  async getPageData(id) {
    // 请求播放地址 getMVUrl(id)
    // 请求视频信息 getMVDetail(id)
    // 请求先关视频 getRelatedVideo(id)
    const [mvURLInfo, mvDetail, relatedVideo] = await Promise.all([getMVUrl(id), getMVDetail(id), getRelatedVideo(id)])

    this.setData({
      mvURLInfo: mvURLInfo.data,
      mvDetail: mvDetail.data,
      relatedVideo: relatedVideo.data,
      loading: false
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})