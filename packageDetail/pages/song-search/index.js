// pages/song-search/index.js
import { getHotSearch, getSearchSuggest, getSearchResult } from '../../../service/api_search'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'
const deboundceSearchSuggest = debounce(getSearchSuggest, 100)
const historyMax = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    searchVal: '',
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    historySearch: [],
    refresh: true, // 开启自定义刷新
    hasMore: true,
    loading: false, // loading 状态
    triggered: true, // 下拉刷新状态 true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },

  getPageData() {
    getHotSearch().then((res) => {
      this.setData({
        hotKeywords: res.result.hots
      })
    })
    this.getSearchHistory()
  },

  getSearchHistory() {
    this.setData({
      historySearch: this.getHistory()
    })
  },

  handleSearchChange(event) {
    const searchVal = event.detail

    this.getSearchHistory() // 更新历史搜索结果

    this.setData({
      searchVal
    })
    
    if (!searchVal.length) {
      this.setData({
        suggestSongs: [],
        resultSongs: [],
        hasMore: true
      })
      deboundceSearchSuggest.cancel() // 取消数据请求
      return
    }
    deboundceSearchSuggest(searchVal).then((res) => {
      const suggestSongs = res.result.allMatch
      this.setData({
        suggestSongs,
      })

      if (!suggestSongs) return
      // 重组搜索建议结果（满足富文本标签格式 rich-text）
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        // 重组vDom数据
        const nodes = stringToNodes(keyword, searchVal)
        suggestSongsNodes.push(nodes)
      }
      this.setData({
        suggestSongsNodes
      })
    })
  },

  handleSearchAction() {
    const searchValue = this.data.searchVal

    // 获取缓存中的搜索历史关键字记录
    const historyArr = this.getHistory()
    // 判断历史记录中有无相同的关键字
    const has = historyArr.includes(searchValue)
    if (has) {
      // 如果历史记录中有相同的关键字则删除原有的（并且将保留一个放在首位）
      const idx = historyArr.findIndex((item) => item === searchValue)
      historyArr.splice(idx, 1)
    }
    if (historyArr.length >= historyMax) {
      historyArr.pop()
    }
    
    historyArr.unshift(searchValue)
    this.setHistory(historyArr)
    // 索结果数据
    this.getHandleSearchResult(searchValue)
  },
  
  handleKeywordItemClick(event) {
    const { keyword } = event.currentTarget.dataset
    this.setData({
      searchVal: keyword
    })

    this.handleSearchAction()
  },

  // 获取搜索结果数据
  getHandleSearchResult(searchValue, offset) {
    if(!this.data.hasMore && offset) return
    this.setData({
      loading: true,
      
    })
    // 没有offset参数时为第一次请求数据或刷新
    getSearchResult(searchValue, offset).then(res => {
      let newData = this.data.resultSongs
      if (!offset) {
        newData = res.result.songs
      } else {
        newData = [...this.data.resultSongs, ...res.result.songs]
      }
      
      this.setData({
        resultSongs: newData,
        hasMore: res.result.hasMore,
        loading: false,
        triggered: false // 下拉刷新状态(关闭)
      })
    })
  },

  // 下拉刷新
  onRefresh() {
    this.getHandleSearchResult(this.data.searchVal)
  },
  // 下拉复位
  onRestore() {
    wx.showToast({
      title: '刷新成功'
    })
  },
  // 上拉加载
  onSearchResultLoading() {
    const searchValue = this.data.searchVal
    const offset = this.data.resultSongs.length
    this.getHandleSearchResult(searchValue, offset)
  },

  scroll() {},

  getHistory() {
    return wx.getStorageSync('history') || []
  },
  setHistory(value) {
    wx.setStorageSync('history',value)
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