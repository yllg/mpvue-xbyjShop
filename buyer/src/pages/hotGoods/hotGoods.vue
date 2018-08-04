<template >
<view class="container">
  <view class="brand-info">
    <view class="name">
      <img class="img" :src="bannerInfo.img_url" background-size="cover"/>
      <view class="info-box">
        <view class="info">
          <text class="txt">{{bannerInfo.name}}</text>
          <text class="line"></text>
        </view>
      </view>
    </view>
  </view>
  <sortGoods :currentSortType = currentSortType :currentSortOrder = currentSortOrder :openSortFilter = openSortFilter :categoryFilter = categoryFilter
  :filterCategory = filterCategory :selectCategory = selectCategory :goodsList = goodsList></sortGoods>
</view>
</template>

<script>
import api from '@/utils/api'
import sortGoods from '@/components/sortGoods'

export default {
  components: {
    sortGoods
  },
  data () {
    return {
      bannerInfo: {
        'img_url': '',
        'name': ''
      },
      categoryFilter: false,
      filterCategory: [],
      goodsList: [],
      categoryId: 0,
      currentSortType: 'default',
      currentSortOrder: 'desc',
      page: 1,
      size: 1000
    }
  },
  async mounted () {
    await Promise.all([
      this.getGoodsHot()
    ])
  },

  methods: {
    // 获取热门商品信息
    async getGoodsHot () {
      const res = await api.getGoodsHot();
      // console.log('热门商品，请求结果', res);
      if (res.errno === 0) {
        this.bannerInfo = res.data.bannerInfo;
        this.getGoodsList();
      }
    },

    // 获取商品列表信息
    async getGoodsList () {
      const res = await api.getGoodsList({ isHot: 1, page: this.page, size: this.size, order: this.currentSortOrder, sort: this.currentSortType, categoryId: this.categoryId });
      // console.log('商品列表', res);
      if (res.errno === 0) {
        this.goodsList = res.data.goodsList;
        this.filterCategory = res.data.filterCategory;
      }
    },
    // 三个排序条件的点击事件
    openSortFilter: function (event) {
      let currentId = event.currentTarget.id;
      switch (currentId) {
        case 'categoryFilter':
          this.categoryFilter = !this.categoryFilter;
          this.currentSortType = 'category';
          this.currentSortOrder = 'asc';
          break;
        case 'priceSort':
          let tmpSortOrder = 'asc';
          if (this.currentSortOrder === 'asc') {
            tmpSortOrder = 'desc';
          }
          this.categoryFilter = false;
          this.currentSortType = 'price';
          this.currentSortOrder = tmpSortOrder;
          this.getGoodsHot();
          break;
        default:
          // 综合排序
          this.categoryFilter = false;
          this.currentSortType = 'default';
          this.currentSortOrder = 'desc';
          this.getGoodsHot();
      }
    },
    // “分类”的点击事件
    selectCategory: function (event) {
      let currentIndex = event.target.dataset.categoryIndex;
      this.categoryFilter = false;
      this.categoryId = this.filterCategory[currentIndex].id;
      this.getGoodsHot();
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/hotGoods/hotGoods'
    }
  }
}
</script>

<style scoped>
page{
    background: #f4f4f4;
}

.brand-info .name{
    width: 100%;
    height: 278rpx;
    position: relative;
}

.brand-info .img{
    /* position: absolute;
    top:0;
    left:0; */
    width: 750rpx;
    height: 278rpx;
}

.brand-info .info-box{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 278rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.brand-info .info{
    display: block;
}

.brand-info .txt{
    display: block;
    height: 40rpx;
    font-size: 37.5rpx;
    color: #fff;
}

.brand-info .line{
    margin: 0 auto;
    margin-top: 16rpx;
    display: block;
    height: 2rpx;
    width: 145rpx;
    background: #fff;
}

</style>
