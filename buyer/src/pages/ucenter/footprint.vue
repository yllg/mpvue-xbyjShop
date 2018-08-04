<template >
<view class="container">
  <view class="footprint">
    <view class="day-item" v-for="(item, index) of footprintList" :key="index">
      <view class="day-hd">{{item[0].add_time}}</view>
      <view class="day-list">
        <view class="item" :data-footprint="iitem" @touchstart="touchStart" @touchend="touchEnd" @click="deleteItem"
          v-for="(iitem, iindex) of item" :key="iitem.id" :data-index="iindex">
          <image class="img" :src="iitem.list_pic_url"/>
          <view class="info">
            <view class="name">{{iitem.name}}</view>
            <view class="subtitle">{{iitem.goods_brief}}</view>
            <view class="price">￥{{iitem.retail_price}}</view>
          </view>
        </view>
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
      footprintList: []
    }
  },
  async mounted () {
    await Promise.all([
      this.getFootprintList()
    ])
  },
  methods: {
    // 获取我的收藏信息
    async getFootprintList () {
      const res = await api.getFootprintList();
      // console.log('我的足迹,请求结果', res);
      if (res.errno === 0) {
        this.footprintList = res.data.data;
      }
    },
    // 长按删除，点击进入商品详情
    async deleteItem (event) {
      let footprint = event.currentTarget.dataset.footprint;
      // 触摸时间距离页面打开的毫秒数
      var touchTime = this.touch_end - this.touch_start;
      // console.log(touchTime);
      // 如果按下时间大于350为长按
      if (touchTime > 350) {
        var that = this;
        wx.showModal({
          title: '',
          content: '删除所选足迹？',
          success: async function (res) {
            // console.log('确定删除所选足迹', res);
            if (res.confirm) {
              const res = await api.FootprintDelete({ footprintId: footprint.id });
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getFootprintList();
              }
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../goods/goods?id=' + footprint.goods_id
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
      path: '/pages/ucenter/footprint'
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

.footprint{
   height: auto;
  overflow: hidden;
  width: 100%;
  border-top: 1px solid #e1e1e1;
}

.day-item{
  height: auto;
  overflow: hidden;
  width: 100%;
  margin-bottom: 20rpx;
}

.day-hd{
  height: 94rpx;
  width: 100%;
  line-height: 94rpx;
  background: #fff;
  padding-left: 30rpx;
  color: #333;
  font-size: 28rpx;
}

.day-list{
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
