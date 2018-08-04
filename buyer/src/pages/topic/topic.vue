<template >
<view class="container">
    <scroll-view class="topic-list" scroll-y="true" :scroll-top="scrollTop">
        <navigator class="item" v-for="item of topicList" :key="item.id" :url="'../topic/topicDetail?id=' + item.id">
            <img class="img" :src="item.scene_pic_url"/>
            <view class="info">
                <text class="title">{{item.title}}</text>
                <text class="desc">{{item.subtitle}}</text>
                <text class="price">{{item.price_info}}元起</text>
            </view>
        </navigator>
        <view class="page" v-if="showPage">
            <view :class="page <= 1 ? 'disabled prev' : 'prev'" @click="prevPage">上一页</view>
            <view :class="(count / size) < page +1 ? 'disabled next' : 'next'" @click="nextPage">下一页</view>
        </view>
    </scroll-view>
</view>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      topicList: [],
      page: 1,
      size: 10,
      count: 0,
      scrollTop: 0,
      showPage: false
    }
  },
  async mounted () {
    await Promise.all([
      this.getTopicList()
    ])
  },

  methods: {
    // 获取专题信息
    async getTopicList () {
      this.scrollTop = 0;
      this.showPage = false;
      this.topicList = [];
      const res = await api.getTopicList({ page: this.page, size: this.size });
      // console.log('专题，请求结果', res);
      if (res.errno === 0) {
        this.scrollTop = 0;
        this.topicList = res.data.data;
        this.showPage = true;
        this.count = res.data.count;
      }
    },
    // 上一页
    prevPage () {
      if (this.page <= 1) {
        return false;
      }
      this.page = parseInt(this.page) - 1;
      this.getTopicList();
    },
    // 下一页
    nextPage () {
      if (this.page + 1 > this.count / this.size) {
        return true;
      }
      this.page = parseInt(this.page) + 1;
      this.getTopicList();
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/topic/topic'
    }
  }
}
</script>

<style scoped>
page ,.container{
   width: 750rpx;
    height: 100%;
    overflow: hidden;
    background: #f4f4f4;
}
.topic-list{
    width: 750rpx;
    height: 100%;
    overflow: hidden;
    background: #f4f4f4;
}

.topic-list .item{
    width: 100%;
    height: 625rpx;
    overflow: hidden;
    background: #fff;
    margin-bottom: 20rpx;
}

.topic-list .img{
    width: 100%;
    height: 415rpx;
}

.topic-list .info{
    width: 100%;
    height: 210rpx;
    overflow: hidden;
}

.topic-list .title{
    display: block;
    text-align: center;
    width: 100%;
    height: 33rpx;
    line-height: 35rpx;
    color: #333;
    overflow: hidden;
    font-size: 35rpx;
    margin-top: 30rpx;
}

.topic-list .desc{
    display: block;
    text-align: center;
    position: relative;
    width: auto;
    height: 24rpx;
    line-height: 24rpx;
    overflow: hidden;
    color: #999;
    font-size: 24rpx;
    margin-top: 16rpx;
    margin-bottom: 30rpx;
}

.topic-list .price{
    display: block;
    text-align: center;
    width: 100%;
    height: 27rpx;
    line-height: 27rpx;
    overflow: hidden;
    color: #b4282d;
    font-size: 27rpx;
}


.page{
    width: 750rpx;
    height: 108rpx;
    background: #fff;
    margin-bottom: 20rpx;
}

.page view{
    height: 108rpx;
    width: 49%;
    float: left;
    font-size: 29rpx;
    color: #333;
    text-align: center;
    line-height: 108rpx;
}

.page .prev{
    border-right: 1px solid #D9D9D9;
}

.page .disabled{
    color: #ccc;
}
</style>
