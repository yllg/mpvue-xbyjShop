<template >
<view class="container">
    <view class="total">
      <view class="label">订单金额</view>
      <view class="txt">{{actualPrice}}元</view>
    </view>
    <view class="pay-list">
        <view class="h">请选择支付方式</view>
        <view class="b">
            <view class="item">
                <view class="checkbox"></view>
                <view class="icon-alipay"></view>
                <view class="name">支付宝</view>
            </view>
            <view class="item">
                <view class="checkbox"></view>
                <view class="icon-net"></view>
                <view class="name">网易支付</view>
            </view>
            <view class="item">
                <view class="checkbox checked"></view>
                <image src="/static/images/wxpay.png" class="icon"/>
                <view class="name">微信支付</view>
            </view>
        </view>
    </view>
    <view class="tips">小程序只支持微信支付，如需其它支付方式，请在网页版支付</view>
    <view class="pay-btn" @click="startPay">确定</view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      orderId: 0,
      actualPrice: 0.00
    }
  },
  async mounted () {
    if (this.$route.query.orderId && this.$route.query.actualPrice) {
      this.orderId = this.$route.query.orderId;
      this.actualPrice = this.$route.query.actualPrice;
    }
  },
  methods: {
    // 点击确定
    async startPay () {
      const res = await api.PayPrepayIdFunc({ orderId: this.orderId, payType: 1 });
      // console.log('pay页直接支付,请求结果', res);
      if (res.errno === 0) {
        let payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.timeStamp,
          'package': payParam.nonceStr,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '../pay/payResult?status==1&orderId=' + this.orderId
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '../pay/payResult?status=0&orderId=' + this.orderId
            })
          }
        })
      } else {
        wx.redirectTo({
          url: '../pay/payResult?status=0&orderId=' + this.orderId
        })
      }
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/pay/pay'
    }
  }
}
</script>

<style scoped>
page{
    min-height: 100%;
    width: 100%;
    background: #f4f4f4;
}

.container{
  padding-top: 20rpx;
}

.total{
  height: 104rpx;
  background: #fff;
  width: 92%;
  line-height: 104rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.total .label{
  float: left;
}

.total .txt{
  float: right;
}

.pay-list{
    margin-top: 30rpx;
    height: auto;
    width: 100%;
    overflow: hidden;
}
.pay-list .h{
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    margin-left: 31.25rpx;
    margin-bottom: 31.25rpx;
}

.pay-list .item{
    height: 108rpx;
    padding-left: 31.25rpx;
    background: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
}

.pay-list .checkbox{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -448rpx no-repeat;
    background-size: 38rpx 486rpx;
    width: 40rpx;
    height: 40rpx;
    display: inline-block;
    vertical-align: middle;
    margin-right: 30rpx;
}

.pay-list .checkbox.checked{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -192rpx no-repeat;
    background-size: 38rpx 486rpx;
}

.pay-list .icon-alipay{
    display: inline-block;
    vertical-align: middle;
    background-image: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/payMethod-s3c1faebee4-d754da9c65.png);
    background-repeat: no-repeat;
    background-size: 56.25rpx 189.583rpx;
    margin-right: 10.5rpx;
    width: 56.25rpx;
    height: 56.25rpx;
}

.pay-list .icon-net{
    display: inline-block;
    vertical-align: middle;
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/payMethod-s3c1faebee4-d754da9c65.png) 0 -66.7rpx no-repeat;
    background-size: 56.25rpx 189.583rpx;
    margin-right: 10.5rpx;
    width: 56.25rpx;
    height: 56.25rpx;
}

.pay-list .icon{
    display: inline-block;
    vertical-align: middle;
    margin-right: 10.5rpx;
    width: 56.25rpx;
    height: 56.25rpx;
}

.pay-list .name{
    display: inline-block;
    vertical-align: middle;
    height: 56.25rpx;
    line-height: 56.25rpx;
}

.pay-btn{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    text-align: center;
    line-height: 100rpx;
    background: #b4282d;
    color: #fff;
    font-size: 30rpx;
}

.tips{
  height: 40rpx;
  width: 92%;
  font-size: 24rpx;
  color: #999;
  line-height: 40rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
}
</style>
