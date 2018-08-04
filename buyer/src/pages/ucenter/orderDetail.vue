<template >
<view class="container">
    <view class="order-info">
        <view class="item-a">下单时间：{{orderInfo.add_time}}</view>
        <view class="item-b">订单编号：{{orderInfo.order_sn}}</view>
        <view class="item-c">
            <view class="l">实付：<text class="cost">￥{{orderInfo.actual_price}}</text></view>
            <view class="r">
                <view class="btn" @click="cancelOrder">取消订单</view>
                <view class="btn active" @click="payOrder">去付款</view>
            </view>
        </view>
    </view>
    <view class="order-goods">
        <view class="h">
            <view class="label">商品信息</view>
            <view class="status">{{orderInfo.order_status_text}}</view>
        </view>
        <view class="goods">
            <view class="item" v-for="(item, index) of orderGoods" :key="item.id" :data-index="index">
                <view class="img">
                    <image :src="item.list_pic_url"/>
                </view>
                <view class="info">
                    <view class="t">
                        <text class="name">{{item.goods_name}}</text>
                        <text class="number">x{{item.number}}</text>
                    </view>
                    <view class="attr">{{item.goods_specifition_name_value}}</view>
                    <view class="price">￥{{item.retail_price}}</view>
                </view>
            </view>
        </view>
    </view>
    <view class="order-bottom">
        <view class="address">
            <view class="t">
                <text class="name">{{orderInfo.consignee}}</text>
                <text class="mobile">{{orderInfo.mobile}}</text>
            </view>
            <view class="b">{{orderInfo.full_region + orderInfo.address}}</view>
        </view>
        <view class="total">
            <view class="t">
                <text class="label">商品合计：</text>
                <text class="txt">￥{{orderInfo.goods_price}}</text>
            </view>
            <view class="t">
                <text class="label">运费：</text>
                <text class="txt">￥{{orderInfo.freight_price}}</text>
            </view>
        </view>
        <view class="pay-fee">
            <text class="label">实付：</text>
            <text class="txt">￥{{orderInfo.actual_price}}</text>
        </view>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      orderId: 0,
      orderInfo: {},
      orderGoods: [],
      handleOption: {}
    }
  },
  async mounted () {
    if (this.$route.query.id) {
      this.orderId = parseInt(this.$route.query.id);
    }
    await Promise.all([
      this.getOrderDetail()
    ])
  },
  methods: {
    // 获取订单数据
    async getOrderDetail () {
      const res = await api.getOrderDetail({ orderId: this.orderId });
      // console.log('订单详情,请求结果', res);
      if (res.errno === 0) {
        this.orderInfo = res.data.orderInfo;
        this.orderGoods = res.data.orderGoods;
        this.handleOption = res.data.handleOption;
        // this.payTimer();
      }
    },
    // 制作倒计时用的，暂时不需要
    payTimer () {
      let orderInfo = this.orderInfo;
      setInterval(() => {
        // console.log(orderInfo);
        orderInfo.add_time -= 1;
        this.orderInfo = orderInfo;
      }, 1000);
    },
    // 点击“去付款”
    async payOrder () {
      let that = this;
      const res = await api.PayPrepayIdFunc({ orderId: this.orderId || 15 });
      // console.log('订单详情页去付款,请求结果', res);
      if (res.errno === 0) {
        // 原生的支付方法
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '../pay/payResult?status=1&orderId=' + that.orderId
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '../pay/payResult?status=0&orderId=' + that.orderId
            })
          }
        });
      } else {
        wx.redirectTo({
          url: '/pages/pay/payResult?status=0&orderId=' + that.orderId
        })
      }
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/ucenter/orderDetail'
    }
  }
}
</script>

<style scoped>
page{
    height: 100%;
    width: 100%;
    background: #f4f4f4;
}

.order-info{
    padding-top: 25rpx;
    background: #fff;
    height: auto;
    overflow: hidden;
    width: 100%;
}

.item-a{
    padding-left: 31.25rpx;
    height: 42.5rpx;
    padding-bottom: 12.5rpx;
    line-height: 30rpx;
    font-size: 30rpx;
    color: #666;
}

