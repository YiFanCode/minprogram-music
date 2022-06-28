// pages/detail-songs/index.js
import { getSongMenuDetail } from '../../../service/api_music'
import { rankingStore, playerStore } from '../../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking: '',
    type: '',
    songInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { ranking, id, type } = options
    this.setData({
      type
    })
    if (type === 'menu') {
      getSongMenuDetail(id).then((res) => {
        this.setData({
          songInfo: res.playlist
        })
        this.setPageTitle(this.data.songInfo.name)
      })
    } else if (type === 'rank') {
      this.setData({
        ranking
      })
      rankingStore.onState(this.data.ranking, this.getRankingDataHandler)
      this.setPageTitle(this.data.songInfo.name)
    } 
  },

  setPageTitle(title) {
    wx.setNavigationBarTitle({
      title
    })
  },

  handleSongItemClick(event) {
    const { index } = event.currentTarget.dataset
    playerStore.setState('playListSongs', this.data.songInfo.tracks)
    playerStore.setState('playListIndex', index)
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
    if (this.data.type === 'rank') {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler)
    }
  },

  getRankingDataHandler(res) {
    this.setData({
      songInfo: res
    })
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