// pages/cart/addAddr/addAddr.js
const addrJson = require('./addr.js'); 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:'',
    pickerValue:[],
    provinceId: 110000,
    cityId: 110100,
    areaId: 110101,
    pickerStatus:0,
    province:'',
    city:'',
    area:'',
    username:'',
    tel:'',
    addr:'',
    btnStatus:0,
    addr_id:'',
    pageStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  this.setData({
    data: addrJson
  });
  wx.getStorage({
    key: 'addrEdit',
    success: function(res) {
      var d = res.data;
      console.log(res.data);
      console.log('---')
      that.setData({
        provinceId:d.province_id,
        cityId:d.city_id,
        areaId:d.area_id,
        addr:d.addr,
        username:d.username,
        tel:d.tel,
        addr_id:d.addr_id,
        pageStatus:'edit'
      });
      that.addrStr();
      wx.clearStorage({
        key:'addrEdit'
      })
    },
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
  inputText:function(e){
    var type = e.currentTarget.dataset.type;
    if(type=='name'){
      this.setData({
        username:e.detail.value,
      })
    }else if(type == 'phone'){
      this.setData({
        tel: e.detail.value,
      })
    }else if(type == 'addr'){
      this.setData({
        addr: e.detail.value,
      })
    }
  },
  // 地区选择
  pickerChange:function(e){
    console.log(e);
    var data = this.data.data;
    var value = e.detail.value;
    var city = data.city[data.province[value[0]].id];
    var area = data.area[city[value[1]].id];
    // return
    this.setData({
      pickerValue:value,
      cityId: city[value[1]].id,
      areaId: area[value[2]].id,
      provinceId: data.province[value[0]].id,
    })
  },
  // 转换地址str
  addrStr:function(){
    var data = this.data.data;
    var provinceId = this.data.provinceId;
    var cityId = this.data.cityId;
    var areaId = this.data.areaId;
    var index_a = 0,index_b=0,index_c=0;
    for (var i = 0; i < data.province.length; i++) {
      if (data.province[i].id == provinceId) {
        index_a = i;
      }
    }
    for (var j = 0; j < data.city[provinceId].length; j++) {
      if (data.city[provinceId][j].id == cityId) {
        index_b = j;
      }
    };
    for (var k = 0; k < data.area[cityId].length; k++){
      if (data.area[cityId][k].id==areaId){
        index_c = k;
      }
    };
    var province = data.province[index_a].name;
    var city = data.city[provinceId][index_b].name;
    var area = data.area[cityId][index_c].name;
    this.setData({
      province,
      city,
      area,
      pickerValue:[index_a,index_b,index_c]
    })
  },
  // picker 显示隐藏
  pickerSure:function(){
    this.addrStr();
    this.setData({
      pickerStatus:0,
    })
  },
  pickerShow:function(){
    this.setData({
      pickerStatus: 1,
    })
  },
  pickerCancel:function(){
    this.setData({
      pickerStatus: 0,
    })
  },
  // 提交
  sureBtn:function(){
    var that = this;
    var d = this.data;
    var that =this;
    var req_url = '/user/addAddr';
    var pageStatus = this.data.pageStatus;
    var data = {
      username: d.username,
      tel: d.tel,
      addr: d.addr,
      province_name: d.province,
      province_id: d.provinceId,
      city_name: d.city,
      city_id: d.cityId,
      area_name: d.area,
      area_id: d.areaId,
    }
    // 编辑修改
    if (pageStatus == 'edit') {
      req_url = '/user/updateAddr'; 
      data.addr_id = that.data.addr_id;
    }
    this.setData({
      btnStatus:1,
    })
    wx.showLoading({
      title: '保存中',
    })
    app.request({
      url:req_url,
      data:data,
      success:function(res){
        console.log(res);
        if(res.data.errorcode==200){
          wx.showModal({
            title: '保存成功',
            success:function(){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }else{
          wx.showModal({
            title: '保存失败请重试',
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
})