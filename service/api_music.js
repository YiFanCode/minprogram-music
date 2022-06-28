import request from './index'

/**
 * 获取首页banner
 */
export function getBanners() {
  return request.get(
    '/banner',
    {
      type: 2
    }
  ) 
}

/**
 * 获取热门歌曲
 * @param {Number} idx 
 */
export function getRankings(idx) {
  return request.get(
    '/top/list',
    {
      idx
    }
  )
}

/**
 * 获取热门歌单
 *  `cat`: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * @param {String} cat
 * 取出歌单数量 , 默认为 50
 * @param {Number} limit
 * 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 * @param {Number} offset
 */
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return request.get(
    '/top/playlist',
    {
      cat,
      limit,
      offset
    }
  )
}

/**
 * 获取歌单详情列表
 * @param {Number} id 
 */
export function getSongMenuDetail(id) {
  return request.get(
    '/playlist/detail/dynamic',
    {
      id
    }
  )
}