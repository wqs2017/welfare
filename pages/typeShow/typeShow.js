// pages/typeShow/typeShow.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:[],
    list:[],
    pageNum:1,
    classify_id:'',
    alertStatus:0,
    scrollLeft:0,
    total_page:0,
    addStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =  this;
    app.request({
      url:'/index/classifies',
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          var d = res.data.messages.data;
          that.setData({
            title:d,
            classify_id:d[0].classify_id
          });
          that.loadData();
        }else{
          wx.showModal({
            title: '数据错误，请重试',
          })
        }
      }
    })
  },
  loadData:function(){
    var that = this;
    this.setData({pageNum:1});
    var classify_id = this.data.classify_id;
    app.request({
      url: '/index/getGoodsByClassify',
      data:{
        pageNum:1,
        classify_id,
      },
      success: function (res) {
        console.log(res);
        if (res.data.errorcode == 200) {
          that.setData({
            list:[],
          })
          var list = res.data.messages.data
          that.setData({
            total_page: res.data.messages.total_page
          })
          that.filterData(list);
        }
      }
    })
  },
  // 标题按钮
  selectBtn:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    this.setData({
      classify_id:id,
    })
    that.loadData();
  },
  // tag选择
  tagSelect:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth/750);
        var ratio = (res.windowWidth / 750).toFixed(3);
        that.setData({
          classify_id: id,
          scrollLeft: index * 180 *ratio
        });
        that.loadData();
      }
    })
  },
  // tag 确定
  tagSure:function(){
    this.setData({
      alertStatus:0
    })
  },
  // alert show
  alertShow:function(){
    var status = this.data.alertStatus;
    if(status==0){
      this.setData({
        alertStatus: 1
      })
    }else{
      this.setData({
        alertStatus: 0
      })
    }
  },
  // 下拉加载
  addList:function(){
    console.log(1)
    var that = this;
    var pageNum = this.data.pageNum + 1;
    var total_page = this.data.total_page;
    var addStatus = this.data.addStatus;
    var classify_id = this.data.classify_id;
    console.log(total_page);
    if (addStatus == 0 && pageNum <= total_page){
      that.setData({
        addStatus: 1,
        pageNum: pageNum
      })
      wx.showLoading({
        title: '加载中',
      })
      app.request({
        url: '/index/getGoodsByClassify',
        data: {
          pageNum,
          classify_id,
        },
        success: function (res) {
          console.log(res);
          if (res.data.errorcode == 200) {
            var list = res.data.messages.data;
            that.filterData(list);
          }
        },
        complete:function(){
          wx.hideLoading();
          that.setData({
            addStatus: 0,
          })
        }
      })
    }else{

    }
  },
  // 过滤
  filterData: function (list) {
    var old_list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      list[i].dayMoney = (list[i].price / list[i].total_day).toFixed(2);
      list[i].num = Math.floor((list[i].price % 1).toFixed(2) * 100)
      list[i].price = Math.floor(list[i].price);
      list[i].percent = Math.floor(list[i].percent * 12)
      old_list.push(list[i]);
    }
    this.setData({
      list: old_list
    })
  },
  // 去详情
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
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
  
  }
})