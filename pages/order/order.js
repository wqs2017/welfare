// pages/order/order.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabStatus:0,
    pageNum:1,
    info:{
      data:[],
    },
    loadStatus:0,
  },
  // tab
  tabBtn:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      tabStatus:index
    });
    this.tabLoad();
  },
  goOrderDetail:function(e){
    var status = e.currentTarget.dataset.status;
    var order_id = e.currentTarget.dataset.id;
    if (status =='enable'){
      wx.navigateTo({
        url: '../orderSure/orderSure?order_id='+order_id,
      })
    }else{
      wx.navigateTo({
        url: './detail/detail?status=' + status + '&order_id=' + order_id,
      })
    }
  },
  // 删除订单
  deleteOrder:function(e){
    var that = this;
    var order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定删除此订单？',
      success: function (res) {
        if (res.confirm) {
          app.request({
            url: '/order/del',
            data: {
              order_id: order_id
            },
            success: function (res) {
              console.log(res);
              if (res.data.errorcode == 200) {
                wx.showToast({
                  title: '删除成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.onShow();
                }, 1000)
              } else {
                wx.showModal({
                  title: '删除失败，请重试',
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tabLoad();
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
  // tab切换
  tabLoad:function(){
    var that = this;
    var pageNum = that.data.pageNum;
    var tabStatus = parseInt(this.data.tabStatus) + 1;
    console.log(tabStatus)
    app.request({
      url: '/order/getOrders',
      data: {
        pageNum,
        type: tabStatus,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          info: res.data.messages
        });
      }
    })
  },
  loadData:function(){
    var that = this;
    var pageNum = that.data.pageNum;
    var tabStatus = parseInt(this.data.tabStatus)+1;
    var loadStatus = this.data.loadStatus;
    if(loadStatus==0){
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        loadStatus: 1
      })
      app.request({
        url: '/order/getOrders',
        data: {
          pageNum,
          type: tabStatus,
        },
        success: function (res) {
          console.log(res);
          var data = that.data.info.data;
          var n_data = res.data.messages.data;
          data.push(...n_data);
          if (res.data.errorcode == 200) {
            that.setData({
              'info.data': data
            });
          }
        },
        complete:function(){
          wx.hideLoading();
          this.setData({
            loadStatus:0
          })
        }
      })
    }

  },
  // 下拉
  addList:function(){
    var pageNum = parseInt(this.data.pageNum)+1;
    var total_page = this.data.info.total_page;
    if(pageNum<=total_page){
      this.setData({
        pageNum: pageNum
      })
      this.loadData();
    }
  }
})