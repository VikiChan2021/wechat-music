import request from "../../utils/request";

let startY = 0;
let moveY = 0;
let moveDistance = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTranslate: "translateY(0)",
    coverTransition: "",
    userInfo: {},
    recentPlayList: [],
  },

  handleTouchStart(event) {
    this.setData({
      coverTransition: "",
    });
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance > 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTranslate: `translateY(${moveDistance}rpx)`,
    });
  },
  handleTouchEnd() {
    this.setData({
      coverTranslate: `translateY(0rpx)`,
      coverTransition: `all 1s linear 0s`,
    });
  },

  toLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({ userInfo });
      this.getUserRecentPlayList();
    }
  },

  async getUserRecentPlayList() {
    const recentPlayListData = await request("/user/record", {
      uid: this.data.userInfo.userId,
      type: 0,
    });
    this.setData({ recentPlayList: recentPlayListData.allData.slice(0,10) });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
