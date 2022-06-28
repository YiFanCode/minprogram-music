/*
 * 小程序函数方法返回 promise
 * @param {function} fun 小程序函数方法
 */
export const promisic = function(func) {
  return function(params = {}) {
    return new Promise((resolve, reject) => {
      const obj = Object.assign(params, {
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
      func(obj)
    })
  }
}

export const formatNumber = () => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}