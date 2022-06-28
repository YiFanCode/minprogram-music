import { loginRequest } from './index'

export function getLoginCode() {
  return  new Promise((resolve, reject) => {
      wx.login({
        timeout: 1000,
        success: (res) => {
          resolve(res.code)
        },
        fail: (err) => {
          console.log(err)
          reject(err)
        }
      })
  })
}

export function codeToToken(code){
  return loginRequest.post('/login', {code})
}

export function checkToken() {
  return loginRequest.post('/auth', {}, true)
}

export function postFavorRequest() {
  return loginRequest.post('/api/favor', {id}, true)
}

export function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '你好，Music',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}