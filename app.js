// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-conts'

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0
  },
  onLaunch: function () {
    // 获取了设备信息
    const { screenWidth, screenHeight, statusBarHeight } = wx.getSystemInfoSync()
    this.globalData.screenWidth = screenWidth
    this.globalData.screenHeight = screenHeight
    this.globalData.statusBarHeight = statusBarHeight
    this.globalData.deviceRadio = screenHeight / screenWidth

    // 让用户默认进行登录
    // this.handleLogin()
  },

  async handleLogin() {
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    const checkResult = await checkToken()
    // 判断session是否过期
    const isSessionExpire = await checkSession()
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },

  async loginAction() {
    // 获取code
    const code = await getLoginCode()
    // console.log(code)
    // 将code发送给服务器
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
