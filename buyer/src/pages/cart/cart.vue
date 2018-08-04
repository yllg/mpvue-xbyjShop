<template >
<view class="container">
  <view class="service-policy">
    <view class="item">30天无忧退货</view>
    <view class="item">48小时快速退款</view>
    <view class="item">满88元免邮费</view>
  </view>
  <view class="no-cart" v-if="cartGoods.length <= 0">
    <view class="c">
      <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" />
      <text>去添加点什么吧</text>
    </view>
  </view>
  <view class="cart-view" v-if="cartGoods.length">
    <view class="list">
      <view class="group-item">
        <view class="goods">
          <view :class="isEditCart ? 'edit item' : 'item'" v-for="(item, index) of cartGoods" :key="item.id">
            <view :class="item.checked ? 'checked checkbox' : 'checkbox'" @click="checkedItem" :data-item-index="index"></view>
            <view class="cart-goods">
              <img class="img" :src="item.list_pic_url"/>
              <view class="info">
                <view class="t">
                  <text class="name">{{item.goods_name}}</text>
                  <text class="num">x{{item.number}}</text>
                </view>
                <view class="attr">{{ isEditCart ? '已选择:' : ''}}{{item.goods_specifition_name_value}}</view>
                <view class="b">
                  <text class="price">￥{{item.retail_price}}</text>
                  <view class="selnum">
                    <view class="cut" @click="cutNumber" :data-item-index="index">-</view>
                    <input :value="item.number" class="number" disabled="true" type="number" />
                    <view class="add" @click="addNumber" :data-item-index="index">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="group-item">
          <view class="header">
              <view class="promotion">
                  <text class="tag">满赠</text>
                  <text class="txt">再加26元, 3件赠1件蔓越莓干</text>
                  <img class="icon" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/go-b67cb9718d.png"/>
              </view>
              <view class="get">领赠品</view>
          </view>
          <view class="goods">
              <view class="item">
                  <view class="checkbox" ></view>
                  <view class="cart-goods">
                      <img class="img" src="http://yanxuan.nosdn.127.net/04e05e9de3a471b1f6479dd137b459a8.png"/>
                      <view class="info">
                          <view class="t">
                              <text class="name">秋冬保暖加厚细羊毛被</text>
                              <text class="num">x1</text>
                          </view>
                          <view class="attr">220*240cm</view>
                          <view class="b">
                              <text class="price">￥199.99</text>
                              <view class="open">优惠活动</view>
                          </view>
                      </view>
                  </view>
              </view>
          </view>
      </view>
    </view>
    <view class="cart-bottom">
      <view :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选({{cartTotal.checkedGoodsCount}})</view>
      <view class="total">{{!isEditCart ? '￥'+cartTotal.checkedGoodsAmount : ''}}</view>
      <view class="delete" @click="editCart">{{!isEditCart ? '编辑' : '完成'}}</view>
      <view class="checkout" @click="deleteCart" v-if="isEditCart">删除所选</view>
      <view class="checkout" @click="checkoutOrder" v-if="!isEditCart">下单</view>
    </view>
  </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      cartGoods: [],
      cartTotal: {
        'goodsCount': 0,
        'goodsAmount': 0.00,
        'checkedGoodsCount': 0,
        'checkedGoodsAmount': 0.00
      },
      isEditCart: false,
      checkedAllStatus: true,
      editCartList: []
    }
  },
  // 每次打开触发，更新数据
  onShow () {
    this.getCartList()
  },
  methods: {
    // 请求购物车数据
    async getCartList () {
      const res = await api.getCartList();
      // console.log('购物车数据,请求结果', res);
      if (res.errno === 0) {
        this.cartGoods = res.data.cartList;
        this.cartTotal = res.data.cartTotal;
      }
      this.checkedAllStatus = this.isCheckedAll();
    },
    // 判断购物车是否全选
    isCheckedAll () {
      return this.cartGoods.every(function (element, index, array) {
        if (element.checked === 1) {
          return true;
        } else {
          return false;
        }
      });
    },
    // checkbox的点击事件
    async checkedItem (event) {
      let itemIndex = event.currentTarget.dataset.itemIndex;
      // 非编辑状态，发请求后台node进行计算
      if (!this.isEditCart) {
        const res = await api.CartChecked({ productIds: this.cartGoods[itemIndex].product_id, isChecked: this.cartGoods[itemIndex].checked ? 0 : 1 });
        // console.log('点击checkbox后台重新计算,请求结果', res);
        if (res.errno === 0) {
          this.cartGoods = res.data.cartList;
          this.cartTotal = res.data.cartTotal;
        }
        this.checkedAllStatus = this.isCheckedAll();
      } else {
        // 编辑状态，前端进行简单计算
        let tmpCartData = this.cartGoods.map(function (element, index, array) {
          if (index === itemIndex) {
            element.checked = !element.checked;
          }
          return element;
        });
        this.cartGoods = tmpCartData;
        this.checkedAllStatus = this.isCheckedAll();
        this.cartTotal.checkedGoodsCount = this.getCheckedGoodsCount();
      }
    },
    // 计算选中的商品数量
    getCheckedGoodsCount () {
      let checkedGoodsCount = 0;
      this.cartGoods.forEach(function (v) {
        if (v.checked === true) {
          checkedGoodsCount += v.number;
        }
      });
      // console.log('选中的商品数量', checkedGoodsCount);
      return checkedGoodsCount;
    },
    // 点击底部的“全选”
    async checkedAll () {
      // 非编辑状态，请求后台计算
      if (!this.isEditCart) {
        var productIds = this.cartGoods.map(function (v) {
          return v.product_id;
        });
        const res = await api.CartChecked({ productIds: productIds.join(','), isChecked: this.isCheckedAll() ? 0 : 1 });
        // console.log('点击全选,请求结果', res);
        if (res.errno === 0) {
          this.cartGoods = res.data.cartList;
          this.cartTotal = res.data.cartTotal;
        }
        this.checkedAllStatus = this.isCheckedAll();
        // console.log('检查是否全选', this.checkedAllStatus);
      } else {
        // 编辑状态，前端进行简单计算
        let checkedAllStatus = this.isCheckedAll();
        let tmpCartData = this.cartGoods.map(function (v) {
          v.checked = !checkedAllStatus;
          return v;
        });
        this.cartGoods = tmpCartData;
        this.checkedAllStatus = this.isCheckedAll();
        this.cartTotal.checkedGoodsCount = this.getCheckedGoodsCount();
      }
    },
    // 点击“编辑/完成”按钮
    editCart () {
      // 编辑状态
      if (this.isEditCart) {
        this.getCartList();
        this.isEditCart = !this.isEditCart;
      } else {
        // 非编辑状态
        let tmpCartList = this.cartGoods.map(function (v) {
          v.checked = false;
          return v;
        });
        this.editCartList = this.cartGoods;
        this.cartGoods = tmpCartList;
        this.isEditCart = !this.isEditCart;
        this.checkedAllStatus = this.isCheckedAll();
        this.cartTotal.checkedGoodsCount = this.getCheckedGoodsCount();
      }
    },
    // 更新购物车数据，点击+或—触发
    async updateCart (productId, goodsId, number, id) {
      const res = await api.CartUpdate({
        productId: productId,
        goodsId: goodsId,
        number: number,
        id: id
      });
      // console.log('+或-更新购物车,请求结果', res);
      if (res.errno === 0) {
        // this.cartGoods = res.data.cartList;
        // this.cartTotal = res.data.cartTotal;
      }
      this.checkedAllStatus = this.isCheckedAll();
    },
    // 减少数量
    cutNumber (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
      let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
      cartItem.number = number;
      this.cartGoods = this.cartGoods;
      this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },
    // 增加数量
    addNumber (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
      let number = cartItem.number + 1;
      cartItem.number = number;
      this.cartGoods = this.cartGoods;
      this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },
    // 点击“下单”，跳转到下单页
    checkoutOrder () {
      // 获取已选择的商品
      var checkedGoods = this.cartGoods.filter(function (element, index, array) {
        if (element.checked === 1) {
          return true;
        } else {
          return false;
        }
      });
      if (checkedGoods.length <= 0) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '未选择任何商品',
          mask: true
        });
        return false;
      }
      wx.navigateTo({
        url: '../shopping/checkout'
      })
    },
    // 点击“删除所选”
    async deleteCart () {
      // 获取已选择的商品
      let productIds = this.cartGoods.filter(function (element, index, array) {
        if (element.checked === true) {
          return true;
        } else {
          return false;
        }
      });
      if (productIds.length <= 0) {
        return false;
      }
      productIds = productIds.map(function (element, index, array) {
        if (element.checked === true) {
          return element.product_id;
        }
      });
      // 请求后台计算
      const res = await api.CartDelete({ productIds: productIds.join(',') });
      // console.log('删除所选', res);
      if (res.errno === 0) {
        let cartList = res.data.cartList.map(v => {
          v.checked = false;
          return v;
        });
        this.cartGoods = cartList;
        this.cartTotal = res.data.cartTotal;
      }
      this.checkedAllStatus = this.isCheckedAll();
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/cart/cart'
    }
  }
}
</script>

