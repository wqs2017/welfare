// pages/cart/cart.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrInfo: [],
    limitNum: 1,
    info: {
      real_price:0,
      transport:0,
    },
    addrIndex: 0,
    btnStatus:0,
  },
  //  填写收货人
  goAddAddr: function () {
    wx.navigateTo({
      url: './addAddr/addAddr',
    })
  },
  goAddr: function () {
    wx.navigateTo({
      url: './addr/addr?index=' + this.data.addrIndex,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.request({
      url: '/order/getOrderById',
      data:{
        order_id:options.order_id
      },
      success: function (res) {
        console.log(res);
        if (res.data.errorcode == 200) {
          var info = res.data.messages.order;
          that.setData({
            info: info
          })
        } else {
          wx.showModal({
            title: '系统错误，请重新进入',
          });
        }
      }
    });
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
    wx.getStorage({
      key: 'addrIndex',
      success: function (res) {
        console.log(res);
        console.log('------')
        that.setData({
          addrIndex: res.data
        });
        wx.clearStorage({
          key: 'addrIndex'
        })
      },
    })
    // 获取收货地址
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
  addBtn: function (e) {
    var index = e.currentTarget.dataset.id;
  },
  // 支付
  payBtn:function(){
    var that = this;
    var info = this.data.info;
    app.request({
      url:'/pay/wxPay',
      data:{
        order_id:info.order_id
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          if(res.data.messages.success){
            that.successPay();
            return
          }
          var payData = res.data.messages;
          var paySign = payData.paySign;
          var nonceStr = payData.nonceStr;
          wx.requestPayment({
            "appId": 'wxb93764b8ec4b1225',
            'timeStamp': payData.timeStamp,
            'nonceStr': payData.nonceStr,
            'package': payData.package,
            'signType': 'MD5',
            'paySign': payData.paySign,
            'success': function (res) {
              that.successPay();
            },
            'fail': function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          });
        }
      }
    })
  },
  // 支付成功
  successPay:function(){
    wx.showModal({
      title: '付款成功',
      confirmText: '返回首页',
      cancelText: '查看订单',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 2,
          });
        } else if (res.cancel) {
          wx.redirectTo({
            url: '../order/order'
          });
        }
      }
    })
  },
  // 删除订单
  deleteBtn:function(){
    var order_id = this.data.info.order_id;
    wx.showModal({
      title: '确定删除此订单？',
      success:function(res){
        if(res.confirm){
          app.request({
            url:'/order/del',
            data:{
              order_id:order_id
            },
            success:function(res){
              console.log(res);
              if(res.data.errorcode==200){
                wx.showToast({
                  title: '删除成功',
                  duration:1000,
                })
                setTimeout(function(){
                  wx.navigateBack({
                    delta:1,
                  });
                },1000)
              }else{
                wx.showModal({
                  title: '删除失败，请重试',
                })
              }
            }
          })
        }
      }
    })
  }
})