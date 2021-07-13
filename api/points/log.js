import request from '@/utils/request/index'

// api地址
const api = {
  list: 'points.log/list'
}

// 积分明细列表
export const list = (param) => {
  return request.get(api.list, param,{header:{'Access-Token': 'a17c59b54d5f806421f3d57d6db803cd'}})
}
