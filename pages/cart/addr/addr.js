// pages/cart/addr/addr.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrInfo:[],
  },
  // 
  goAddAddr:function(){
    wx.navigateTo({
      url: '../addAddr/addAddr',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      addrIndex:options.index
    })
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
    var that = this;
    app.request({
      url: '/user/getAddr',
      success: function (res) {
        console.log(res);
        if (res.data.errorcode == 200) {
          that.setData({
            addrInfo: res.data.messages.data
          })
        } else {
          wx.showModal({
            title: '收货地址请求失败，请重试',
          })
        }
      },
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
  
  },
  // 选择地址
  selectCircle:function(e){
    var index = e.currentTarget.dataset.index;
    wx.setStorage({
      key: 'addrIndex',
      data: index,
      success:function(){
        wx.navigateBack({
          delta:1
        })
      }
    })
  },
  // 编辑地址
  goEdit:function(e){
    var index = e.currentTarget.dataset.index;
    var addrInfo = this.data.addrInfo;
    wx.setStorage({
      key: 'addrEdit',
      data: addrInfo[index],
      success:function(){
        wx.navigateTo({
          url: '../addAddr/addAddr',
        })
      }
    })
  }
})