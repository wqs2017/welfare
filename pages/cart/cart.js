// pages/cart/cart.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrInfo:[],
    limitNum:1,
    info:'',
    addrIndex:0,
    totalNum:0,
    cart_ids:[],
    btnStatus:0,
    startX:0,
    endX:0,
    leftMove: 0,
  },
  //  填写收货人
  goAddAddr: function () {
    wx.navigateTo({
      url: './addAddr/addAddr',
    })
  },
  goAddr: function () {
    wx.navigateTo({
      url: './addr/addr?index='+this.data.addrIndex,
    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'addrIndex',
      success: function(res) {
        console.log(res);
        console.log('------')
        that.setData({
          addrIndex:res.data
        });
        wx.clearStorage({
          key:'addrIndex'
        })
      },
    })
    app.request({
      url:'/order/getShoppingCart',
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          var info = res.data.messages;
          for(var i=0;i<info.data.length;i++){
            info.data[i].status=0;
            info.data[i].dStatus = 0;
          }
          that.setData({
            info:info
          });
          that.total();
        }else{
          wx.showModal({
            title: '系统错误，请重新进入',
          })
        }
      }
    });
    // 获取收货地址
    app.request({
      url:'/user/getAddr',
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          that.setData({
            addrInfo: res.data.messages.data
          })
        }else{
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
  addBtn:function(e){
    var index = e.currentTarget.dataset.id;
  },
  // 总数据
  total:function(){
    var that = this;
    var info = that.data.info;
    var totalNum = 0;
    var cart_ids = [];
    for(var i=0;i<info.data.length;i++){
      if(info.data[i].status==0){
        totalNum += (info.data[i].price * info.data[i].num);
        cart_ids.push(info.data[i].id)
      }
    }
    this.setData({
      totalNum,
      cart_ids
    })
  },
  // 增加num
  addLimitNum:function(e){
    var index = e.currentTarget.dataset.index;
    var data = this.data.info.data;
    data[index].num+=1
    this.setData({
      'info.data':data
    });
    this.total();
    this.updateCart(data[index].good_id, data[index].num);
  },
  subLimitNum:function(e){
    var index = e.currentTarget.dataset.index;
    var data = this.data.info.data;
    data[index].num -= 1
    this.setData({
      'info.data': data
    });
    this.total();
    this.updateCart(data[index].good_id, data[index].num);
  },
  updateCart:function(good_id,num){
    app.request({
      url:'/order/updateShoppingCart',
      data:{
        good_id,
        num
      },
    })
  },
  // 取消选择
  cancelCircle:function(e){
    var index = e.currentTarget.dataset.index;
    var data = this.data.info.data;
    if(data[index].status==0){
      data[index].status=1;
      this.setData({
        'info.data':data
      })
    }else{
      data[index].status = 0;
      this.setData({
        'info.data': data
      })
    };
    this.total();
  },
  // 确认订单
  addOrder:function(){
    var that = this;
    var info = this.data.info;
    var addrInfo = this.data.addrInfo;
    var addrIndex = this.data.addrIndex;
    var addr_id = '';
    if (addrInfo.length>0){
      addr_id = addrInfo[addrIndex].addr_id
    }
    var cart_ids = this.data.cart_ids;
    // for(var i=0;i<info.data.length;i++){
    //   if(info.data[i].status==0){
    //     cart_ids.push(info.data[i].good_id)
    //   }
    // }
    console.log(cart_ids);
    if(cart_ids.length==0){
      wx.showModal({
        title: '请先添加商品',
      })
    } else if (addrInfo.length==0){
      wx.showModal({
        title: '请先添加收货地址',
        confirmText:'去填写',
        success:function(res){
          if(res.confirm){
            that.goAddAddr();
          }
        }
      })
    }else{
      that.setData({
        btnStatus:1,
      })
      wx.showLoading({
        title: '正在下单',
      })
      app.request({
        url:'/order/addOrder',
        data:{
          cart_ids,
          addr_id,
        },
        success:function(res){
          console.log(res);
          if(res.data.errorcode==200){
            var order_id = res.data.messages.order_id;
            wx.navigateTo({
              url: '../orderSure/orderSure?order_id='+order_id,
            })
          }else{
            wx.showModal({
              title: '下单失败，请重试',
            })
          }
        },
        complete:function(){
          wx.hideLoading();
          that.setData({
            btnStatus: 0,
          })
        }
      })
    }
  },
  addOrderTip:function(){
    wx.showModal({
      title: '请先选择商品',
    })
  },
  // 返回首页
  goIndex:function(){
    wx.navigateBack({
      delta:1
    })
  },
  deletCar:function(e){
    var that = this;
    var good_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定移出购物车？',
      success:function(res){
        if(res.confirm){
          app.request({
            url:'/order/delShoppingCart',
            data:{
              good_id
            },
            success:function(res){
              console.log(res);
              if(res.data.errorcode==200){
                that.onShow();
              }
            }
          })
        }
      }
    })
  },
  // 滑动开始
  touchS:function(e){
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  // 滑动中
  touchM:function(e){
    
  },
  // 滑动结束
  touchE:function(e){
    console.log(e);
    var endX = e.changedTouches[0].clientX;
    var startX = this.data.startX;
    var index = e.currentTarget.dataset.index;
    var data = this.data.info.data;
    // if (e.touches.length == 1) {

      if((startX-endX)>50){
        data[index].dStatus = 1; 
        this.setData({
          'info.data':data
        })
      } else{
        data[index].dStatus = 0; 
        this.setData({
          'info.data': data
        })
      }
      
    // }
  },
  // 清除删除
  clearDelete:function(){
    var data = this.data.info.data;
    for(var i=0;i<data.length;i++){
      data[i].dStatus=0
    }
    this.setData({
      'info.data':data
    })
  }
})