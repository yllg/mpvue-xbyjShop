<template >
<view class="container">
    <view class="address-box">
        <view class="address-item" @click="selectAddress" v-if="checkedAddress.id > 0">
            <view class="l">
                <text class="name">{{checkedAddress.name}}</text>
                <text class="default" v-if="checkedAddress.is_default === 1">默认</text>
            </view>
            <view class="m">
                <text class="mobile">{{checkedAddress.mobile}}</text>
                <text class="address">{{checkedAddress.full_region + checkedAddress.address}}</text>
            </view>
            <view class="r">
                <image src="/static/images/address_right.png"/>
            </view>
        </view>
        <view class="address-item address-empty" @click="addAddress" v-if="checkedAddress.id <= 0">
            <view class="m">
               还没有收货地址，去添加
            </view>
            <view class="r">
                <image src="/static/images/address_right.png"/>
            </view>
        </view>
    </view>

    <view class="coupon-box">
        <view class="coupon-item">
            <view class="l">
                <text class="name">请选择优惠券</text>
                <text class="txt">{{couponList.length}}张</text>
            </view>
            <view class="r">
                <image src="/static/images/address_right.png"/>
            </view>
        </view>
    </view>

    <view class="order-box">
        <view class="order-item">
            <view class="l">
                <text class="name">商品合计</text>
            </view>
            <view class="r">
                <text class="txt">￥{{goodsTotalPrice}}</text>
            </view>
        </view>
        <view class="order-item">
            <view class="l">
                <text class="name">运费</text>
            </view>
            <view class="r">
                <text class="txt">￥{{freightPrice}}</text>
            </view>
        </view>
        <view class="order-item no-border">
            <view class="l">
                <text class="name">优惠券</text>
            </view>
            <view class="r">
                <text class="txt">-￥{{couponPrice}}</text>
            </view>
        </view>
    </view>

    <view class="goods-items">
        <view class="item" v-for="(item, index) of checkedGoodsList" :key="item.id" :data-index="index">
            <view class="img">
                <image :src="item.list_pic_url"/>
            </view>
            <view class="info">
                <view class="t">
                    <text class="name">{{item.goods_name}}</text>
                    <text class="number">x{{item.number}}</text>
                </view>
                <view class="m">{{item.goods_specifition_name_value}}</view>
                <view class="b">￥{{item.retail_price}}</view>
            </view>
        </view>
    </view>

    <view class="order-total">
        <view class="l">实付：￥{{actualPrice}}</view>
        <view class="r" @click="submitOrder">去付款</view>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import util from '@/utils/util'
import pay from '@/services/pay'

export default {
  data () {
    return {
      checkedGoodsList: [],
      checkedAddress: {},
      checkedCoupon: [],
      couponList: [],
      goodsTotalPrice: 0.00, // 商品总价
      freightPrice: 0.00, // 快递费
      couponPrice: 0.00, // 优惠券的价格
      orderTotalPrice: 0.00, // 订单总价
      actualPrice: 0.00, // 实际需要支付的总价
      addressId: 0, // 地址ID
      couponId: 0 // 优惠卷ID
    }
  },
  async mounted () {
    try {
      // 从缓存中取addressId和couponId，默认都是0
      var addressId = wx.getStorageSync('addressId');
      // console.log('缓存的地址Id', addressId);
      if (addressId) {
        this.addressId = addressId;
      }
      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.couponId = couponId;
      }
    } catch (e) {
      // Do something when catch error
    }
    await Promise.all([
      this.getCheckoutInfo()
    ])
  },
  methods: {
    // 获取订单信息
    async getCheckoutInfo () {
      const res = await api.CartCheckout({ addressId: this.addressId, couponId: this.couponId });
      // console.log('订单详情,请求结果', res);
      if (res.errno === 0) {
        this.checkedGoodsList = res.data.checkedGoodsList;
        this.checkedAddress = res.data.checkedAddress;
        this.actualPrice = res.data.actualPrice;
        this.checkedCoupon = res.data.checkedCoupon;
        this.couponList = res.data.couponList;
        this.couponPrice = res.data.couponPrice;
        this.freightPrice = res.data.freightPrice;
        this.goodsTotalPrice = res.data.goodsTotalPrice;
        this.orderTotalPrice = res.data.orderTotalPrice;
      }
    },
    // 选择收获地址
    selectAddress () {
      wx.navigateTo({
        url: '../shopping/address'
      })
    },
    // 添加收获地址
    addAddress () {
      wx.navigateTo({
        url: '../shopping/addressAdd'
      })
    },
    // 点击“去付款”
    async submitOrder () {
      if (this.addressId <= 0) {
        util.showErrorToast('请选择收货地址');
        return false;
      }
      // 请求后台，更新数据库的order表，清空购物车表等
      const res = await api.OrderSubmit({ addressId: this.addressId, couponId: this.couponId });
      // console.log('提交订单,请求结果', res);
      // 数据库操作成功，再调用wx的支付服务
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '../pay/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '../pay/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/shopping/checkout'
    }
  }
}
</script>

