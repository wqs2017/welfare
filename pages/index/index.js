//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    list:[],
    alertStatus:0,
    pageNum:1,
    total_page:1,
    carts:0,
    addStatus:0,
    order_count:0,
    banners:[],
    card_info:{
      card_id: '',
      balance: 0,
      money: 0,
    },


  },
  //事件处理函数
  goDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  },
  // 去banner详情
  goBanner:function(e){
    console.log(e);
    var img = e.currentTarget.dataset.img;
    wx.navigateTo({
      url: './banner/banner?img='+img,
    })
  },
  goPerson:function(){
    wx.navigateTo({
      url: '../person/person',
    })
  },
  goGold:function(){

  },
  goCart:function(){
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  // 提示
  goTypeShow:function(e){
    var index = e.currentTarget.dataset.index;
    if(index == 0){
      wx.navigateTo({
        url: '../typeShow/typeShow',
      })
    }else{
      wx.showModal({
        title: '即将上线，敬请期待',
      })
    }
  },
  onShow:function(){
    var that = this;
    app.request({
      url: '/index/home',
      data: {
        pageNum: 1,
      },
      success: function (res) {
        console.log(res);
        if (res.data.errorcode == 200) {
          var info = res.data.messages;
          that.setData({
            carts: info.carts,
          })
        }
      },
      complete:function(){
        var alertStatus = that.data.alertStatus;
        var card_id = that.data.card_info.card_id;
        if (alertStatus == 'self') {
          wx.navigateTo({
            url: '../gold/saleCard/saleCard?id='+card_id,
            complete: function () {
              that.setData({
                alertStatus: 0
              })
            }
          })
        }
      }
    });
  },
  // 加载某个页面数据
  loadReq:function(){
    var that = this;
    var pageNum = this.data.pageNum+1;
    var total_page = this.data.total_page;
    var addStatus = this.data.addStatus;
    if (addStatus == 0 && pageNum <= total_page){
      that.setData({
        addStatus:1,
        pageNum:pageNum
      })
      wx.showLoading({
        title: '加载中',
      })
      app.request({
        url: '/index/home',
        data: {
          pageNum: pageNum,
        },
        success: function (res) {
          console.log(res);
          if (res.data.errorcode == 200) {
            var list = res.data.messages.data;
            that.filterData(list);
          } else {
            wx.showModal({
              title: '数据加载失败',
            })
          }
        },
        complete: function () {
          wx.hideLoading();
          that.setData({
            addStatus: 0,
          })
        }
      })
    }
  },
  // 过滤percent数据
  filterData:function(list){
    var old_list = this.data.list;  
    for(var i=0;i<list.length;i++){
      list[i].dayMoney = (list[i].price / list[i].total_day).toFixed(2);
      console.log(list[i].price)
      list[i].num = Math.floor((list[i].price%1).toFixed(2)*100)
      console.log(list[i].num);
      list[i].price = Math.floor(list[i].price);
      list[i].percent = Math.floor(list[i].percent* 12)
      old_list.push(list[i]);
      console.log(list[i].price);
    }  
    this.setData({
      list:old_list
    })
  },
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this;
    app.request({
      url:'/index/banners',
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          that.setData({
            banners:res.data.messages.data
          })
        }
      }
    });
    // 加载数据
    var that = this;
    app.request({
      url: '/index/home',
      data: {
        pageNum: 1,
      },
      success: function (res) {
        console.log(res);
        if (res.data.errorcode == 200) {
          var info = res.data.messages;
          that.setData({
            carts: info.carts,
            total_page: info.total_page,
            order_count: info.order_count,
          })
          that.setData({
            list: [],
          })
          that.filterData(info.data);
        } else {
          wx.showModal({
            title: '数据加载失败',
          })
        }
      },
      complete: function () {
        // 新用户展示引导页
        var isNewUser = app.globalData.isNewUser;
        var user = app.globalData.user;
        that.setData({
          userInfo: user
        });
        console.log(user);
        if (isNewUser == true) {
          that.setData({
            alertStatus: 1,
          });
          getApp().globalData.isNewUser = false;
        }
      }
    })
    // wx.navigateTo({
    //   url: '../gold/getMoney/getMoney',
    // })
    if(options.card_id){
      var user = app.globalData.user;
      if(options.openid==user.openid){
        this.setData({
          alertStatus:'self',
          'card_info.card_id': options.card_id
        })
        return
      }else{
        this.setData({
          alertStatus: 2
        });
      } 
      app.request({
        url:'/account/getCardById',
        data: {
          card_id: options.card_id,
        },
        success:function(res){
          if(res.data.errorcode==200){
            that.setData({
              card_info: res.data.messages.card
            })
          }
        }
      })
    }
  },
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
  },
  leadHide:function(){
    this.setData({
      alertStatus:0,
    })
  },
  // 下拉加载更多
  addList:function(){
    this.loadReq();
  },

  pageScroll:function(){

  },
  // 购买券
  buyCard:function(){
    var that = this;
    var card_info = this.data.card_info;
    app.request({
      url:'/account/buyCard',
      data:{
        card_id:card_info.card_id
      },
      success:function(res){
        console.log(res);
        if (res.data.errorcode == 200) {
          app.request({
            url: '/pay/wxPayCard',
            data: {
              id: res.data.messages.id
            },
            success: function (res) {
              console.log(res);
              if(res.data.messages.success){
                // 支付为0
                that.setData({
                  alertStatus: 0
                })
                wx.navigateTo({
                  url: '../gold/gold',
                })
                return
              }
              if (res.data.errorcode == 200) {
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
                    that.setData({
                      alertStatus:0
                    })
                  }
                });
              }
            }
          })
        } else {
          wx.showModal({
            title: res.data.messages.errorinfo,
            success:function(){
              that.setData({
                alertStatus: 0
              })
            }
          })
        }
      }
    })
  },
  successPay:function(){
    var taht = this;
    wx.showModal({
      title: '付款成功',
      confirmText: '查看详情',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../gold/gold',
          })
        }
      },
    });
  }
})
