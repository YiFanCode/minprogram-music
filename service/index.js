import { promisic } from '../utils/util'
import { TOKEN_KEY } from '../constants/token-conts'

const BASE_URL = 'http://123.207.32.32:9001'

const LOGIN_BASE_UR = 'http://localhost:3000'
const token = wx.getStorageSync(TOKEN_KEY)

// 请求方法封装
class Request {
  constructor(baseUrl, authHeader = {}) {
    this.baseUrl = baseUrl
    this.authHeader = authHeader
  }
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? {...this.authHeader, ...header } : header
    return promisic(wx.request)({
      url: `${this.baseUrl}${url}`,
      header: finalHeader,
      method,
      data: params
    })
  }

  get(url, params, isAuth = false, header) {
    return this.request(url, 'GET', params, isAuth, header)
  }

  post(url, data, isAuth = false, header) {
    return this.request(url, 'POST', data, isAuth, header)
  }
}

const request = new Request(BASE_URL)

const loginRequest = new Request(LOGIN_BASE_UR, { token })

export default request
export { loginRequest }