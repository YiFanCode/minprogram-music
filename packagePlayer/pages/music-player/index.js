// pages/music-player/index.js
import { audioContext, playerStore } from '../../../store/index'
const playModeNames = ['order', 'repeat', 'random']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 歌曲id
    currentSong: {}, // 歌曲数据
    currentTime: 0, // 当前播放位置
    durationTime: 0, // 歌曲总时长
    sliderValue: 0, // 歌曲进度条位置

    currentPage: 0, // 显示播放面板或者歌词面板
    contentHeight: 0, //内容区的高度

    lyricInfos: [], // 歌曲歌词信息
    currentLyricIndex: 0, // 当前歌词的索引
    currentLyricText: "", // 当前歌词的文本
    isMusicLyric: true, // 是否显示歌词(小屏幕布局适配)
    lyricScrollTop: 0, // 歌词滚动距离
    
    isSliderChanging: false, // 是否拖动进度条

    playModeIndex: 0,
    playModeName: 'order',

    isPlaying: false,
    playingName: "pause"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    this.setData({
      id
    })

    this.setupPlayerStoreListener()

    // 动态计算内容高度
    const {screenHeight, statusBarHeight, navBarHeight, deviceRadio } = getApp().globalData
    const contentHeight = screenHeight - statusBarHeight - navBarHeight

    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    })
  },

  // ============== 事件处理 ===============
  handleSwiperChange(event) {
    const { current } = event.detail
    this.setData({
      currentPage: current
    })
  },

  handleSliderChanging(event) {
    const { value } = event.detail
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      isSliderChanging: true,
      currentTime
    })
  },

  handleSliderChange(event) {
    // 1.获取slider变化的值
    const { value } = event.detail
    //  2.计算需要播放的currentTIme
    const currentTime = this.data.durationTime * value / 100
    // audioContext.pause()
    // 3.设置context播放currentTime位置的音乐
    audioContext.seek(currentTime / 1000)
    // 4.记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
    this.setData({
      sliderValue: value,
      isSliderChanging: false
    })
  },

  // 播放模式
  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    playModeIndex = playModeIndex % 3
    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex', playModeIndex)
  },
  // 上一曲
  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },
  // 播放/暂停
  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },
  // 下一曲
  handleNextBtnClick() {
    playerStore.dispatch('changeNewMusicAction')
  },

  handleBackBtnClick() {
    wx.navigateBack()
  },

  // ================= 事件监听 ===============
  handleCurrentMusicListener({ currentSong, durationTime, lyricInfos }) {
    if (currentSong) this.setData({currentSong})
    if (durationTime) this.setData({durationTime})
    if (lyricInfos) this.setData({lyricInfos})
  },

  setupPlayerStoreListener() {
    // 监听currentSong/durationTime/lyricInfos
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleCurrentMusicListener)
    // 监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          currentTime,
          sliderValue
        })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({
          currentLyricIndex,
          lyricScrollTop: currentLyricIndex * 35
        })
      }
      if (currentLyricText) {
        this.setData({
          currentLyricText
        })
      }
    })
    
    // 监听播放模式
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({ playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeNames[playModeIndex]
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? 'pause' : 'resume'
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
    playerStore.offStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleCurrentMusicListener)
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