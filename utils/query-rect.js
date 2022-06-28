export default function queryRect(selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    // exec(resolve)
    query.exec((res) => {
      resolve(res)
    })
  })
}