import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  // 1.收集表单数据:
  // 1)通过<input bindinput="" />绑定事件处理函数
  // 2)通过<input id="" data-key="" />向event传参
  // 3)通过this.setData更新数据
  handleInput(event) {
    // console.log(event);
    this.setData({
      [event.target.id]:event.detail.value
    })
  },

  async handleLogin() {
    // 2.前端验证
    const {phone,password} = this.data
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return;
    }
    const phoneReg = /^1\d{10}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon:'error'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return;
    }
    // 3.后端验证
    const res = await request('/login/cellphone',{phone,password})
    if (res.code === 200) {
      wx.showToast({
        title: '登录成功',
      })
      wx.setStorageSync('userInfo', res.profile)
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/personal/personal',
        })
      },1000)
    } else if (res.code === 400) {
      wx.showToast({
        title: '手机号不正确',
        icon:'error'
      })
    } else if (res.code === 502) {
      wx.showToast({
        title: '密码不正确',
        icon:'error'
      })
    } else {
      wx.showToast({
        title: '登录失败,请重新登录',
        icon:'error'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})