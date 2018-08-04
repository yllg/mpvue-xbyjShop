<template >
<view class="container">
    <view class="brand-list" >
        <navigator
            :url="'../brand/brandDetail?id=' + item.id"
            class="item" v-for="(item, index) of brandList" :key="index">
            <view class="img-bg">
                <img :src="item.app_list_pic_url" background-size="cover"/>
            </view>
            <view class="txt-box">
                <view class="line">
                    <text class="name" >{{item.name}}</text>
                    <text class="s">|</text>
                    <text class="price">{{item.floor_price}}元起</text>
                </view>
            </view>
        </navigator >
    </view>
</view>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      brandList: [],
      page: 1,
      size: 10,
      totalPages: 1
    }
  },
  async mounted () {
    await Promise.all([
      this.getBrandList()
    ])
  },

  methods: {
    async getBrandList () {
      const res = await api.getBrandList({ page: this.page, size: this.size });
      // console.log('品牌列表，请求结果', res);
      if (res.errno === 0) {
        // 品牌信息合并叠加
        this.brandList = this.brandList.concat(res.data.data);
        // 总页码，47条/10 共5页
        this.totalPages = res.data.totalPages;
      }
    }
  },

  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/brand/brand'
    }
  },

  // 页面触底，请求新的数据
  onReachBottom () {
    if (this.totalPages > this.page) {
      this.page = this.page + 1;
    } else {
      return false;
    }
    // 请求数据
    this.getBrandList();
  }
}
</script>

<style>
.brand-list .item{
    display: block;
    width: 750rpx;
    height: 416rpx;
    position: relative;
    margin-bottom: 4rpx;
}

.brand-list .item .img-bg{
    position: absolute;
    left:0;
    top:0;
    z-index: 0;
    width: 750rpx;
    height: 417rpx;
    overflow: hidden;
}

.brand-list .item .img-bg image{
    width: 750rpx;
    height: 416rpx;
}

.brand-list .item .txt-box{
    position: absolute;
    left:0;
    top:0;
    display: table;
    z-index: 0;
    width: 750rpx;
    height: 417rpx;
}

.brand-list .item .line{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    height: 63rpx;
    line-height: 63rpx;
}

.brand-list .item .line text{
    font-size: 35rpx;
    font-weight: 700;
    text-shadow: 1rpx 1rpx rgba(0,0,0,.32);
    color: #fff;
}

.brand-list .item .line .s{
    padding: 0 10rpx;
    font-size: 40rpx;
}
</style>
