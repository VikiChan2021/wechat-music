/**
 * 网络请求函数
 */
import config from "./config";

export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync("cookie")
          ? wx
              .getStorageSync("cookie")
              .find((item) => item.indexOf("MUSIC_U") > -1)
          : "",
      },
      success: (res) => {
        // console.log('请求成功');
        if (url === "/login/cellphone") {
          wx.setStorageSync("cookie", res.cookies);
        }
        resolve(res.data);
      },
      fail: (err) => {
        // console.log('请求失败');
        reject(err);
      },
    });
  });
};