<style>
page{
    height: 100%;
    min-height: 100%;
    background: #f4f4f4;
}
.container{
    background: #f4f4f4;
    width: 100%;
    height: auto;
    min-height: 100%;
    overflow: hidden;
}
.service-policy{
    width: 720rpx;
    height: 73rpx;
    background: #f4f4f4;
    padding: 0 31.25rpx;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
}

.service-policy .item{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png) 0 center no-repeat;
    background-size: 10rpx;
    padding-left: 15rpx;
    display: flex;
    align-items: center;
    font-size: 25rpx;
    color: #666;
}

.no-cart{
    width: 100%;
    height: auto;
    margin: 0 auto;
}

.no-cart .c{
    width: 100%;
    height: auto;
    margin-top: 200rpx;
}

.no-cart .c image{
    margin: 0 auto;
    display: block;
    text-align: center;
    width: 258rpx;
    height: 258rpx;
}

.no-cart .c text{
    margin: 0 auto;
    display: block;
    width: 258rpx;
    height: 29rpx;
    line-height: 29rpx;
    text-align: center;
    font-size: 29rpx;
    color: #999;
}


.cart-view{
    width: 100%;
    height: auto;
    overflow: hidden;

}

.cart-view .list{
    height: auto;
    width: 100%;
    overflow: hidden;
    margin-bottom: 120rpx;
}

