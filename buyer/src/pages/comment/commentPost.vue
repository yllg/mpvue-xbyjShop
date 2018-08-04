<template >
<view class="container">
  <view class="post-comment">
      <view class="input-box">
          <textarea class="content" focus="true" @input="bindInpuntValue" maxlength="140" placeholder="留言经过筛选后，对所有人可见" />
          <text class="count">{{140 - content.length}}</text>
      </view>
      <view class="btns">
          <view class="close" @click="onClose">取消</view>
          <view class="post" @click="onPost">发表</view>
      </view>
  </view>
</view>
</template>

<script>
import api from '@/utils/api';
import util from '@/utils/util';
import wx from 'wx';
import getCurrentPages from 'wxFunction';

export default {
  data () {
    return {
      typeId: 0,
      valueId: 0,
      content: ''
    }
  },
  async mounted () {
    if (this.$route.query.typeId && this.$route.query.valueId) {
      this.typeId = parseInt(this.$route.query.typeId);
      this.valueId = parseInt(this.$route.query.valueId);
    }
  },

  methods: {
    // 监听输入事件
    bindInpuntValue (event) {
      // console.log('监听输入事件', event);
      let value = event.target.value;
      // 判断是否超过140个字符
      if (value && value.length > 140) {
        return false;
      }
      this.content = event.target.value;
    },
    // 提交评论
    async onPost () {
      if (!this.content) {
        util.showErrorToast('请填写评论');
        return false;
      }
      const res = await api.CommentPost({
        valueId: this.valueId,
        typeId: this.typeId,
        content: this.content
      });
      // console.log('提交评论，返回结果', res);
      if (res.errno === 0) {
        wx.showToast({
          title: '评论成功',
          complete: function () {
            // that.$router.go(-1);
            // 刷新专题详情页
            wx.redirectTo({
              url: '/pages/topic/topicDetail',
              success: function (e) {
                // console.log('getCurrentPages的页面栈', getCurrentPages());
                var page = getCurrentPages().pop();
                // console.log('当前page', page);
                if (page === undefined || page === null) return;
                page.onLoad();
              }
            });
          }
        })
      }
    },
    // 返回上一页
    onClose () {
      this.$router.go(-1);
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/comment/commentPost'
    }
  }
}
</script>

<style scoped>
page, .container {
  height: 100%;
  background: #f4f4f4;
}

.post-comment {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  padding: 30rpx;
}

.post-comment .input-box {
  height: 337.5rpx;
  width: 690rpx;
  position: relative;
  /* background: #fff; */
}

.post-comment .input-box .content {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  background: #fff;
  font-size: 29rpx;
  color: #333;
  height: 300rpx;
  width: 650rpx;
  padding: 20rpx;
  margin-left: 30rpx;
}

.post-comment .input-box .count {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  display: block;
  height: 30rpx;
  width: 50rpx;
  font-size: 29rpx;
  color: #999;
}

.post-comment .btns {
  height: 108rpx;
}

.post-comment .close {
  float: left;
  height: 108rpx;
  line-height: 108rpx;
  text-align: left;
  color: #666;
  padding: 0 30rpx;
}

.post-comment .post {
  float: right;
  height: 108rpx;
  line-height: 108rpx;
  text-align: right;
  padding: 0 30rpx;
}

</style>
