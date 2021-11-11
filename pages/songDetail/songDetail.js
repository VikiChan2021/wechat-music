import PubSub from "pubsub-js";
import moment from "moment";
import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songInfo: {},
    currentTime: '00:00',
    currentWidth: 0,
  },

  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay,
    });
    this.musicControl(this.data.songInfo.songId);
  },
  handleSwitch(event) {    
    const type = event.currentTarget.id;
    PubSub.publish("switchSong", {
      type,
      songId: this.data.songInfo.songId,
    });
    PubSub.subscribe("musicId", (msg, data) => {
      console.log(msg, data);
      this.getSongInfo(data.songId);
      this.musicControl(data.songId);

      PubSub.unsubscribe("musicId");
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const songId = options.songId;
    this.getSongInfo(songId);

    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      this.setData({ isPlay: true });
    });
    this.backgroundAudioManager.onPause(() => {
      this.setData({ isPlay: false });
    });
    this.backgroundAudioManager.onStop(() => {
      this.setData({ isPlay: false });
    });

    // 监听音乐的实时播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      const currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      const currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
      this.setData({currentTime, currentWidth});
    })

    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish("switchSong", {
        type: 'next',
        songId: this.data.songInfo.songId,
      });
      PubSub.subscribe("musicId", (msg, data) => {
        console.log(msg, data);
        this.getSongInfo(data.songId);
        this.musicControl(data.songId);
  
        PubSub.unsubscribe("musicId");
      });
    })
  },

  async getSongInfo(songId) {
    const songInfoData = await request("/song/detail", {
      ids: songId,
    });
    const durationTime = moment(songInfoData.songs[0].dt).format('mm:ss')

    const songInfo = {
      songId,
      songName: songInfoData.songs[0].name,
      singer: songInfoData.songs[0].ar[0].name,
      picUrl: songInfoData.songs[0].al.picUrl,
      durationTime,
    };
    wx.setNavigationBarTitle({
      title: songInfo.songName,
    });
    this.setData({ songInfo });
  },
  async musicControl(songId) {
    if (this.data.isPlay) {
      const songData = await request("/song/url", {
        id: songId,
      });
      const songUrl = songData.data[0].url;

      this.backgroundAudioManager.src = songUrl;
      this.backgroundAudioManager.title = this.data.songInfo.songName;
    } else {
      this.backgroundAudioManager.pause();
    }
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
