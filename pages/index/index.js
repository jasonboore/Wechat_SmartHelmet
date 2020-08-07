const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:"",
    altitude:"",
    temperature:"",
    warning:"",
    light:"",
    tempArr:null,
    lightArr:null,
    warnArr:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurInfo();
    this.getDatas(0,(res)=>{
      this.setData({
        tempArr: res
      })
    });
    this.getDatas(1,(res)=>{
      this.setData({
        lightArr: res
      })
    });
    this.getDatas(2,(res)=>{
      this.setData({
        warnArr: res
      })
    });
  },
  getDatas:function(id=0, returnDatas){
    var url="";
    if(id == 0) {
      url = "http://39.96.68.13:1003/GetTemerature";
    }else if(id == 1) {
      url = "http://39.96.68.13:1003/GetLight";
    }else{
      url = "http://39.96.68.13:1003/GetMPU"
    }
    wx.request({
      url: url,
      method:"POST",
      data:{
        "helmet_id":"HELMET_1",
        "begin":"2020-5-20 00:00",
        "end":"2020-7-20 00:00"
      },
      success:(res)=>{
        if(id == 0) {
          for(var i = 0; i < 10; i++) {
            res.data[i].temperature = res.data[i].temperature.toFixed(1);
            res.data[i].time = util.formatTimeTwo(res.data[i].time, "Y/M/D h:m");
            if(i % 2 == 0) {
              res.data[i].temperature = 0 - res.data[i].temperature;
            }
          } 
          return returnDatas(res.data.slice(0, 10));
        }else if(id == 1) {
          for(var i = 0; i < 10; i++) {
            res.data[i].light = res.data[i].light.toFixed(1);
            res.data[i].time = util.formatTimeTwo(res.data[i].time, "Y/M/D h:m");
            if(i % 2 == 0) {
              res.data[i].light = 0 - res.data[i].light;
            }
          } 
          return returnDatas(res.data.slice(0, 10));
        }else {
          res.data[0].warning = 0;
          return returnDatas(res.data);
        }
        
      }
      
    })
  },
  getCurInfo:function(){
    wx.request({
      url: 'http://39.96.68.13:1003/GetCurrentData',
      method:"POST",
      data:{
        "helmet_id":"HELMET_1"
      },
      success:(res)=>{
        var warn = res.data.warning == 0 ? "无危险" : "疑似危险";
        var time = util.formatTimeTwo(res.data.time, "Y/M/D h:m")
        this.setData({
          time:time,
          altitude:res.data.altitude.substring(0, 4),
          temperature: res.data.temperature.toFixed(1),
          warning: warn,
          light: res.data.light
        })
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
    
  }
})