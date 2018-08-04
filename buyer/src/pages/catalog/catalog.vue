<template >
<view class="container">
    <view class="search">
        <navigator url="/pages/search/search" class="input">
            <img class="icon"/>
            <text class="txt">商品搜索, 共{{goodsCount}}款好物</text>
        </navigator>
    </view>
    <view class="catalog">
        <scroll-view class="nav" scroll-y="true">
            <view :class="currentCategory.id == item.id ? 'active item' : 'item'" v-for="(item, index) of navList" :key="item.id" :data-id="item.id"
                :data-index="index" @click="switchCate">{{item.name}}</view>
        </scroll-view>
        <scroll-view class="cate" scroll-y="true">
            <view class="banner">
                <img class="image" :src="currentCategory.wap_banner_url"/>
                <view class="txt">{{currentCategory.front_name}}</view>
            </view>
            <view class="hd">
                <text class="line"></text>
                <text class="txt">{{currentCategory.name}}分类</text>
                <text class="line"></text>
            </view>
            <view class="bd">
                <navigator :url="'/pages/category/category?id=' + item.id" :class="(index+1) % 3 == 0 ? 'last item' : 'item'" v-for="(item, index) of currentCategory.subCategoryList"
                    :key="item.id">
                    <img class="icon" :src="item.wap_banner_url"/>
                    <text class="txt">{{item.name}}</text>
                </navigator>
            </view>
        </scroll-view>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      navList: [],
      categoryList: [],
      currentCategory: {},
      scrollLeft: 0,
      scrollTop: 0,
      goodsCount: 0,
      scrollHeight: 0
    }
  },
  async mounted () {
    await Promise.all([
      this.getCatalogList()
    ])
  },
  methods: {
    // 分类主页数据和数量
    async getCatalogList () {
      const res1 = await api.getCatalogList();
      // console.log('分类主页,请求结果', res1);
      if (res1.errno === 0) {
        this.navList = res1.data.categoryList;
        this.currentCategory = res1.data.currentCategory;
      }
      const res2 = await api.getGoodsCount();
      // console.log('分类主页商品数量,请求结果', res2);
      if (res2.errno === 0) {
        this.goodsCount = res2.data.goodsCount;
      }
    },
    // 选择不同的分类
    async switchCate (event) {
      // console.log('event', event);
      var currentID = event.currentTarget.dataset.id;
      if (this.currentCategory.id === currentID) {
        return false;
      }
      this.getCurrentCategory(currentID);
    },
    // 获得当前的分类
    async getCurrentCategory (id) {
      const res = await api.getCatalogCurrent({ id: id });
      // console.log('当前分类,请求结果', res);
      if (res.errno === 0) {
        this.currentCategory = res.data.currentCategory
      }
    }
  },
  // 原生的分享功能？？
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/index/index'
    }
  }
}
</script>

<style>
page {
  height: 100%;
}

.container {
  background: #f9f9f9;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  height: 88rpx;
  width: 100%;
  padding: 0 30rpx;
  background: #fff;
  display: flex;
  align-items: center;
}

.search .input {
  width: 690rpx;
  height: 56rpx;
  background: #ededed;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 24rpx;
}

.search .icon {
  background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/search2-2fb94833aa.png) center no-repeat;
  background-size: 100%;
  width: 28rpx;
  height: 28rpx;
}

.search .txt {
  height: 42rpx;
  line-height: 42rpx;
  color: #666;
  padding-left: 10rpx;
  font-size: 30rpx;
}

.catalog {
  flex: 1;
  width: 100%;
  background: #fff;
  display: flex;
  border-top: 1px solid #fafafa;
}

.catalog .nav {
  width: 162rpx;
  height: 100%;
}

.catalog .nav .item {
  text-align: center;
  line-height: 90rpx;
  width: 162rpx;
  height: 90rpx;
  color: #333;
  font-size: 28rpx;
  border-left: 6rpx solid #fff;
}

.catalog .nav .item.active {
  color: #ab2b2b;
  font-size: 36rpx;
  border-left: 6rpx solid #ab2b2b;
}

.catalog .cate {
  border-left: 1px solid #fafafa;
  flex: 1;
  height: 100%;
  padding: 0 30rpx 0 30rpx;
}

.banner {
  display: block;
  height: 222rpx;
  width: 100%;
  position: relative;
}

.banner .image {
  position: absolute;
  top: 30rpx;
  left: 0;
  border-radius: 4rpx;
  height: 192rpx;
  width: 100%;
}

.banner .txt {
  position: absolute;
  top: 30rpx;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  left: 0;
  height: 192rpx;
  line-height: 192rpx;
  width: 100%;
}

.catalog .hd {
  height: 108rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.catalog .hd .txt {
  font-size: 24rpx;
  text-align: center;
  color: #333;
  padding: 0 10rpx;
  width: auto;
}

.catalog .hd .line {
  width: 40rpx;
  height: 1px;
  background: #d9d9d9;
}

.catalog .bd {
  height: auto;
  width: 100%;
  overflow: hidden;
}

.catalog .bd .item {
  display: block;
  float: left;
  height: 216rpx;
  width: 144rpx;
  margin-right: 34rpx;
}

.catalog .bd .item.last {
  margin-right: 0;
}

.catalog .bd .item .icon {
  height: 144rpx;
  width: 144rpx;
}

.catalog .bd .item .txt {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #333;
  height: 72rpx;
  width: 144rpx;
}

</style>
