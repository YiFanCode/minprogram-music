import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, // 是否为第一次播放
    isStoping: false, // 是否暂停(后台操作)

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
    playListSongs: [], // 播放列表
    playListIndex: 0, // 播放列表索引

    isPlaying: false

  },
  actions: {
    // 播放歌曲
    playMusicWithSongIdAction(ctx, {id, isRefresh = false}) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      }
      ctx.id = id

      // 修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      // 根据id请求歌曲详情
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0],
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })

      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lryics = parseLyric(res.lrc.lyric)
        ctx.lyricInfos = lryics
      })

      // 播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = ctx.currentSong.name
      audioContext.autoplay = true

      if(ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
    },

    // 监听歌曲播放
    setupAudioContextListenerAction(ctx) {
      // 监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 监听歌曲播放中
      audioContext.onTimeUpdate(() => {
        // 获取当前歌曲时间
        const currentTime = audioContext.currentTime * 1000
        // 根据当前时间修改currentTime
        ctx.currentTime = currentTime

        // 根据当前歌曲时间 查找对应的歌词
        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        const currentIndex = i - 1
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricIndex = currentIndex
          ctx.currentLyricText = currentLyricInfo ? currentLyricInfo.text : ''
        }
      })
      // 监听歌曲播完
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })

      // 监听音乐暂停/播放/停止
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    // 控制歌曲播放状态
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        audioContext.startTime = ctx.currentTime / 1000
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },

    // 改变歌曲播放
    changeNewMusicAction (ctx, isNext = true) {
      // 获取当前索引
      let index = ctx.playListIndex
      // 根据不同的播放模式, 获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1 
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1: // 单曲播放
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }
      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录最新索引
        ctx.playListIndex = index
      }

      // 播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', {id: currentSong.id, isRefresh : true})
    }
  }
})

export {
  audioContext,
  playerStore
}