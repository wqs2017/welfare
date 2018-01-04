// pages/follow/follow.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pageNum:1,
    addStatus:0,
    totalPage:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的关注',
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
  // 加载
  loadData:function(){

  },
  onShow: function () {
    var that = this;
    var that = this;
    app.request({
      url: '/follow/follows',
      data: {
        pageNum: 1,
      },
      success: function (res) {
        console.log(res);
        if(res.data.errorcode==200){
          that.setData({
            list: res.data.messages.data,
            total_page: res.data.messages.total_page
          })
        }
      }
    })
  },
  // 下拉加载
  addList:function(){
    var that = this;
    that.loadData();
  },
  loadData:function(){
    var that = this;
    var pageNum = this.data.pageNum+1;
    var totalPage = this.data.total_page;
    var addStatus = this.data.addStatus;
    if(pageNum<=totalPage&&addStatus==0){
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        addStatus:1,
        pageNum
      })
      app.request({
        url: '/follow/follows',
        data: {
          pageNum: pageNum,
        },
        success: function (res) {
          console.log(res);
          if (res.data.errorcode == 200) {
            var list = that.data.list;
            for (var i=0;i<res.data.messages.data.length;i++){
              list.push(res.data.messages.data[i])
            };
            that.setData({
              list,
            })
          }
        },
        complete:function(){
          wx.hideLoading();
          that.setData({
            addStatus: 0,
          })
        }
      })
    }
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
  goDetail:function(e){
    var good_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+good_id,
    })
  }
})