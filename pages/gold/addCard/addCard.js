// pages/gold/addCard/addCard.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxMoney:0,
    money:0,
    getMoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var maxMoney = parseInt(options.money);
    this.setData({
      maxMoney:maxMoney,
      money:maxMoney,
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
  // 加减
  subMoney:function(){
    var money = this.data.money-1;
    this.setData({
      money
    })
  },
  addMoney:function(){
    var money = this.data.money + 1;
    this.setData({
      money
    })
  },
  subGetMoney: function () {
    var getMoney = this.data.getMoney - 1;
    this.setData({
      getMoney
    })
  },
  addGetMoney: function () {
    var getMoney = this.data.getMoney + 1;
    this.setData({
      getMoney
    })
  },
  // 输入框输入
  inputGetMoney:function(e){
    var value = parseFloat(e.detail.value);
    var money = this.data.money;
    var getMoney = this.data.getMoney; 
    if(value<0){
      value = 1
    }
    this.setData({
      getMoney:value
    })
  },
  inputMoney:function(e){
    var value = parseInt(e.detail.value);
    var maxMoney = this.data.maxMoney;
    var money = this.data.money;
    if (value > maxMoney) {
      value = maxMoney
    }
    this.setData({
      money: value
    })
  },
  // 生成卡券
  addCard:function(){
    var balance = this.data.money;
    var money = this.data.getMoney;
    console.log(balance);
    console.log(money);
    app.request({
      url:'/account/addCard',
      data:{
        balance,
        money,
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          console.log('成功')
          var card_id = res.data.messages.card_id;
          wx.redirectTo({
            url: '../saleCard/saleCard?id='+card_id,
          });
        }
      }
    })
  }
})