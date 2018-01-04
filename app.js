//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  reqUrl: 'https://fulishe.shanshizhe.cn',
  // reqUrl: 'http://192.168.3.27:88',
  login: function (cb) {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          // 发起网络请求
          wx.request({
            method: 'POST',
            url: getApp().reqUrl + '/user/sign',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              code: res.code,
            },
            success: function (res) {
              console.log(res);
              console.log('登录')
              // 获得sessionID
              that.globalData.sessionID = res.data.messages.third_session;
              that.globalData.isNewUser= res.data.messages.isNewUser;
              //  获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  getApp().request({
                    url: '/user/getUserInfo',
                    method: 'POST',
                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      rawData: res.rawData,
                      signature: res.signature,
                    },
                    success: function (res) {
                      // 登录获取用户信息
                      that.globalData.user = res.data.messages;
                      typeof cb == "function" && cb(res.data.messages, that.globalData.sessionID);
                    }
                  })
                },
                fail: function (res) {
                  that.loginFail(function (userInfo) {
                    typeof cb == "function" && cb(that.globalData.user, that.globalData.sessionID);
                  });
                },
                complete: function (res) {

                }
              })

            },
            fail: function (res) {
              console.log(res);
            }
          })


        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }

      }
    })

  },
  // 封装请求
  request: function (obj) {
    var that = this;
    obj.data = obj.data || {};
    obj.url = that.reqUrl + obj.url;
    obj.method = obj.method || 'POST';
    that.getSessionID(function (sessionID) {
      obj.header = {
        'content-type': 'application/x-www-form-urlencoded',
        'third_session': sessionID
      };
      obj.fail = function(){
        wx.showModal({
          title: '系统错误,请重试',
        })
      } 
      wx.request(obj);
    })
  },
  // 获取sessionID
  getSessionID: function (cb) {
    var that = this
    wx.request({
      url: that.reqUrl + '/user/checkSession',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'third_session': that.globalData.sessionID
      },
      success: function (res) {
        if (res.data.errorcode == 200) {
          cb(that.globalData.sessionID)
        } else {
          that.login(function (userInfo) {
            cb(that.globalData.sessionID)
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '请求失败',
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.user) {
      typeof cb == "function" && cb(this.globalData.user)
    } else {
      // 调用登录接口
      that.login(function (userInfo) {
        typeof cb == "function" && cb(userInfo)
      });
    }

  },
  loginFail: function (cb) {
    var that = this;
    wx.openSetting({
      success: function (res) {
        if (res.authSetting["scope.userInfo"] == true) {
          console.log('勾选');
          wx.getUserInfo({
            withCredentials: false,
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      },
      fail: function () {
        that.loginFail(cb);
      }
    })
  },
  globalData: {
    userInfo: null,
    sessionID: '',
    user: '',
    isNewUser:false,
  }
})