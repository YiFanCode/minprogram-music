import request from "./index"

 /**
  * 获取top mv视频
  * @param {number} offset 数据条数
  */
export function getTopMV(offset = 0) {
  return request.get(
    '/top/mv',
    {
      offset,
      limit: 10
    }
  )
}

/**
 * 请求mv的播放地址
 * @param {number} id mvid
 */
export function getMVUrl(id) {
  return request.get(
    '/mv/url',
    {
      id
    }
  )
}

/**
 * 请求mv视频详情
 * @param {number} mvid 
 */
export function getMVDetail(mvid) {
  return request.get(
    '/mv/detail',
    {
      mvid
    }
  )
}

/**
 * 请求mv相关联视频
 * @param {number} mvid 
 */
export function getRelatedVideo(id) {
  return request.get(
    '/related/allvideo',
    {
      id
    }
  )
}