.item-b{
    padding-left: 31.25rpx;
    height: 29rpx;
    line-height: 29rpx;
    margin-top: 12.5rpx;
    margin-bottom: 41.5rpx;
    font-size: 30rpx;
    color: #666;
}

.item-c{
    margin-left: 31.25rpx;
    border-top: 1px solid #f4f4f4;
    height: 103rpx;
    line-height: 103rpx;
}

.item-c .l{
    float: left;
}

.item-c .r{
    height: 103rpx;
    float: right;
    display: flex;
    align-items: center;
    padding-right: 16rpx;
}

.item-c .r .btn{
    float: right;
}

.item-c .cost{
    color: #b4282d;
}

.item-c .btn{
    line-height: 66rpx;
    border-radius: 5rpx;
    text-align: center;
    margin: 0 15rpx;
    padding: 0 20rpx;
    height: 66rpx;
}

.item-c .btn.active{
    background: #b4282d;
    color: #fff;
}

.order-goods{
    margin-top: 20rpx;
    background: #fff;
    width: 100%;
}

.order-goods .h{
    height: 93.75rpx;
    line-height: 93.75rpx;
    margin-left: 31.25rpx;
    border-bottom: 1px solid #f4f4f4;
    padding-right: 31.25rpx;
}

.order-goods .h .label{
    float: left;
    font-size: 30rpx;
    color: #333;
}

.order-goods .h .status{
    float: right;
    font-size: 30rpx;
    color: #b4282d;
}

.order-goods .item{
    display: flex;
    align-items: center;
    height: 192rpx;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    border-bottom: 1px solid #f4f4f4;
}

.order-goods .item:last-child{
    border-bottom: none;
}

.order-goods .item .img{
    height: 145.83rpx;
    width: 145.83rpx;
    background: #f4f4f4;
}

.order-goods .item .img image{
    height: 145.83rpx;
    width: 145.83rpx;
}

.order-goods .item .info{
    flex: 1;
    height: 145.83rpx;
    margin-left: 20rpx;
}

.order-goods .item .t{
    margin-top: 8rpx;
    height: 33rpx;
    line-height: 33rpx;
    margin-bottom: 10.5rpx;
}

.order-goods .item .t .name{
    display: block;
    float: left;
    height: 33rpx;
    line-height: 33rpx;
    color: #333;
    font-size: 30rpx;
}

.order-goods .item .t .number{
    display: block;
    float: right;
    height: 33rpx;
    text-align: right;
    line-height: 33rpx;
    color: #333;
    font-size: 30rpx;
}

.order-goods .item .attr{
    height: 29rpx;
    line-height: 29rpx;
    color: #666;
    margin-bottom: 25rpx;
    font-size: 25rpx;
}

.order-goods .item .price{
    height: 30rpx;
    line-height: 30rpx;
    color: #333;
    font-size: 30rpx;
}

.order-bottom{
    margin-top: 20rpx;
    padding-left: 31.25rpx;
    height: auto;
    overflow: hidden;
    background: #fff;
    width: 100%;
}

.order-bottom .address{
    height: 128rpx;
    padding-top: 25rpx;
    border-bottom: 1px solid #f4f4f4;
}

.order-bottom .address .t{
    height: 35rpx;
    line-height: 35rpx;
    margin-bottom: 7.5rpx;
}

.order-bottom .address .name{
    display: inline-block;
    height: 35rpx;
    width: 140rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .address .mobile{
    display: inline-block;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .address .b{
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .total{
    height: 106rpx;
    padding-top: 20rpx;
    border-bottom: 1px solid #f4f4f4;
}

.order-bottom .total .t{
    height: 25rpx;
    line-height: 25rpx;
    margin-bottom: 7.5rpx;
    display: flex;
}

.order-bottom .total .label{
    width: 140rpx;
    display: inline-block;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .total .txt{
    flex: 1;
    display: inline-block;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .pay-fee{
    height: 81rpx;
    line-height: 81rpx;
}

.order-bottom .pay-fee .label{
    display: inline-block;
    width: 140rpx;
    color: #b4282d;
}

.order-bottom .pay-fee .txt{
    display: inline-block;
    width: 140rpx;
    color: #b4282d;
}
</style>
