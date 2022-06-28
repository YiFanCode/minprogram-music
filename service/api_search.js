import request from "./index";

// 获取热门搜索
export function getHotSearch() {
  return request.get(
    '/search/hot'
  )
}

// 搜索建议
export function getSearchSuggest(keywords) {
  return request.get(
    '/search/suggest',
    {
      keywords,
      type: 'mobile'
    }
  )
}

// 搜索
export function getSearchResult(keywords, offset = 0, limit = 30) {
  return request.get(
    '/search',
    {
      keywords,
      limit,
      offset
    }
  )
}