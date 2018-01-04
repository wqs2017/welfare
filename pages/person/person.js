// pages/person/person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    info:{
      gold:0,
      return_gold:0,
    },
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
    wx.setNavigationBarTitle({
      title: '个人主页',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // console.log(getApp().globalData.userInfo)
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          user: res.userInfo
        })
      }
    });
    // 获取余额
    app.request({
      url:'/user/getUserGoldInfo',
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          that.setData({
            info:res.data.messages
          })
        }
      }
    })
  },
  // 
  goOrder:function(){
    wx.navigateTo({
      url: '../order/order',
    })
  },
  goGold:function(){
    wx.navigateTo({
      url: '../gold/gold',
    })
  },
  goFollow:function(){
    wx.navigateTo({
      url: '../follow/follow',
    })
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