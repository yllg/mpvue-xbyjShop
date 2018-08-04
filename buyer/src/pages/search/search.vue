<template >
<scroll-view class="container" style="height: 100%;">
  <view class="search-header">
    <view class="input-box">
      <img class="icon" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png"/>
      <input name="input" class="keywrod" focus="true" :value="keyword" confirm-type="search" @input="inputChange" @focus="inputFocus" @confirm="onKeywordConfirm" :placeholder="defaultKeyword.keyword" />
      <img class="del" v-if="keyword" @click="clearKeyword" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png"/>
    </view>
    <view class="right" @click="closeSearch">取消</view>
  </view>
  <view class="no-search" v-if="!searchStatus">
      <view class="serach-keywords search-history" v-if="!keyword && historyKeyword.length">
    <view class="h">
      <text class="title">历史记录</text>
      <img class="icon" @click="clearHistory" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/del1-93f0a4add4.png"/>
    </view>
    <view class="b">
      <view class="item" @click="onKeywordTap" :data-keyword="item" v-for="(item, index) of historyKeyword" :key="item" :data-index="index" hover-class="navigator-hover">{{item}}</view>
    </view>
  </view>
  <view class="serach-keywords search-hot" v-if="!keyword">
    <view class="h">
      <text class="title">热门搜索</text>
    </view>
    <view class="b">
      <view :class="item.is_hot === 1 ? 'active item' : 'item'" hover-class="navigator-hover" @click="onKeywordTap" :data-keyword="item.keyword" v-for="(item, index) of hotKeyword" :key="item.keyword" :data-index="index">{{item.keyword}}</view>
    </view>
  </view>
  <view class="shelper-list" v-if="keyword">
    <view class="item" hover-class="navigator-hover" v-for="(item, index) of helpKeyword" :key="item" :data-index="index" @click="onKeywordTap" :data-keyword="item">{{item}}</view>
  </view>
  </view>

  <view class="search-result" v-if="searchStatus && goodsList.length">
    <sortGoods :currentSortType = currentSortType :currentSortOrder = currentSortOrder :openSortFilter = openSortFilter :categoryFilter = categoryFilter
    :filterCategory = filterCategory :selectCategory = selectCategory :goodsList = goodsList></sortGoods>
  </view>

  <view class="search-result-empty" v-if="!goodsList.length && searchStatus">
    <img class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noSearchResult-7572a94f32.png"/>
    <text class="text">您寻找的商品还未上架</text>
  </view>
</scroll-view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import sortGoods from '@/components/sortGoods'

export default {
  components: {
    sortGoods
  },
  data () {
    return {
      keyword: '',
      searchStatus: false,
      goodsList: [],
      helpKeyword: [],
      historyKeyword: [],
      categoryFilter: false,
      currentSortType: 'default',
      filterCategory: [],
      defaultKeyword: {},
      hotKeyword: [],
      page: 1,
      size: 20,
      currentSortOrder: 'desc',
      categoryId: 0,
      timer: null
    }
  },
  async mounted () {
    await Promise.all([
      this.getSearchKeyword()
    ])
  },
  methods: {
    // 获取历史记录，默认红色关键词，热门关键词
    async getSearchKeyword () {
      const res = await api.SearchIndex();
      // console.log('搜索关键词,请求结果', res);
      if (res.errno === 0) {
        this.historyKeyword = res.data.historyKeywordList;
        this.defaultKeyword = res.data.defaultKeyword;
        this.hotKeyword = res.data.hotKeywordList;
      }
    },
    // 点击“取消”
    closeSearch () {
      wx.navigateBack()
    },
    // 清空关键词
    clearKeyword () {
      this.keyword = '';
      this.searchStatus = false;
    },
    // 监听输入事件
    inputChange (e) {
      // debounce防抖 500ms
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        // console.log('延迟监听输入事件', e);
        this.keyword = e.target.value;
        this.searchStatus = false;
        this.getHelpKeyword();
      }, 500)
    },
    // 输入框获得焦点
    inputFocus () {
      this.searchStatus = false;
      this.goodsList = [];
      if (this.keyword) {
        this.getHelpKeyword();
      }
    },
    // 输入时获取关键词提示
    async getHelpKeyword () {
      const res = await api.SearchHelper({ keyword: this.keyword });
      // console.log('关键词提示,请求结果', res);
      if (res.errno === 0) {
        this.helpKeyword = res.data;
      }
    },
    // 清空历史记录
    async clearHistory () {
      this.historyKeyword = [];
      const res = await api.ClearSearchHistory();
      // console.log('清空历史记录,请求结果', res);
      if (res.errno === 0) {
        // console.log('清除成功');
      }
    },
    // 获得搜索结果的商品列表
    async getGoodsList () {
      this.historyKeyword = [];
      const res = await api.getGoodsList({ keyword: this.keyword, page: this.page, size: this.size, sort: this.currentSortType, order: this.currentSortOrder, categoryId: this.categoryId });
      // console.log('搜索结果', res);
      if (res.errno === 0) {
        this.searchStatus = true;
        this.categoryFilter = false;
        this.goodsList = res.data.data;
        this.filterCategory = res.data.filterCategory;
        this.page = res.data.currentPage;
        this.size = res.data.pageSize;
        // 重新获取关键词
        this.getSearchKeyword();
      }
    },
    // 关键词被点击
    onKeywordTap (event) {
      // console.log('点击关键词的event', event);
      this.getSearchResult(event.currentTarget.dataset.keyword);
    },
    // 上一个方法调用
    getSearchResult (keyword) {
      this.keyword = keyword;
      this.page = 1;
      this.categoryId = 0;
      this.goodsList = [];
      this.getGoodsList();
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
          this.getGoodsList();
          break;
        default:
          // 综合排序
          this.categoryFilter = false;
          this.currentSortType = 'default';
          this.currentSortOrder = 'desc';
          this.getGoodsList();
      }
    },
    // “分类”的点击事件
    selectCategory: function (event) {
      // console.log('分类点击的event', event);
      let currentIndex = event.currentTarget.dataset.categoryIndex;
      this.categoryFilter = false;
      this.categoryId = this.filterCategory[currentIndex].id;
      this.getGoodsList();
    },
    // 键盘回车进行搜索
    onKeywordConfirm: function (event) {
      // console.log('键盘回车的event', event);
      // 这里是target不是currentTarget哦~
      this.getSearchResult(event.target.value);
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/search/search'
    }
  }
}
</script>

