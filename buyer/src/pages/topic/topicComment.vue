<template >
<view class="comments">
  <view class="b">
    <view class="item" v-for="(item, index) of comments" :key="item.id" :data-index="index">
      <view class="info">
        <view class="user">
          <img :src="item.user_info.avatar"/>
          <text>{{item.user_info.nickname}}</text>
        </view>
        <view class="time">{{item.add_time}}</view>
      </view>
      <view class="comment">{{item.content}}</view>
      <view class="imgs" v-if="item.pic_list.length">
        <img class="img" v-for="(iitem, iindex) of item.pic_list" :key="iitem.id" :data-index="iindex" :src="iitem.pic_url"/>
      </view>
      <view class="customer-service" v-if="item.commentReplyVO">
        <text class="u">小选回复：</text>
        <text class="c">{{item.commentReplyVO.replyContent}}</text>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import api from '@/utils/api';

export default {
  data () {
    return {
      comments: [],
      allCommentList: [],
      picCommentList: [],
      typeId: 0,
      valueId: 0,
      showType: 0,
      allCount: 0,
      hasPicCount: 0,
      allPage: 1,
      picPage: 1,
      size: 20
    }
  },
  async mounted () {
    if (this.$route.query.typeId && this.$route.query.valueId) {
      this.typeId = parseInt(this.$route.query.typeId);
      this.valueId = parseInt(this.$route.query.valueId);
    }
    await Promise.all([
      this.getCommentCount(),
      this.getCommentList()
    ]);
  },

  methods: {
    // 获取评论数量
    async getCommentCount () {
      const res = await api.getCommentCount({ valueId: this.valueId, typeId: this.typeId });
      // console.log('评论数量，请求结果', res);
      if (res.errno === 0) {
        this.allCount = res.data.allCount;
        this.hasPicCount = res.data.hasPicCount;
      }
    },
    // 获取评论数据
    async getCommentList () {
      const res = await api.getCommentList({
        valueId: this.valueId,
        typeId: this.typeId,
        size: this.size,
        page: (this.showType === 0 ? this.allPage : this.picPage),
        showType: this.showType
      });
      // console.log('评论数据，请求结果', res);
      if (res.errno === 0) {
        // type为0表示专题评论，为1表示商品评论
        if (this.showType === 0) {
          // this.allCommentList = this.allCommentList.concat(res.data.data);
          this.allPage = res.data.currentPage;
          this.comments = this.allCommentList.concat(res.data.data);
        }
      }
    }
  },
  // 原生方法，触底加载
  onReachBottom: function () {
    // console.log('onPullDownRefresh');
    if (this.showType === 0) {
      if (this.allCount / this.size < this.allPage) {
        return false;
      }
      this.allPage = this.allPage + 1;
    } else {
      if (this.hasPicCount / this.size < this.picPage) {
        return false;
      }
      this.picPage = this.picPage + 1;
    }
    this.getCommentList();
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/topic/topicComment'
    }
  }
}
</script>

<style scoped>
.comments{
    width: 100%;
    height: auto;
    padding-left:30rpx;
    background: #fff;
    margin: 20rpx 0;
}

.comments .b{
    height: auto;
    width: 720rpx;
}

.comments .b.no-h{
    margin-top: 0;
}

.comments .item{
    height: auto;
    width: 720rpx;
    overflow: hidden;
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 25rpx;
}

.comments .info{
    height: 127rpx;
    width: 100%;
    padding: 33rpx 0 27rpx 0;
}

.comments .user{
    float: left;
    width: auto;
    height: 67rpx;
    line-height: 67rpx;
    font-size: 0;
}

.comments .user image{
    float: left;
    width: 67rpx;
    height: 67rpx;
    margin-right: 17rpx;
    border-radius: 50%;
}

.comments .user text{
    display: inline-block;
    width: auto;
    height: 66rpx;
    overflow: hidden;
    font-size: 29rpx;
    line-height: 66rpx;
}

.comments .time{
    display: block;
    float: right;
    width: auto;
    height: 67rpx;
    line-height: 67rpx;
    color: #7f7f7f;
    font-size: 25rpx;
    margin-right: 30rpx;
}

.comments .comment{
    width: 720rpx;
    padding-right: 30rpx;
    line-height: 45.8rpx;
    font-size: 29rpx;
    margin-bottom: 16rpx;
}

.comments .imgs{
    width: 720rpx;
    height: 150rpx;
    margin-bottom: 25rpx;
}

.comments .imgs .img{
    height: 150rpx;
    width: 150rpx;
    margin-right: 28rpx;
}

.comments .customer-service{
    width: 690rpx;
    height: auto;
    overflow: hidden;
    margin-top: 23rpx;
    background: rgba(0,0,0,.03);
    padding: 21rpx;
}


.comments .customer-service .u{
    font-size: 24rpx;
    color: #333;
    line-height: 37.5rpx;
}

.comments .customer-service .c{
    font-size: 24rpx;
    color: #999;
    line-height: 37.5rpx;
}
</style>