.cart-view .group-item{
    height: auto;
    width: 100%;
    background: #fff;
    margin-bottom: 18rpx;
}

.cart-view .item{
    height: 164rpx;
    width: 100%;
    overflow: hidden;
}
.cart-view .item .checkbox{
    float: left;
    height: 34rpx;
    width: 34rpx;
    margin: 65rpx 18rpx 65rpx 26rpx;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
    background-size: 34rpx;
}

.cart-view .item .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}

.cart-view .item .cart-goods{
    float: left;
    height: 164rpx;
    width: 672rpx;
    border-bottom: 1px solid #f4f4f4;
}

.cart-view .item .img{
    float: left;
    height:125rpx;
    width: 125rpx;
    background: #f4f4f4;
    margin: 19.5rpx 18rpx 19.5rpx 0;
}

.cart-view .item .info{
    float: left;
    height:125rpx;
    width: 480rpx;
    margin: 19.5rpx 26rpx 19.5rpx 0;
}

.cart-view .item .t{
    margin: 8rpx 0;
    height: 28rpx;
    font-size: 25rpx;
    color: #333;
    overflow: hidden;
}


.cart-view .item .name{
    height: 28rpx;
    max-width: 310rpx;
    line-height: 28rpx;
    font-size: 25rpx;
    color: #333;
    overflow: hidden;
}

.cart-view .item .num{
    height: 28rpx;
    line-height: 28rpx;
    float: right;
}

