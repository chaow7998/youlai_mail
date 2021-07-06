import request from '@/utils/request'

export function list(parentId) {
	return request({
		url: '/mall-pms/app-api/v1/categories',
		method: 'get',
		params: {
			parentId: parentId
		}
	})
}
