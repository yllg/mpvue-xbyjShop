import wx from 'wx'
import Fly from 'flyio'

const request = new Fly()

// 设置请求基地址
// request.config.baseURL = "http://127.0.0.1:8360/"

request.interceptors.request.use((request) => {
  // 给所有请求添加自定义header，带上token信息让服务器验证用户登陆
  request.headers['X-Xbyjshop-Token'] = wx.getStorageSync('token');
  // console.log('flyio发请求,request为', request);
  wx.showNavigationBarLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideNavigationBarLoading()
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: err.message,
      icon: 'none'
    })
    return promise.resolve()
  }
)

export default request
