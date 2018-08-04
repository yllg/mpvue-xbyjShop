<template >
<scroll-view class="container">
  <scroll-view class="content">
    <div>
      <wxParse :content="topicDetailHTMLstr" />
    </div>
  </scroll-view>
  <view class="topic-goods">
  </view>
  <scroll-view class="comments">
    <view class="h">
      <text class="t">精选留言</text>
      <img @click="postComment" class="i" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/comment-add-2aca147c3f.png"/>
    </view>
     <view class="has-comments" v-if="commentList.length">
      <view class="b">
        <view class="item" v-for="item of commentList" :key="item.id">
          <view class="info">
            <view class="user">
              <img class="avatar" :src="item.user_info.avatar"/>
              <text class="nickname">{{item.user_info.nickname}}</text>
            </view>
            <view class="time">{{item.add_time}}</view>
          </view>
          <view class="comment">
            {{item.content}}
          </view>
        </view>
      </view>
      <view class="load" v-if="commentCount > 5">
        <navigator :url="'/pages/topic/topicComment?valueId=' + topic.id + '&typeId=1'">查看更多</navigator>
      </view>
    </view>
    <view class="no-comments" v-if="commentList.length <= 0">
        <view class="b" @click="postComment">
            <img class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/no-comment-560f87660a.png"/>
            <text class="txt">期待您的留言</text>
        </view>
    </view>
  </scroll-view>
  <scroll-view class="rec-box">
    <view class="h">
      <text class="txt">专题推荐</text>
    </view>
    <view class="b">
      <navigator class="item" v-for="item of topicList" :key="item.id" :url="'../topic/topicDetail?id=' + item.id">
        <img class="img" :src="item.scene_pic_url"/>
        <text class="title">{{item.title}}</text>
      </navigator>
    </view>
  </scroll-view>
</scroll-view>
</template>

<script>
import api from '@/utils/api';
import wxParse from 'mpvue-wxparse'

export default {
  components: {
    wxParse
  },
  data () {
    return {
      id: 0,
      topic: {},
      topicList: [],
      commentCount: 0,
      commentList: [],
      topicDetailHTMLstr: ''
    }
  },
  // 获取评论数据，提交新评论后手动刷新
  onLoad () {
    if (this.$route.query.id) {
      this.id = parseInt(this.$route.query.id);
    }
    this.getCommentList();
  },
  async mounted () {
    await Promise.all([
      this.getTopicDetail(),
      this.TopicRelated()
    ]);
  },
  methods: {
    // 获取主题详情，
    async getTopicDetail () {
      const res = await api.getTopicDetail({ id: this.id });
      // console.log('专题详情，请求结果', res);
      if (res.errno === 0) {
        this.topic = res.data;
        this.topicDetailHTMLstr = res.data.content;
      }
    },
    // 获取主题相关推荐
    async TopicRelated () {
      const res = await api.TopicRelated({ id: this.id });
      // console.log('专题相关推荐，请求结果', res);
      if (res.errno === 0) {
        this.topicList = res.data;
      }
    },
    // 获取评论数据
    async getCommentList () {
      const res = await api.getCommentList({ valueId: this.id, typeId: 1, size: 5 });
      // console.log('评论数据，请求结果', res);
      if (res.errno === 0) {
        this.commentList = res.data.data;
        this.commentCount = res.data.count;
      }
    },
    // 进入“提交评论”页
    async postComment () {
      this.$router.push('/pages/comment/commentPost?valueId=' + this.id + '&typeId=1');
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/topic/topicDetail'
    }
  }
}
</script>

<style scoped>

@import "../../utils/wxParse/wxParse.wxss";
.content{
    width: 100%;
    height: auto;
    font-size: 0;
}

.content image{
    display: inline-block;
    width: 100%;
}

.comments{
    width: 100%;
    height: auto;
    padding-left:30rpx;
    background: #fff;
    margin-top: 20rpx;
}

.comments .h{
    height: 93rpx;
    line-height: 93rpx;
    width: 680rpx;
    padding-right: 30rpx;
    border-bottom: 1px solid #d9d9d9;
}

.comments .h .t{
    display: block;
    float: left;
    width: 50%;
    font-size: 29rpx;
    color: #333;
}

.comments .h .i{
    display: block;
    float: right;
    margin-top: 30rpx;
    width: 33rpx;
    height: 33rpx;
}

.comments .b{
    height: auto;
    width: 680rpx;
}

.comments .item{
    height: auto;
    width: 720rpx;
    overflow: hidden;
    border-bottom: 1px solid #d9d9d9;
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

.comments .user .avatar{
    display: block;
    float: left;
    width: 67rpx;
    height: 67rpx;
    margin-right: 17rpx;
    border-radius: 50%;
}

.comments .user .nickname{
    display: block;
    width: auto;
    float: left;
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
    margin-bottom: 30rpx;
    font-size: 29rpx;
    color: #333;
}

.comments .load{
    width: 720rpx;
    height: 108rpx;
    line-height: 108rpx;
    text-align: center;
    font-size: 38.5rpx;
}

.no-comments{
    height: 297rpx;
}

.no-comments .txt{
    height: 43rpx;
    line-height: 43rpx;
    display: block;
    width: 100%;
    text-align: center;
    font-size: 29rpx;
    color: #7f7f7f;
}

.no-comments .icon{
    margin: 48rpx auto 18rpx auto;
    height: 130rpx;
    display: block;
    width: 115rpx;
}


.rec-box{
    width: 690rpx;
    height: auto;
    margin: 0 30rpx;
}

.rec-box .h{
    position: relative;
    width: 690rpx;
    height: 96rpx;
    /*border-bottom: 1px solid #d0d0d0;*/
    margin-bottom: 32rpx;
}

.rec-box .h .txt{
    display: inline-block;
    position: absolute;
    background: #f4f4f4;
    top: 59rpx;
    left: 200rpx;
    width: 290rpx;
    height: 45rpx;
    line-height: 45rpx;
    font-size: 30rpx;
    color: #999;
    text-align: center;
}

.rec-box .b .item{
    width: 690rpx;
    height: 397rpx;
    padding: 24rpx 24rpx 30rpx 24rpx;
    background: #fff;
    margin-bottom: 30rpx;
}

.rec-box .b .item .img{
    height: 278rpx;
    width: 642rpx;
}

.rec-box .b .item .title{
    display: block;
    margin-top: 30rpx;
    height: 30rpx;
    width: 642rpx;
    font-size: 28rpx;
}

</style>
