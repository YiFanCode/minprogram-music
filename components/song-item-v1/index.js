// components/song-list-v1/index.js
import { playerStore } from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    song: {
      type: Object,
      value: () => ({})
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
    handleItemClick() {
      const { id } = this.properties.song
      // 跳转页面
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/index?id=${id}`,
      })
      // 对歌曲的数据请求和其他操作
      playerStore.dispatch('playMusicWithSongIdAction', { id })
    }
  }
})
