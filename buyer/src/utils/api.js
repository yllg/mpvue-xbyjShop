import request from './request'

const ApiRootUrl = 'http://127.0.0.1:8360/api/'

const api = {
  // 首页数据接口
  getIndexData: (r) => request.get('index/index', null, {
    baseURL: ApiRootUrl
  }),
  // 分类目录全部分类数据接口
  getCatalogList: (r) => request.get('catalog/index', null, {
    baseURL: ApiRootUrl
  }),
  // 分类目录当前分类数据接口
  getCatalogCurrent: (paramObj) => request.get('catalog/current', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 使用util的request方法，字符串变量即可
  // 微信登录
  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin',
  // 获取微信统一下单prepay_id
  PayPrepayId: ApiRootUrl + 'pay/prepay',
  // （pay单独使用）获取微信统一下单prepay_id
  PayPrepayIdFunc: (paramObj) => request.get('pay/prepay', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 统计商品总数
  getGoodsCount: (r) => request.get('goods/count', null, {
    baseURL: ApiRootUrl
  }),
  // 获得分类商品列表,条件比较复杂用paramObj接收
  getGoodsList: (paramObj) => request.get('goods/list', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 获得分类数据
  getGoodsCategory: (paramObj) => request.get('goods/category', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 获得商品的详情
  getGoodsDetail: (paramObj) => request.get('goods/detail', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 新品
  getGoodsNew: (r) => request.get('goods/new', null, {
    baseURL: ApiRootUrl
  }),
  // 热门
  getGoodsHot: (r) => request.get('goods/hot', null, {
    baseURL: ApiRootUrl
  }),
  // 商品详情页的关联商品（大家都在看）
  getGoodsRelated: (paramObj) => request.get('goods/related', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 品牌列表
  getBrandList: (paramObj) => request.get('brand/list', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 品牌详情
  getBrandDetail: (paramObj) => request.get('brand/detail', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 获取购物车的数据
  getCartList: (r) => request.get('cart/index', null, {
    baseURL: ApiRootUrl
  }),
  // 添加商品到购物车
  CartAdd: (paramObj) => request.post('cart/add', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 更新购物车的商品
  CartUpdate: (paramObj) => request.post('cart/update', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 删除购物车的商品
  CartDelete: (paramObj) => request.post('cart/delete', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 选择或取消选择商品
  CartChecked: (paramObj) => request.post('cart/checked', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 获取购物车商品件数
  getCartGoodsCount: (r) => request.get('cart/goodscount', null, {
    baseURL: ApiRootUrl
  }),
  // 下单前信息确认
  CartCheckout: (paramObj) => request.get('cart/checkout', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 提交订单
  OrderSubmit: (paramObj) => request.post('order/submit', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 收藏列表
  getCollectList: (paramObj) => request.get('collect/list', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 添加或取消收藏
  CollectAddOrDelete: (paramObj) => request.post('collect/addordelete', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 评论列表
  getCommentList: (paramObj) => request.get('comment/list', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 评论总数
  getCommentCount: (paramObj) => request.get('comment/count', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 发表评论
  CommentPost: (paramObj) => request.post('comment/post', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 专题列表
  getTopicList: (paramObj) => request.get('topic/list', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 专题详情
  getTopicDetail: (paramObj) => request.get('topic/detail', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 相关专题
  TopicRelated: (paramObj) => request.get('topic/related', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 搜索页面数据
  SearchIndex: (r) => request.get('search/index', null, {
    baseURL: ApiRootUrl
  }),
  // 搜索数据
  SearchResult: (r) => request.get('search/result', null, {
    baseURL: ApiRootUrl
  }),
  // 搜索帮助
  SearchHelper: (paramObj) => request.get('search/helper', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 清空搜索历史记录
  ClearSearchHistory: (r) => request.post('search/clearhistory', null, {
    baseURL: ApiRootUrl
  }),
  // 收货地址列表
  getAddressList: (r) => request.get('address/list', null, {
    baseURL: ApiRootUrl
  }),
  // 收货地址详情
  getAddressDetail: (paramObj) => request.get('address/detail', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 保存收货地址
  AddressSave: (paramObj) => request.post('address/save', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 删除收获地址
  AddressDelete: (paramObj) => request.post('address/delete', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 获取区域列表
  getRegionList: (paramObj) => request.get('region/list', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 订单列表
  getOrderList: (r) => request.get('order/list', null, {
    baseURL: ApiRootUrl
  }),
  // 订单详情
  getOrderDetail: (paramObj) => request.get('order/detail', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 取消订单
  OrderCancel: (r) => request.get('order/cancel', null, {
    baseURL: ApiRootUrl
  }),
  // 物流详情
  getOrderExpress: (paramObj) => request.post('order/express', paramObj, {
    baseURL: ApiRootUrl
  }),
  // 足迹列表
  getFootprintList: (r) => request.get('footprint/list', null, {
    baseURL: ApiRootUrl
  }),
  // 删除足迹
  FootprintDelete: (paramObj) => request.post('footprint/delete', paramObj, {
    baseURL: ApiRootUrl
  })
}

export default api
