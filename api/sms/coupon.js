
import request from '@/utils/request'

export  default function getCouponList() {
  return request({
    url: '/mall-sms/api/v1/coupon/page',
    method: 'get'
  })
}
