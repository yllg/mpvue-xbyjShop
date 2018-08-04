<template >
<view class="container">
    <view class="address-list" v-if="addressList.length">
        <view class="item" v-for="(item, index) of addressList" :key="item.id" @click="addressAddOrUpdate"
          :data-address-id="item.id" :data-index="index">
            <view class="l">
                <view class="name">{{item.name}}</view>
                <view class="default" v-if="item.is_default">默认</view>
            </view>
            <view class="c">
                <view class="mobile">{{item.mobile}}</view>
                <view class="address">{{item.full_region + item.address}}</view>
            </view>
            <view class="r">
                <image @click.stop="deleteAddress" :data-address-id="item.id" class="del" src="/static/images/del-address.png"/>
            </view>
        </view>
    </view>
    <view class="empty-view" v-if="addressList.length <= 0">
      <image class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noAddress-26d570cefa.png"/>
      <text class="text">收货地址在哪里</text>
    </view>
    <view class="add-address"  @click="addressAddOrUpdate" data-address-id="0">新建</view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      addressList: []
    }
  },
  async mounted () {
    await Promise.all([
      this.getAddressList()
    ])
  },
  methods: {
    // 获取地址信息
    async getAddressList () {
      const res = await api.getAddressList();
      // console.log('地址管理,请求结果', res);
      if (res.errno === 0) {
        this.addressList = res.data;
      }
    },
    // 点击修改，或者点击底部“新建”
    addressAddOrUpdate (event) {
      // console.log('点击修改/新建地址', event)
      wx.navigateTo({
        url: '../ucenter/addressAdd?id=' + event.currentTarget.dataset.addressId
      })
    },
    // 点击删除图标
    deleteAddress (event) {
      // console.log('点击删除', event)
      let that = this;
      wx.showModal({
        title: '',
        content: '确定要删除地址？',
        success: async function (res) {
          if (res.confirm) {
            let addressId = event.target.dataset.addressId;
            const res = await api.AddressDelete({ id: addressId });
            // console.log('删除地址,请求结果', res);
            if (res.errno === 0) {
              that.getAddressList();
            }
          }
        }
      })
      return false;
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/ucenter/address'
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
  height: 100%;
  width: 100%;
}

.address-list{
    padding-left: 31.25rpx;
    background: #fff url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-bg-bd30f2bfeb.png) 0 0 repeat-x;
    background-size: auto 10.5rpx;
    margin-bottom: 90rpx;
    width: 96%;
}

.address-list .item{
    height: 156.55rpx;
    align-items: center;
    display: flex;
    border-bottom: 1rpx solid #DCD9D9;
}

.address-list .l{
    width: 125rpx;
    height: 90rpx;
    overflow: hidden;
}

.address-list .name{
    width: 125rpx;
    height: 43rpx;
    font-size: 29rpx;
    color: #333;
    margin-bottom: 5.2rpx;
        text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.address-list .default{
    width: 62.5rpx;
    height: 33rpx;
    line-height: 28rpx;
    text-align: center;
    font-size: 20rpx;
    color: #b4282d;
    border: 1rpx solid #b4282d;
    visibility: visible;
}


.address-list .c{
    flex: 1;
    height: auto;
    overflow: hidden;
}

.address-list .mobile{

    height: 29rpx;
    font-size: 29rpx;
    line-height: 29rpx;
    overflow: hidden;
    color: #333;
    margin-bottom: 6.25rpx;
}

.address-list .address{
    height: 37rpx;
    font-size: 25rpx;
    line-height: 37rpx;
    overflow: hidden;
    color: #666;
}

.address-list .r{
    width: 52rpx;
    height: auto;
    overflow: hidden;
    margin-right: 16.5rpx;
}

.address-list .del{
    display: block;
    width: 52rpx;
    height: 52rpx;
}

.add-address{
    background: #b4282d;
    text-align: center;
    width: 100%;
    height: 99rpx;
    line-height: 99rpx;
    position: fixed;
    border-radius: 0;
    border: none;
    color: #fff;
    font-size: 29rpx;
    bottom: 0;
    left:0;
}

.empty-view{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-view .icon{
  height: 248rpx;
  width: 258rpx;
  margin-bottom: 10rpx;
}

.empty-view .text{
  width: auto;
  font-size: 28rpx;
  line-height: 35rpx;
  color: #999;
}
</style>
