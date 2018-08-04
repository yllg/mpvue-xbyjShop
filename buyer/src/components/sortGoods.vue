<template>
<view>
  <view class="sort">
    <view class="sort-box">
      <view :class=" currentSortType == 'default' ? 'active item' : 'item'"  @click="openSortFilter" id="defaultSort">
        <text class="txt">综合</text>
      </view>
      <view :class="['item', 'by-price', { active: currentSortType == 'price', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
         @click="openSortFilter" id="priceSort">
        <text class="txt">价格</text>
      </view>
      <view :class=" currentSortType == 'category' ? 'active item' : 'item'" @click="openSortFilter" id="categoryFilter">
        <text class="txt">分类</text>
      </view>
    </view>
    <view class="sort-box-category" v-if="categoryFilter">
      <view :class="item.checked ? 'active item' : 'item'" v-for="(item, index) of filterCategory" :key="cate-item.id" :data-category-index="index" @click="selectCategory">{{item.name}}</view>
    </view>
  </view>
  <view class="cate-item">
    <view class="b">
      <block v-for="(item, index) of goodsList" :key="index">
        <navigator :class="index % 2 == 0 ? 'item-b item' : 'item'" :url="'../goods/goods?id=' + item.id">
          <img class="img" :src="item.list_pic_url" background-size="cover"/>
          <text class="name">{{item.name}}</text>
          <text class="price">￥{{item.retail_price}}</text>
        </navigator>
      </block>
    </view>
  </view>
</view>
</template>

<script>
export default {
  props: {
    currentSortType: {
      type: String,
      default () {
        return {}
      }
    },
    currentSortOrder: {
      type: String,
      default () {
        return {}
      }
    },
    openSortFilter: {
      type: Function,
      default () {
        return {}
      }
    },
    categoryFilter: {
      type: Boolean,
      default () {
        return {}
      }
    },
    filterCategory: {
      type: Array,
      default () {
        return {}
      }
    },
    selectCategory: {
      type: Function,
      default () {
        return {}
      }
    },
    goodsList: {
      type: Array,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped>

.sort{
    position: relative;
    background: #fff;
    width: 100%;
    height: 78rpx;
}

.sort-box{
    background: #fff;
    width: 690rpx;
    height: 78rpx;
    overflow: hidden;
    padding: 0 30rpx;
    display: flex;
    border-bottom: 1px solid #d9d9d9;
}

.sort-box .item{
    height: 78rpx;
    line-height: 78rpx;
    text-align: center;
    flex:1;
    color: #333;
    font-size: 30rpx;
}

.sort-box .item .txt{
    display: block;
    width: 100%;
    height: 100%;
    color: #333;
}

.sort-box .item.active .txt{
    color: #b4282d;
}

.sort-box .item.by-price{
    background: url(//yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/no-3127092a69.png) 155rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.asc{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/up-636b92c0a5.png) 155rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.desc{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/down-95e035f3e5.png) 155rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box-category{
    background: #fff;
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 40rpx 40rpx 0 0;
    border-bottom: 1px solid #d9d9d9;
}

.sort-box-category .item{
    height: 54rpx;
    line-height: 54rpx;
    text-align: center;
    float: left;
    padding: 0 16rpx;
    margin: 0 0 40rpx 40rpx;
    border: 1px solid #666;
    color: #333;
    font-size: 24rpx;
}

.sort-box-category .item.active{
    color: #b4282d;
    border: 1px solid #b4282d;
}

.cate-item .b{
  width: 750rpx;
  height: auto;
  overflow: hidden;
  border-top: 1rpx solid #f4f4f4;
  margin-top: 20rpx;
}

.cate-item .b .item{
  float: left;
  background: #fff;
  width: 375rpx;
  padding-bottom: 33.333rpx;
  border-bottom: 1rpx solid #f4f4f4;
  height: auto;
  overflow: hidden;
  text-align: center;
}

.cate-item .b .item-b{
 border-right: 1rpx solid #f4f4f4;
}

.cate-item .item .img{
    margin-top: 10rpx;
  width: 302rpx;
  height: 302rpx;
}

.cate-item .item .name{
  display: block;
  width: 325rpx;
  height: 35rpx;
  padding: 0 20rpx;
  overflow: hidden;
  margin: 11.5rpx 0 22rpx 0;
  text-align: center;
  font-size: 30rpx;
  color: #333;
}

.cate-item .item .price{
  display: block;
  width: 365.625rpx;
  height: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #b4282d;
}
</style>
