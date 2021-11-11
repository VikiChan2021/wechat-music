import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: "58100",
    videoList: [],
    videoId: "",
    videoTimeUpdateList: [],
    isTriggered: false,
    offset: 1, // 加载第几页的数据
  },

  changeNav(event) {
    const navId = event.currentTarget.id;
    this.setData({ navId, videoList: [] });
    wx.showLoading({
      title: "加载中",
    });
    this.getVideoListData();
  },

  handlePlay(event) {
    const vid = event.target.id;
    const videoContext = wx.createVideoContext(vid);
    this.setData({ videoId: vid });
    // 判断这个视频之前是否播放过
    const videoItem = this.data.videoTimeUpdateList.find(
      (item) => item.id === event.target.id
    );
    if (videoItem) {
      videoContext.play();
      videoContext.seek(videoItem.currentTime);
    } else {
      videoContext.play();
    }

    // 通过单例模式,把之前的视频停掉,现在的视频正常播放
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;
    // this.videoContext = videoContext;
  },
  handleTimeUpdate(event) {
    const videoObj = {
      id: event.target.id,
      currentTime: event.detail.currentTime,
    };
    const videoItem = this.data.videoTimeUpdateList.find(
      (item) => item.id === event.target.id
    );
    if (videoItem) {
      // 之前播放过这个视频
      videoItem.currentTime = event.detail.currentTime;
    } else {
      // 之前没有播放过这个视频
      this.setData({
        videoTimeUpdateList: [...this.data.videoTimeUpdateList, videoObj],
      });
    }
  },
  handleEnded(event) {
    const endIndex = this.data.videoTimeUpdateList.findIndex(
      (item) => item.id === event.target.id
    );
    const { videoTimeUpdateList } = this.data;
    videoTimeUpdateList.splice(endIndex, 1);
    this.setData({ videoTimeUpdateList });
  },
  handleRefresher() {
    this.getVideoListData();
  },
  handleToLower() {
    let offset = this.data.offset;
    offset++;
    this.getVideoListData(offset);
    this.setData({ offset });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
    this.getVideoListData(1);
  },

  async getVideoGroupListData() {
    const videoGroupListData = await request("/video/group/list");
    this.setData({ videoGroupList: videoGroupListData.data.slice(0, 14) });
  },
  async getVideoListData(offset = 1) {
    const videoListData = await request("/video/group", {
      id: this.data.navId,
      offset,
    });
    videoListData.datas.forEach(async (item) => {
      const videoId = item.data.vid;
      const urlInfo = await request("/video/url", { id: videoId }).then(
        (obj) => obj.urls[0].url
      );
      // console.log('urlInfo',urlInfo);
      item.data.urlInfo = urlInfo;
    });

    setTimeout(() => {
      wx.hideLoading();

      let videoList = this.data.videoList;
      videoList.push(...videoListData.datas);
      this.setData({
        videoList,
        isTriggered: false, // 取消下拉
      });
    }, 3000);
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
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
  onShareAppMessage: function ({from}) {
    console.log(from);
    return {
      title:`来自${from}的转发`,
      page:'/pages/video/video',
    }
  },
});
