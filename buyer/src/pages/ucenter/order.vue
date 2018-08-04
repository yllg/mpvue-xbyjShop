<template >
<view class="container">
    <view class="orders">
        <navigator :url="'./orderDetail?id=' + item.id" class="order" v-for="(item, index) of orderList" :key="item.id" :data-index="index">
            <view class="h">
                <view class="l">订单编号：{{item.order_sn}}</view>
                <view class="r">{{item.order_status_text}}</view>
            </view>
            <view class="goods" v-for="(iitem, iindex) of item.goodsList" :key="iitem.id" :data-index="iindex">
                <view class="img">
                    <image :src="iitem.list_pic_url"/>
                </view>
                <view class="info">
                    <text class="name">{{iitem.goods_name}}</text>
                    <text class="number">共{{iitem.number}}件商品</text>
                </view>
                <view class="status"></view>
            </view>
            <view class="b">
                <view class="l">实付：￥{{item.actual_price}}</view>
                <view class="r">
                    <button class="btn" :data-order-index="index" @click="payOrder" v-if="item.handleOption.pay">去付款</button>
                </view>
            </view>
        </navigator>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      orderList: []
    }
  },
  async mounted () {
    await Promise.all([
      this.getOrderList()
    ])
  },
  methods: {
    // 获取订单数据
    async getOrderList () {
      const res = await api.getOrderList();
      // console.log('我的订单,请求结果', res);
      if (res.errno === 0) {
        this.orderList = res.data.data;
      }
    },
    // 点击“去付款”
    payOrder (event) {
      let currentOrder = this.orderList[event.target.dataset.orderIndex];
      // 给pay页面传两个参数orderId,actualPrice
      // console.log('订单信息', currentOrder);
      wx.redirectTo({
        url: '../pay/pay?orderId=' + currentOrder.id + '&actualPrice=' + currentOrder.actual_price
      })
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/ucenter/order'
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

.orders{
    height: auto;
    width: 100%;
    overflow: hidden;
}

.order{
    margin-top: 20rpx;
    background: #fff;
}

.order .h{
    height: 83.3rpx;
    line-height: 83.3rpx;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    border-bottom: 1px solid #f4f4f4;
    font-size: 30rpx;
    color: #333;
}

.order .h .l{
    float: left;
}

.order .h .r{
    float: right;
    color: #b4282d;
    font-size: 24rpx;
}

.order .goods{
    display: flex;
    align-items: center;
    height: 199rpx;
    margin-left: 31.25rpx;
}

.order .goods .img{
    height:145.83rpx;
    width:145.83rpx;
    background: #f4f4f4;
}

.order .goods .img image{
    height:145.83rpx;
    width:145.83rpx;
}

.order .goods .info{
    height: 145.83rpx;
    flex: 1;
    padding-left: 20rpx;
}

.order .goods .name{
    margin-top: 30rpx;
    display: block;
    height: 44rpx;
    line-height: 44rpx;
    color: #333;
    font-size: 30rpx;
}

.order .goods .number{
    display: block;
    height: 37rpx;
    line-height: 37rpx;
    color: #666;
    font-size: 25rpx;
}

.order .goods .status{
    width:105rpx;
    color: #b4282d;
    font-size: 25rpx;
}

.order .b{
    height: 103rpx;
    line-height: 103rpx;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    border-top: 1px solid #f4f4f4;
    font-size: 30rpx;
    color: #333;
}

.order .b .l{
    float: left;
}

.order .b .r{
    float: right;
}

.order .b .btn{
    margin-top: 19rpx;
    height: 64.5rpx;
    line-height: 64.5rpx;
    text-align: center;
    padding: 0 20rpx;
    border-radius: 5rpx;
    font-size: 28rpx;
    color: #fff;
    background: #b4282d;
}
</style>
