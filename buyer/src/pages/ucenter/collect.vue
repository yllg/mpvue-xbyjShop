<template >
<view class="container">
  <view class="collect-list">
    <view class="item" @click="openGoods"  @touchstart="touchStart" @touchend="touchEnd"
      v-for="(item, index) of collectList" :key="item.id" :data-index="index">
      <image class="img" :src="item.list_pic_url"/>
      <view class="info">
        <view class="name">{{item.name}}</view>
        <view class="subtitle">{{item.goods_brief}}</view>
        <view class="price">￥{{item.retail_price}}</view>
      </view>
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
      typeId: 0,
      collectList: []
    }
  },
  async mounted () {
    await Promise.all([
      this.getCollectList()
    ])
  },
  methods: {
    // 获取我的收藏信息
    async getCollectList () {
      const res = await api.getCollectList({ typeId: this.typeId });
      // console.log('我的收藏,请求结果', res);
      if (res.errno === 0) {
        this.collectList = res.data.data;
      }
    },
    // 长按删除，点击进入商品详情
    async openGoods (event) {
      let goodsId = this.collectList[event.currentTarget.dataset.index].value_id;
      // 触摸时间距离页面打开的毫秒数
      var touchTime = this.touch_end - this.touch_start;
      // console.log(touchTime);
      // 如果按下时间大于350为长按
      if (touchTime > 350) {
        var that = this;
        wx.showModal({
          title: '',
          content: '取消收藏？',
          success: async function (res) {
            // console.log('确定取消收藏', res);
            if (res.confirm) {
              const res = await api.CollectAddOrDelete({ typeId: that.typeId, valueId: goodsId });
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getCollectList();
              }
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../goods/goods?id=' + goodsId
        });
      }
    },
    // 按下事件开始
    touchStart (e) {
      this.touch_start = e.timeStamp;
    },
    // 按下事件结束
    touchEnd (e) {
      this.touch_end = e.timeStamp;
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/ucenter/collect'
    }
  }
}
</script>

<style>
page{
    background: #f4f4f4;
    min-height: 100%;
}

.container{
    background: #f4f4f4;
    min-height: 100%;
}

.collect-list{
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #fff;
  padding-left: 30rpx;
  border-top: 1px solid #e1e1e1;
}

.item{
  height: 212rpx;
  width: 720rpx;
  background: #fff;
  padding: 30rpx 30rpx 30rpx 0;
  border-bottom: 1px solid #e1e1e1;
}

.item:last-child{
  border-bottom: 1px solid #fff;
}

.item .img{
  float: left;
  width: 150rpx;
  height: 150rpx;
}

.item .info{
  float: right;
  width: 540rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20rpx;
}

.item .info .name{
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}


.item .info .subtitle{
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #888;
  line-height: 40rpx;
}

.item .info .price{
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}

</style>
