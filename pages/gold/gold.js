// pages/gold/gold.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      gold:0,
      return_gold:0,
      data:[],
    },
    pageNum: 1,
    loadStatus: 0,
    alertStatus:0,
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
  
  },

  // addlist
  loadData:function(){
    var that = this;
    var pageNum = this.data.pageNum;
    var loadStatus = this.data.loadStatus;
    if(loadStatus==0){
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        loadStatus:1,
      })
      app.request({
        url: '/user/getUserGold',
        data: {
          pageNum: pageNum
        },
        success: function (res) {
          console.log(res);
          var new_data = res.data.messages.data;
          var data = that.data.info.data;
          new_data = that.dateFilter(new_data);
          data.push(...new_data);
          if (res.data.errorcode == 200) {
            that.setData({
              'info.data': data
            })
          }
        },
        complete:function(){
          wx.hideLoading();
          that.setData({
            loadStatus:1
          })
        }
      });
    }
  },

  addList:function(){
    var pageNum = parseInt(this.data.pageNum)+1;
    var total_page = this.data.info.total_page;
    if(pageNum<=total_page){
      this.setData({
        pageNum: pageNum
      });
      this.loadData();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.request({
      url:'/user/getUserGold',
      success:function(res){
        console.log(res);
        console.log('------');
        if(res.data.errorcode==200){
         var info = res.data.messages;
         info.data = that.dateFilter(info.data);
         that.setData({
           info:info
         }) 
        }
      }
    });
  },

  // 时间
  dateFilter:function(data){
    for (let i of data) {
      i.create_date = new Date(i.create_date);
      var date = new Date(i.create_date);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      i.create_date = Y + M + D;
    } 
    return data
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
  // 去生成鼓励金券
  giveBtn:function(){
    // this.setData({
    //   alertStatus:1,
    // })
    var money = this.data.info.gold;
    if(money>0){
      wx.navigateTo({
        url: './addCard/addCard?money=' + money,
      })
    }else{
      wx.showModal({
        title: '您的余额不足以转让',
      })
    }

  },
  // 弹窗
  tipHide:function(){
    this.setData({
      alertStatus: 0,
    })
  },
  // 去预售卡券
  goCard:function(e){
    var card_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './saleCard/saleCard?id='+card_id,
    })
  },
  // 去赠送攻略
  goGiveRule:function(){
    console.log(122)
    wx.navigateTo({
      url: './rule/rule',
    })
  },
  // 使用
  useCard:function(e){
    var that = this;
    var card_id = e.currentTarget.dataset.id;
    console.log(card_id);
    app.request({
      url:'/account/useCard',
      data:{
        id:card_id
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          wx.showModal({
            title: '卡券金额已到余额，您可以在购买中使用',
          })
        }else{
          wx.showModal({
            title: res.data.messages.errorinfo,
          })
        }
      },
      complete:function(){
        that.onShow()
      }
    })
  },
  // 提现
  getMoney:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认提现',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '提现中...',
          });
          app.request({
            url:'/pay/withdrawals',
            data:{
              card_id:id
            },
            success:function(res){
              wx.hideLoading();
              if(res.data.errorcode==200){
                wx.showModal({
                  title: '提现成功，已转至您的微信账户',
                })
              }else{
                wx.showModal({
                  title: res.data.messages.errorinfo,
                })
              }
            },
            complete:function(){
              wx.hideLoading();
              that.onShow();
            }
          })
        }
      }
    })
  }
})