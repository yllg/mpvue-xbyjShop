/**
 * 支付相关服务
 */
import wx from 'wx';
import api from '@/utils/api';
import util from '@/utils/util';
/**
 * 判断用户是否登录
 */
function payOrder (orderId) {
  return new Promise(function (resolve, reject) {
    // console.log('api.PayPrepayId', api.PayPrepayId);
    util.request(api.PayPrepayId, {
      orderId: orderId
    }).then((res) => {
      // console.log('请求接口pay/prepay后的结果', res)
      if (res.errno === 0) {
        const payParam = res.data;
        // console.log('payParam这些应该是后台计算好的签名等', payParam.timeStamp)
        const timeStampParam = payParam.timeStamp ? payParam.timeStamp : '';
        const nonceStrParam = payParam.nonceStr ? payParam.nonceStr : '';
        const packageParam = payParam.package ? payParam.package : '';
        const signTypeParam = payParam.signType ? payParam.signType : '';
        const paySignParam = payParam.paySign ? payParam.paySign : '';
        wx.requestPayment({
          'timeStamp': timeStampParam,
          'nonceStr': nonceStrParam,
          'package': packageParam,
          'signType': signTypeParam,
          'paySign': paySignParam,
          'success': function (res) {
            resolve(res);
          },
          'fail': function (res) {
            reject(res);
          },
          'complete': function (res) {
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    });
  });
}

const pay = {
  payOrder
}

export default pay
