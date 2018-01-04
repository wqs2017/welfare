// pages/gold/saleCard/saleCard.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      card_id:'',
      balance:0,
      money:0,
    },
    inputText:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var card_id = options.id;
    var that = this;
    console.log(card_id);
    app.request({
      url:'/account/getCardById',
      data:{
        card_id:card_id
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          var memo = res.data.messages.card.memo;
          if(memo==null){
            memo=='';
          }
          that.setData({
            info: res.data.messages.card,
            inputText: memo
          })
        }
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
    var info = this.data.info;
    var user = app.globalData.user;
    return {
      title: info.nick_name+'在善食者联盟分享了购物券',
      path: '/pages/index/index?card_id=' + info.card_id + '&openid=' + user.openid 
    }
  },
  // 输入框输入
  textInput:function(e){
    var value = e.detail.value;
    this.setData({
      inputText:value
    })
  },
  // 确定寄语
  sureText:function(e){
    var value = e.detail.value;
    this.setData({
      inputText: value
    });
    if(value!=''){
      var card_id = this.data.info.card_id;
      app.request({
        url: '/account/addMemo',
        data: {
          card_id: card_id,
          memo: value,
        },
        success: function (res) {
          console.log(res);
          if (res.data.errorcode == 200) {

          }
        }
      })
    }
  },
  // 取消预售
  cancelCard:function(){
    var card_id = this.data.info.card_id;
    console.log(card_id);
    wx.showModal({
      title: '确认取消预售？',
      success:function(res){
        if(res.confirm){
          app.request({
            url: '/account/cancelCard',
            data: {
              card_id:card_id
            },
            success: function (res) {
              console.log(res)
              if (res.data.errorcode == 200) {
                wx.showToast({
                  title: '取消成功',
                  duration: 600
                });
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 600)
              }else{
                wx.showModal({
                  title: '取消失败',
                })
              }
            }
          })
        }
      }
    })
  },
})