.cart-view .item .attr{
    margin-bottom: 17rpx;
    height: 24rpx;
    line-height: 24rpx;
    font-size: 22rpx;
    color: #666;
    overflow: hidden;
}

.cart-view .item .b{
    height: 28rpx;
    line-height: 28rpx;
    font-size: 25rpx;
    color: #333;
    overflow: hidden;
}

.cart-view .item .price{
    float: left;
}

.cart-view .item .open{
    height: 28rpx;
    width: 150rpx;
    display: block;
    float: right;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/arrowDown-d48093db25.png) right center no-repeat;
    background-size: 25rpx;
    font-size: 25rpx;
    color: #333;
}

.cart-view .item.edit .t{
    display: none;
}

.cart-view .item.edit .attr{
    text-align: right;
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/arrow-right1-e9828c5b35.png) right center no-repeat;
    padding-right: 25rpx;
    background-size: 12rpx 20rpx;
    margin-bottom: 24rpx;
    height: 39rpx;
    line-height: 39rpx;
    font-size: 24rpx;
    color: #999;
    overflow: hidden;
}

.cart-view .item.edit .b{
    display: flex;
    height: 52rpx;
    overflow: hidden;
}

.cart-view .item.edit .price{
    line-height: 52rpx;
    height: 52rpx;
    flex: 1;
}

.cart-view .item .selnum{
    display: none;
}

.cart-view .item.edit .selnum{
    width: 235rpx;
    height: 48rpx;
    border: 1rpx solid #ccc;
    display: flex;
}

.selnum .cut{
    width: 70rpx;
    height: 100%;
    text-align: center;
    line-height: 48rpx;
}

.selnum .number{
    flex: 1;
    height: 100%;
    text-align: center;
    line-height: 68.75rpx;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    float: left;
}

.selnum .add{
    width: 80rpx;
    height: 100%;
    text-align: center;
    line-height: 48rpx;
}


.cart-view .group-item .header{
    width: 92%;
    height: 94rpx;
    line-height: 94rpx;
    padding: 0 26rpx;
    border-bottom: 1px solid #f4f4f4;
}

.cart-view .promotion .icon{
    display: inline-block;
    height: 24rpx;
    width: 15rpx;
}

.cart-view .promotion{
    margin-top: 25.5rpx;
    float: left;
    height: 43rpx;
    width: 480rpx;
    /*margin-right: 84rpx;*/
    line-height: 43rpx;
    font-size: 0;
}

.cart-view .promotion .tag{
    border: 1px solid #f48f18;
    height: 37rpx;
    line-height: 31rpx;
    padding: 0 9rpx;
    margin-right: 10rpx;
    color: #f48f18;
    font-size: 24.5rpx;
}

.cart-view .promotion .txt{
    height: 43rpx;
    line-height: 43rpx;
    padding-right: 10rpx;
    color: #333;
    font-size: 29rpx;
    overflow: hidden;
}

.cart-view .get{
    margin-top: 18rpx;
    float: right;
    height: 58rpx;
    padding-left: 14rpx;
    border-left: 1px solid #d9d9d9;
    line-height: 58rpx;
    font-size: 29rpx;
    color: #333;
}

.cart-bottom{
    position: fixed;
    bottom:0;
    left:0;
    height: 100rpx;
    width: 100%;
    background: #fff;
    display: flex;
}

.cart-bottom .checkbox{
    height: 34rpx;

    padding-left: 60rpx;
    line-height: 34rpx;
    margin: 33rpx 18rpx 33rpx 26rpx;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
    background-size: 34rpx;
    font-size: 29rpx;
}

.cart-bottom .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}

.cart-bottom .total{
    height: 34rpx;
    flex: 1;
    margin: 33rpx 10rpx;
    font-size: 29rpx;
}


.cart-bottom .delete{
    height: 34rpx;
    width: auto;
    margin: 33rpx 18rpx;
    font-size: 29rpx;
}

.cart-bottom .checkout{
    height: 100rpx;
    width: 210rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 29rpx;
    background: #b4282d;
    color: #fff;
}
</style>