<style scoped>
page{
    height: 100%;
    background: #f4f4f4;
}

.address-box{
    width: 100%;
    height: 166.55rpx;
    background: url('http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-bg-bd30f2bfeb.png') 0 0 repeat-x;
    background-size: 62.5rpx 10.5rpx;
    margin-bottom: 20rpx;
    padding-top: 10.5rpx;
}

.address-item{
    display: flex;
    height: 155.55rpx;
    background: #fff;
    padding: 41.6rpx 0 41.6rpx 31.25rpx;
}

.address-item.address-empty{
  line-height: 75rpx;
  text-align: center;
}

.address-box .l{
    width: 125rpx;
    height: 100%;
}

.address-box .l .name{
    margin-left: 6.25rpx;
    margin-top: -7.25rpx;
    display: block;
    width: 125rpx;
    height: 43rpx;
    line-height: 43rpx;
    font-size: 30rpx;
    color: #333;
    margin-bottom: 5rpx;

}

.address-box .l .default{
    margin-left: 6.25rpx;
    display: block;
    width: 62rpx;
    height: 33rpx;
    border-radius: 5rpx;
    border: 1px solid #b4282d;
    font-size: 20.5rpx;
    text-align: center;
    line-height: 29rpx;
    color: #b4282d;
}

.address-box .m{
    flex: 1;
    height: 72.25rpx;
    color: #999;
}

.address-box .mobile{
    display: block;
    height: 29rpx;
    line-height: 29rpx;
    margin-bottom: 6.25rpx;
    font-size: 30rpx;
    color:#333;
}

.address-box .address{
    display: block;
    height: 37.5rpx;
    line-height: 37.5rpx;
    font-size: 25rpx;
    color:#666;
}

.address-box .r{
    width: 77rpx;
    height: 77rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.address-box .r image{
    width: 52.078rpx;
    height: 52.078rpx;
}

.coupon-box{
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
}

.coupon-box .coupon-item{
    width: 96%;
    height: 108.3rpx;
    overflow: hidden;
    background: #fff;
    display: flex;
    padding-left: 31.25rpx;
}

.coupon-box .l{
    flex: 1;
    height: 43rpx;
    line-height: 43rpx;
    padding-top: 35rpx;
}

.coupon-box .l .name{
    float: left;
    font-size: 30rpx;
    color: #666;
}

.coupon-box .l .txt{
    float: right;
    font-size: 30rpx;
    color: #666;
}

.coupon-box .r{
    margin-top: 15.5rpx;
    width: 77rpx;
    height: 77rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.coupon-box .r image{
    width: 52.078rpx;
    height: 52.078rpx;
}

.order-box{
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
}

.order-box .order-item{
    height: 104.3rpx;
    overflow: hidden;
    background: #fff;
    display: flex;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    padding-top: 26rpx;
    border-bottom: 1px solid #d9d9d9;
}

.order-box .order-item .l{
    float: left;
    height: 52rpx;
    width: 50%;
    line-height: 52rpx;
    overflow: hidden;
}

.order-box .order-item .r{
    float: right;
    text-align: right;
    width: 50%;
    height: 52rpx;
    line-height: 52rpx;
    overflow: hidden;
}

.order-box .order-item.no-border{
    border-bottom: none;
}

.goods-items{
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
    padding-left: 31.25rpx;
    margin-bottom: 120rpx;
}

.goods-items .item{
    height: 192rpx;
    padding-right: 31.25rpx;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.15);
}

.goods-items .item.no-border{
    border-bottom: none;
}


.goods-items .item:last-child{
    border-bottom: none;
}

.goods-items .img{
    height: 145.83rpx;
    width: 145.83rpx;
    background-color: #f4f4f4;
    margin-right: 20rpx;
}

.goods-items .img image{
    height: 145.83rpx;
    width: 145.83rpx;
}

.goods-items .info{
    flex: 1;
    height: 145.83rpx;
    padding-top: 5rpx;
}

.goods-items .t{
    height:  33rpx;
    line-height: 33rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
    font-size: 30rpx;
    color: #333;
}

.goods-items .t .name{
    display: block;
    float: left;
}

.goods-items .t .number{
    display: block;
    float: right;
    text-align: right;
    margin-right: 30rpx;
}

.goods-items .m {
    height:  29rpx;
    overflow: hidden;
    line-height: 29rpx;
    margin-bottom: 25rpx;
    font-size: 25rpx;
    color: #666;
}

.goods-items .b {
    height:  41rpx;
    overflow: hidden;
    line-height: 41rpx;
    font-size: 30rpx;
    color: #333;
}

.order-total{
    position: fixed;
    left:0;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    display: flex;
}

.order-total .l{
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    color: #b4282d;
    background: #fff;
    font-size: 33rpx;
    padding-left: 31.25rpx;
    border-top: 1rpx solid rgba(0,0,0,0.2);
    border-bottom: 1rpx solid rgba(0,0,0,0.2);
}

.order-total .r{
    width: 233rpx;
    height: 100rpx;
    background: #b4282d;
    border: 1px solid #b4282d;
    line-height: 100rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
}
</style>
