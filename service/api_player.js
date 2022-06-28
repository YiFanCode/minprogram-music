import request from './index'

/**
 * 获取歌曲详细信息
 * @param {Number} ids 
 */
export function getSongDetail(ids) {
  return request.get(
    '/song/detail',
    {
      ids
    }
  )
}

/**
 * 获取歌曲歌词
 * @param {Number} id 
 */
export function getSongLyric(id) {
  return request.get(
    '/lyric',
    {
      id
    }
  )
}