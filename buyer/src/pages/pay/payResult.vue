<template >
<view class="container">
  <view class="pay-result">
    <view class="success" v-if="status == true">
      <view class="msg">付款成功</view>
      <view class="btns">
        <navigator class="btn" url="../ucenter/order" open-type="redirect">查看订单</navigator>
        <navigator class="btn" url="../index/index" open-type="switchTab">继续逛</navigator>
      </view>
    </view>
    <view class="error" v-if="status != true">
      <view class="msg">付款失败</view>
      <view class="tips">
        <view class="p">请在 <text class="time">1小时</text> 内完成付款</view>
        <view class="p">否则订单将会被系统取消</view>
      </view>
      <view class="btns">
        <!-- <navigator class="btn" url="/pages/ucenter/order/order" open-type="redirect">查看订单</navigator> -->
        <view class="btn" @click='redirectToOrderDetail'>查看订单</view>
        <view class="btn" @click='payOrder'>重新付款</view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
// import api from '@/utils/api'
import wx from 'wx'
import pay from '@/services/pay'
import util from '@/utils/util'

export default {
  data () {
    return {
      status: false,
      orderId: 0
    }
  },
  async mounted () {
    if (this.$route.query.status) {
      this.status = this.$route.query.status;
    }
    this.orderId = this.$route.query.orderId || 24;
  },
  methods: {
    // 返回订单详情页
    redirectToOrderDetail () {
      wx.redirectTo({
        url: '../ucenter/orderDetail?id=' + this.orderId
      })
    },
    // 重新付款
    payOrder () {
      pay.payOrder(parseInt(this.orderId)).then(res => {
        this.status = true;
      }).catch(res => {
        util.showErrorToast('支付失败');
      });
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/pay/payResult'
    }
  }
}
</script>

<style scoped>
page {
  min-height: 100%;
  width: 100%;
  background: #fff;
}

.container {
  height: 100%;
  background: #fff;
}

.pay-result {
  background: #fff;
}

.pay-result .msg {
  text-align: center;
  margin: 100rpx auto;
  color: #2bab25;
  font-size: 36rpx;
}

.pay-result .btns {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-result .btn {
  text-align: center;
  height: 80rpx;
  margin: 0 20rpx;
  width: 200rpx;
  line-height: 78rpx;
  border: 1px solid #868686;
  color: #000000;
  border-radius: 5rpx;
}

.pay-result .error .msg {
  color: #b4282d;
  margin-bottom: 60rpx;
}

.pay-result .error .tips {
  color: #7f7f7f;
  margin-bottom: 70rpx;
}

.pay-result .error .tips .p {
  font-size: 24rpx;
  line-height: 42rpx;
  text-align: center;
}

.pay-result .error .tips .p {
  line-height: 42rpx;
  text-align: center;
}
</style>