<style>
page{
  min-height: 100%;
  background-color: #f4f4f4;
}

.container{
  min-height: 100%;
  background-color: #f4f4f4;
}

.search-header{
    position: fixed;
    top: 0;
    width: 700rpx;
    height: 91rpx;
    display: flex;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,.15);
    padding: 0 31.25rpx;
    font-size: 29rpx;
    color: #333;
}

.search-header .input-box{
    position: relative;
    margin-top: 16rpx;
    float: left;
    width: 0;
    flex: 1;
    height: 59rpx;
    line-height: 59rpx;
    padding: 0 20rpx;
    background: #f4f4f4;
}

.search-header .icon{
    position: absolute;
    top: 14rpx;
    left: 20rpx;
    width: 31rpx;
    height: 31rpx;
}

.search-header .del{
    position: absolute;
    top: 3rpx;
    right: 10rpx;
    width: 53rpx;
    height: 53rpx;
    z-index: 10;
}

.search-header .keywrod{
    position: absolute;
    top: 0;
    left: 40rpx;
    width: 506rpx;
    height: 59rpx;
    padding-left: 30rpx;
}

.search-header .right{
    margin-top: 24rpx;
    margin-left: 31rpx;
    margin-right: 6rpx;
    width: 58rpx;
    height: 43rpx;
    line-height: 43rpx;
    float: right;
}

.no-search{
    height: auto;
    overflow: hidden;
    margin-top: 91rpx;
}

.serach-keywords{
    background: #fff;
    width: 750rpx;
    height: auto;
    overflow: hidden;
    margin-bottom: 20rpx;
}

.serach-keywords .h{
    padding: 0 31.25rpx;
    height: 93rpx;
    line-height: 93rpx;
    width: 95%;
    color: #999;
    font-size: 29rpx;
}

.serach-keywords .title{
    display: block;
    width: 120rpx;
    float: left;
}

.serach-keywords .icon{
    margin-top: 19rpx;
    float: right;
    display: block;
    margin-left: 511rpx;
    height: 55rpx;
    width: 55rpx;
}

.serach-keywords .b{
    width: 750rpx;
    height: auto;
    overflow: hidden;
    padding-left: 31.25rpx;
}

.serach-keywords .item{
    display: inline-block;
    width: auto;
    height: 48rpx;
    line-height: 48rpx;
    padding:0 15rpx;
    border: 1px solid #999;
    margin: 0 31.25rpx 31.25rpx 0;
    font-size: 24rpx;
    color: #333;
}

.serach-keywords .item.active{
    color: #b4282d;
    border: 1px solid #b4282d;
}

.shelper-list{
    width: 750rpx;
    height: auto;
    overflow: hidden;
    background: #fff;
    padding: 0 31.25rpx;
}

.shelper-list .item{
    height: 93rpx;
    width: 687.5rpx;
    line-height: 93rpx;
    font-size: 24rpx;
    color: #333;
    border-bottom: 1px solid #f4f4f4;
}

.search-result-empty{
    width: 100%;
    height: 100%;
    padding-top: 300rpx;
}

.search-result-empty .icon{
    margin: 0 auto;
    display: block;
    width: 240rpx;
    height: 240rpx;
}

.search-result-empty .text{
    display: block;
    width: 100%;
    height: 40rpx;
    font-size: 28rpx;
    text-align: center;
    color: #999;
}
</style>
