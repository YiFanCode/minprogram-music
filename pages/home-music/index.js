// pages/home-music/index.js
import { getBanners, getSongMenu } from '../../service/api_music'
import { rankingStore, rankingMap, playerStore } from '../../store/index'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect, 500, {trailing: true})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerH: 0,
    banners: [], // 获取banner
    recommendSongs: [], //推荐歌曲
    hotSongMenu: [], // 获取热门歌曲
    recommendSongMenu: [], // 获取热门歌曲
    rankings: { 0: {}, 2: {}, 3: {} }, // 榜单数据

    currentSong: {}, // 当前播放歌曲
    isPlaying: false, // 歌曲是否播放
    playAnimState: "paused" // 界面歌曲播放动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()

    // 发起共享请求
    this.setupPlayerStoreListener()
   
  },



  // 获取页面数据
  getPageData() {
    // 获取banner
    getBanners().then((res) => {
      const { banners } = res
      this.setData({
        banners
      })
    }),

    // 获取热门歌曲
    getSongMenu().then((res) => {
      const { playlists } = res
      this.setData({
        hotSongMenu: playlists
      })
    })

    // 获取推荐歌曲
    getSongMenu('流行').then((res) => {
      const { playlists } = res
      this.setData({
        recommendSongMenu: playlists
      })
    })
  },

  loadImg(event) {
    // 获取图片高度 (图片组件的高度)
    throttleQueryRect('.banner-image').then((res) => {
      const rect = res[0]
      this.setData({
        bannerH: rect.height
      })
    })
    // const {width, height} = event.detail
    /**
     * 动态设置图片高度
     * width     750(固定width)
     * -----  = ---------------
     * height    ? 设置的height
    */
    // this.setData({
    //   bannerW: 750,
    //   bannerH: 750 * height / width
    // })
  },

  // 搜索跳转
  toSearch() {
    wx.navigateTo({
      url: '/packageDetail/pages/song-search/index',
    })
  },

  // 推荐歌曲更多跳转
  handleMore() {
    this.navigateToDetailSongsPage('hotRanking')
  },

  rankingItemHandler(e) {
    const idx = e.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  handleSongItemClick(event) {
    const { index } = event.currentTarget.dataset
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)
  },

  handlePlayBarClick() {
    wx.navigateTo({
      url: `/packagePlayer/pages/music-player/index?id=${this.data.currentSong.id}`,
    })
  },

  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },


  setupPlayerStoreListener() {
    // 排行榜监听
    rankingStore.dispatch('getRankingDataAction')
    rankingStore.onState('hotRanking', (res) => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6)
      this.setData({
        recommendSongs
      })
    })
    rankingStore.onState('newRanking', this.getNewRankingHandler(0))
    rankingStore.onState('originRanking', this.getNewRankingHandler(2))
    rankingStore.onState('upRanking', this.getNewRankingHandler(3))

    // 播放器监听
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? 'running': 'paused'
        })
      }
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
  onShow: function() {
    
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

  },

  getNewRankingHandler: function(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const playCount = res.playCount
      const coverImgUrl = res.coverImgUrl
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {
        name,
        playCount,
        coverImgUrl,
        songList
      }
      this.setData({
        rankings: {...this.data.rankings, [idx]: rankingObj}
      })
    }
  }
})