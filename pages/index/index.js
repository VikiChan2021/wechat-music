import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 轮播图数据
    const bannerListData = await request("/banner", { type: 2 });
    this.setData({ bannerList: bannerListData.banners });
    // 推荐区数据
    const recommendListData = await request("/personalized", { limit: 10 });
    this.setData({
      recommendList: recommendListData.result,
    });
    // 排行榜数据
    const rankId = [19723756,3779629,2884035];
    const rankList = []
    for (let i = 0; i < rankId.length; i++) {
      const topListData = await request('/playlist/detail',{id:rankId[i]});
      const rankObj = {
        name:topListData.playlist.name,
        tracks:topListData.playlist.tracks.slice(0,3),
      }
      rankList.push(rankObj)
      // 每次循环都更新一次数据,以防长时间白屏
      this.setData({topList:rankList})
    }
  },

  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
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