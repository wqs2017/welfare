// pages/order/detail/detail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1,
    order_id:'',
    info:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var status=0;
    if (options.status =='pay'){
      status = 0
    } else if (options.status == 'send'){
      status = 1
    } else if (options.status == 'finish'){
      status = 2
    }
    this.setData({
      status:status,
      order_id:options.order_id
    });
    app.request({
      url:'/order/getOrderById',
      data:{
        order_id: options.order_id
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          that.setData({
            info:res.data.messages.order
          })
        }else{
          wx.showModal({
            title: '数据错误，请重试',
          })
        }
      },
      complete:function(res){
        console.log(res);
        console.log('-----------------')
      }

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
  // 取消订单
  cancelOrder:function(){
    var order_id=this.data.order_id;
    wx.showModal({
      title: '确认取消该订单',
      success:function(res){
        if (res.confirm) {
          app.request({
            url:'/order/cancel',
            data:{order_id:order_id},
            success:function(res){
              console.log(res);
              if(res.data.errorcode==200){
                wx.navigateBack({
                  delta:1,
                });
              }else{
                wx.showModal({
                  title: res.data.messages.errorinfo,
                })
              };
              
            }
          })
        }
      }
    })
  },
  // 确认收货
  sureGet:function(){
    var order_id = this.data.order_id;
    wx.showModal({
      title: '是否确认收货？',
      success:function(res){
        if (res.confirm) {
          app.request({
            url:'/order/finish',
            data:{
              order_id:order_id
            },
            success:function(res){
              if(res.data.errorcode==200){
                wx.showToast({
                  title: '确认收货成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }else{
                wx.showModal({
                  title: '确认失败请重试',
                })
              }
            }
          })
        }
      }
    })
  }
})