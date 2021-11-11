import PubSub from "pubsub-js";
import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon: "error",
        success: () => {
          setTimeout(() => {
            wx.reLaunch({
              url: "/pages/login/login",
            });
          }, 2000);
        },
      });
      return;
    }
    this.getRecommendListData();

    PubSub.subscribe("switchSong", (msg, data) => {
      const songId = data.songId;
      const { recommendList } = this.data;
      let songIndex = recommendList.findIndex((item) => item.id == songId);
      // console.log('songIndex',songIndex);
      if (data.type === "prev") {
        songIndex--;
        if (songIndex < 0) {
          songIndex = recommendList.length-1
        }
      } else {
        songIndex++;
        if (songIndex > recommendList.length-1) {
          songIndex = 0
        }
      }
      PubSub.publish("musicId", {
        songId: recommendList[songIndex].id,
      });
    });
  },

  async getRecommendListData() {
    const recommendListData = await request("/recommend/songs");
    this.setData({ recommendList: recommendListData.data.dailySongs });
  },

  toSongDetail(event) {
    const songId = event.currentTarget.id;
    // 通过路由的query进行传参
    wx.navigateTo({
      url: "/pages/songDetail/songDetail?songId=" + songId,
    });
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
