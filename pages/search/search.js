import request from "../../utils/request";
let timer = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "",
    hotList: [],
    searchContent: "",
    searchResultList: [],
    searchHistoryList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    this.getSearchHistoryList();
  },

  async getInitData() {
    const placeholderContentData = await request("/search/default");
    const hotListData = await request("/search/hot/detail");

    this.setData({
      placeholderContent: placeholderContentData.data.showKeyword,
      hotList: hotListData.data,
    });
  },

  getSearchHistoryList() {
    const list = wx.getStorageSync("searchHistoryList");
    if (list.length) {
      this.setData({ searchHistoryList: list });
    }
  },

  handleClear() {
    this.setData({ searchContent: "" });
  },
  deleteSearchHistory() {
    this.setData({searchHistoryList: []});
    wx.removeStorageSync('searchHistoryList');
  },

  handleInput(event) {
    const searchContent = event.detail.value;
    // console.log("searchContent", searchContent);
    if (!searchContent) {
      this.setData({ 
        searchContent: '',
      });
      // console.log("this.setData");
      return;
    }
    let searchResultListData;

    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      searchResultListData = await request("/search", {
        keywords: searchContent,
        limit: 10,
      });
      this.setData({
        searchContent,
        searchResultList: searchResultListData.result.songs,
      });
      // 把搜索历史保存到本地
      const { searchHistoryList } = this.data;
      const index = searchHistoryList.findIndex(
        (item) => item == searchContent
      );
      if (index > -1) {
        searchHistoryList.splice(index, 1);
      }
      searchHistoryList.unshift(searchContent);

      this.setData({searchHistoryList})
      wx.setStorageSync("searchHistoryList", searchHistoryList);
    }, 500);
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
