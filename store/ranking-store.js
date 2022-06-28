import { HYEventStore } from 'hy-event-store'
import { getRankings } from '../service/api_music'

const rankingMap = {
  0: 'newRanking',
  1: 'hotRanking',
  2: 'originRanking',
  3: 'upRanking'
}

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 新歌榜
    hotRanking: {}, // 热门榜
    originRanking: {}, // 原创榜
    upRanking: {} // 飙升榜
  },
  actions: {
    getRankingDataAction(ctx) {
        // 0 新歌榜， 1热门榜， 2原创榜， 3飙升榜
      for (let i = 0; i < 4; i++) {
        getRankings(i).then((res) => {
          const rankingName = rankingMap[i]
          ctx[rankingName] = res.playlist
        })
      }
    }
  }
})

export {
  rankingStore,
  rankingMap
}