<template >
<view class="container">
  <picker @change="bindPickerChange" :value="index" :range="array">
    <view class="picker">
      <view class="fb-type">
        <view class="type-label">{{array[index]}}</view>
        <image class="type-icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/pickerArrow-a8b918f05f.png"/>
      </view>
    </view>
  </picker>
  <view class="fb-body">
    <textarea class="content" placeholder="对我们网站、商品、服务，你还有什么建议吗？你还希望在严选上买到什么？请告诉我们..." />
    <view class="text-count">0/500</view>
  </view>
  <view class="fb-mobile">
    <view class="label">手机号码</view>
    <view class="mobile-box">
      <input class="mobile" placeholder="方便我们与你联系" />
      <image class="clear-icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/clear-fb-dd9d604f86.png"/>
    </view>
  </view>
  <button class="fb-btn">提交</button>
</view>
</template>

<script>
// import api from '@/utils/api'
// import wx from 'wx'

export default {
  data () {
    return {
      array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
      index: 0
    }
  },
  async mounted () {
    // await Promise.all([
    //   this.getAddressList()
    // ])
  },
  methods: {
    // 监听pick的修改
    bindPickerChange (e) {
      // console.log('监听pick变化', e);
      this.index = e.target.value;
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/ucenter/feedback'
    }
  }
}
</script>

<style scoped>
page{
    background: #f4f4f4;
    min-height: 100%;
}

picker{
  width:92%;
  margin-left:-55rpx;
}

.container{
    background: #f4f4f4;
    min-height: 100%;
    padding-top: 30rpx;
}

.fb-type{
  height: 104rpx;
  width: 100%;
  background: #fff;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.fb-type .type-label{
  height: 36rpx;
  flex: 1;
  color: #333;
  font-size: 28rpx;
}

.fb-type .type-icon{
  height: 36rpx;
  width: 36rpx;
}

.fb-body{
  width: 92%;
  background: #fff;
  height: 374rpx;
  padding: 18rpx 30rpx 64rpx 30rpx;
}

.fb-body .content{
  width: 100%;
  height: 100%;
  color: #333;
  line-height: 40rpx;
  font-size: 28rpx;
}

.fb-body .text-count{
  padding-top: 17rpx;
  line-height: 30rpx;
  float: right;
  color: #666;
  font-size: 24rpx;
}

.fb-mobile{
  height: 162rpx;
  width: 100%;
}

.fb-mobile .label{
  height: 58rpx;
  width: 100%;
  padding-top: 14rpx;
  padding-bottom: 11rpx;
  color: #7f7f7f;
  font-size: 24rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  line-height: 58rpx;
}

.fb-mobile .mobile-box{
  height: 104rpx;
  width: 100%;
  color: #333;
  padding-left: 30rpx;
  padding-right: 30rpx;
  font-size: 24rpx;
  background: #fff;
  position: relative;
}

.fb-mobile .mobile{
  position: absolute;
  top: 27rpx;
  left: 30rpx;
  height: 50rpx;
  width: 100%;
  color: #333;
  line-height: 50rpx;
  font-size: 24rpx;
}

.clear-icon{
  position: absolute;
  top: 43rpx;
  right: 30rpx;
  width: 28rpx;
  height: 28rpx;
}

.fb-btn{
  width: 100%;
  height: 98rpx;
  line-height: 98rpx;
  background: #b4282d;
  position: fixed;
  bottom: 0;
  left: 0;
  border-radius: 0;
  color: #fff;
  font-size: 28rpx;
}
</style>
