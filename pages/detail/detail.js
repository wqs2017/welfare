// pages/detail/detail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limitNum:1,
    alertStatus:0,
    product:'',
    list:[],
    info:'',
    good_id:1,
    totalPrice:0,
  },
  // 事件 
  alertShow:function(){
    this.setData({
      alertStatus:1,
    })
  },
  alertHide: function () {
    this.setData({
      alertStatus: 0,
    })
  },  
  addLimitNum: function () {
    var that = this;
    var limitNum = that.data.limitNum + 1;
    var product = that.data.product;
    if (limitNum > product.limit_count) {
      limitNum = product.limit_count;
    };
    var totalPrice = (limitNum * product.price).toFixed(2)
    that.setData({
      limitNum: limitNum,
      totalPrice:totalPrice,
    });
  },
  subLimitNum: function () {
    var that = this;
    var limitNum = that.data.limitNum - 1;
    var product = that.data.product;
    if (limitNum < 1) {
      limitNum = 1
    }
    var totalPrice = (limitNum * product.price).toFixed(2)
    that.setData({
      limitNum: limitNum,
      totalPrice: totalPrice,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  loadData: function (){
    var that = this;
    var good_id = that.data.good_id;
    app.request({
      url: '/index/getGoodById',
      data: {
        good_id: good_id
      },
      success: function (res) {
        console.log(res);
        if (res.data.errorcode == 200) {
          var info = res.data.messages;
          var product = res.data.messages.good;
          var totalPrice = product.price.toFixed(2);
          product.percent = Math.floor(product.percent * 19);
          product.dayMoney = (Math.floor(product.price / product.total_day*100)/100);
          product.name = product.good_name.split('-');
          
          console.log(product.name)
          that.setData({
            list: info.list,
            info: info,
            product:product,
            totalPrice:totalPrice
          });
        } else {
          wx.showModal({
            title: '数据加载失败',
          })
        }
      },
    })
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      good_id:options.id
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
    var that =  this;
    wx.getStorage({
      key: 'selectGoodId',
      success: function(res) {
        console.log(res);
        that.setData({
          good_id:res.data
        });
      },
      complete:function(){
        that.loadData();
        wx.clearStorage({
          key: 'selectGoodId',
        })
      }
    })
  },
  // 选择日期
  selectDate:function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    for(let i of list){
      i.isChecked = false;
    }
    list[index].isChecked = true;
    this.setData({
      list:list,
      good_id:id,
    })
    this.loadData();
  },
  // 选择口味
  selectType: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = this.data.info.types;
    for (let i of list) {
      i.isChecked = false;
    }
    list[index].isChecked = true;
    this.setData({
      'info.types': list,
      good_id: id,
    })
    this.loadData();
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
    var product = this.data.product;
    return {
      title: `${product.dayMoney}元/天 - ${product.name[0]} ${product.name[1]}` ,
      path: '/pages/detail/detail?id='+product.good_id
    }
  },
  // 跳转
  goReport:function(){
    var img = this.data.product.report;
    if(img){
      wx.navigateTo({
        url: './report/report?img=' + img,
      })
    }
  },
  goDate:function(){
    var data = this.data.info;
    wx.setStorage({
      key: 'dateDate',
      data: data,
      success:function(){
        wx.navigateTo({
          url: './date/date'
        });
      }
    })
  },
  addCart:function(e){
    var that = this;
    var good_id = that.data.good_id;
    var num = that.data.limitNum;
    this.setData({
      alertStatus: 0,
    });
    app.request({
      url:'/order/addShoppingCart',
      data:{
        good_id,
        num,
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          wx.showToast({
            title: '成功加入购物车',
            duration:1200,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },1000)
            }
          })
        }else{
          wx.showModal({
            title: '系统错误，请重试',
          })
        }
      }
    })
  },
  followBtn:function(e){
    var that = this;
    var good_id = this.data.info.good.good_id;
    var req = e.currentTarget.dataset.req;
    app.request({
      url:'/follow/'+req,
      data:{
        good_id
      },
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          var follow = !that.data.info.follow;
          var total = that.data.info.total_records;
          console.log(follow);
          if(follow==true){
            that.setData({
              'info.follow': follow,
              'info.total_records': total+1
            })
          }else{
            that.setData({
              'info.follow': follow,
              'info.total_records': total - 1
            })
          }
        }else{
          wx.showModal({
            title: '请求失败，请重试',
          })
        }
      }
    })
  }
})