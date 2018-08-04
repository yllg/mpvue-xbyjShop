<template >
<view class="container">
  <view class="profile-info">
    <view v-if="userInfo.avatar">
      <img class="avatar" :src="userInfo.avatar"/>
      <view class="info">
        <text class="name">{{userInfo.nickname}}</text>
      </view>
    </view>
    <view v-else class="goLogin">
      <img class="icon" src="/static/images/ic_menu_me_pressed.png"/>
      <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="goLogin" class="goLoginBtn" >点击，授权登录~</button>
    </view>
  </view>

  <view class="user-menu">
    <view class="item">
      <navigator url="/pages/ucenter/order" class="a">
        <text class="icon order"></text>
        <text class="txt">我的订单</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/coupon" class="a">
        <text class="icon coupon"></text>
        <text class="txt">优惠券</text>
      </navigator>
    </view>
    <view class="item no-border">
      <view class="a">
        <text class="icon gift"></text>
        <text class="txt">礼品卡</text>
      </view>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/collect" class="a">
        <img class="icon" src="/static/images/icon_collect.png"/>
        <text class="txt">我的收藏</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="../ucenter/footprint" class="a">
        <img class="icon" src="/static/images/footprint.png"/>
        <text class="txt">我的足迹</text>
      </navigator>
    </view>
    <view class="item no-border">
      <view class="a">
        <img class="icon" src="/static/images/VIP.png"/>
        <text class="txt">会员福利</text>
      </view>
    </view>
    <view class="item">
      <navigator url="../ucenter/address" class="a">
        <text class="icon address"></text>
        <text class="txt">地址管理</text>
      </navigator>
    </view>
    <view class="item">
      <view class="a">
        <text class="icon security"></text>
        <text class="txt">账号安全</text>
      </view>
    </view>
    <view class="item no-border">
      <view class="a">
        <text class="icon kefu"></text>
        <text class="txt">联系客服</text>
      </view>
    </view>
    <view class="item item-bottom">
      <view class="a">
        <text class="icon help"></text>
        <text class="txt">帮助中心</text>
      </view>
    </view>
    <view class="item item-bottom">
      <navigator url="../ucenter/feedback" class="a">
        <text class="icon feedback"></text>
        <text class="txt">意见反馈</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="../ucenter/express" class="a">
        <img class="icon" src="/static/images/car.png"/>
        <text class="txt">物流查询</text>
      </navigator>
    </view>
  </view>
  <view v-if="userInfo.avatar" class="logout" @click="exitLogin">退出登录</view>
</view>
</template>

<script>
import wx from 'wx';
import getCurrentPages from 'wxFunction';
import user from '@/services/user';
var app = getApp();

export default {
  data () {
    return {
      userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  onShow () {
    // console.log('全局变量', app);
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    // console.log('缓存中的个人信息userInfo', userInfo);
    // console.log('缓存中的个人信息token', token);
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    } else {
      app.globalData.userInfo = null;
      app.globalData.token = null;
    }
    if (app.globalData.userInfo) {
      this.userInfo = app.globalData.userInfo;
    } else {
      this.userInfo = {};
    }
  },

  methods: {
    // 点击登陆
    goLogin () {
      user.loginByWeixin().then(res => {
        this.userInfo = res.data.userInfo;
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.token = res.data.token;
      }).catch((err) => {
        console.log('登陆失败', err)
      });
    },
    // 退出登陆
    exitLogin () {
      wx.showModal({
        title: '',
        confirmColor: '#b4282d',
        content: '退出登录？',
        success: function (res) {
          if (res.confirm) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.switchTab({
              url: '/pages/ucenter/index',
              success: function (e) {
                // console.log('getCurrentPages的页面栈', getCurrentPages());
                var page = getCurrentPages().pop();
                // console.log('当前page', page);
                if (page === undefined || page === null) return;
                page.onShow();
              }
            });
          }
        }
      })
    }
  }
}
</script>

<style scoped>
page{
    height: 100%;
    width: 100%;
    background: #f4f4f4;
}
.container{
    background: #f4f4f4;
    height: auto;
    overflow: hidden;
    width: 100%;
}
.profile-info{
    width: 100%;
    height: 280rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    padding: 0 30.25rpx;
    background: #333;
}

.profile-info .icon{
    position: absolute;
    left: 80rpx;
    top: 83rpx;
    height: 100rpx;
    width: 100rpx;
}

.profile-info .goLogin{
    margin-left: 185rpx;
}

.profile-info .goLoginBtn{
    background-color: #333;
    color: #fff;
}

.profile-info .avatar{
    height: 148rpx;
    width: 148rpx;
    border-radius: 50%;
    margin-left: 60rpx;
}

.profile-info .info{
    flex: 1;
    height: 50rpx;
    margin-left: 70rpx;
}

.profile-info .name{
    display: block;
    height: 45rpx;
    line-height: 45rpx;
    color: #fff;
    font-size: 37.5rpx;
    margin-bottom: 10rpx;
}

.profile-info .level{
    display: block;
    height: 30rpx;
    line-height: 30rpx;
    margin-bottom: 10rpx;
    color: #7f7f7f;
    font-size: 30rpx;
}

.user-menu{
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
}

.user-menu .item{
    float: left;
    width: 33%;
    height: 187.5rpx;
    border-right: 1px solid rgba(0,0,0,.15);
    border-bottom: 1px solid rgba(0,0,0,.15);
    text-align: center;
}

.user-menu .item .a{
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.user-menu .item.no-border {
    border-right: 0;
}

.user-menu .item.item-bottom {
    border-bottom: none;
}

.user-menu .icon{
    margin: 0 auto;
    display: block;
    height: 52.803rpx;
    width: 52.803rpx;
    margin-bottom: 16rpx;
}

.user-menu image {
    opacity: 0.6;
}

.user-menu .icon.order{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -437.5rpx no-repeat;
    background-size: 52.803rpx;
}


.user-menu .icon.coupon{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -62.4997rpx no-repeat;
    background-size: 52.803rpx;
}

.user-menu .icon.gift{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -187.5rpx no-repeat;
    background-size: 52.803rpx;
}

.user-menu .icon.address{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 0 no-repeat;
    background-size: 52.803rpx;
}

.user-menu .icon.security{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -500rpx no-repeat;
    background-size: 52.803rpx;
}

.user-menu .icon.kefu{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -312.5rpx no-repeat;
    background-size: 52.803rpx;
}

.user-menu .icon.help{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -250rpx no-repeat;
    background-size: 52.803rpx;
}

.user-menu .icon.feedback{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/ucenter-sdf6a55ee56-f2c2b9c2f0.png) 0 -125rpx no-repeat;
    background-size: 52.803rpx;
}

.user-menu .txt{
    display: block;
    height: 24rpx;
    width: 100%;
    font-size: 24rpx;
    color:#333;
}

.logout{
    margin-top: 50rpx;
    height: 101rpx;
    width: 100%;
    line-height: 101rpx;
    text-align: center;
    background: #fff;
    color: #ea3732;
    font-size: 30rpx;
}

</style>
