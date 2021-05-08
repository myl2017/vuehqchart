import request from '@/utils/request'

export function getList(data) {
  return request.POST('http://hqapp.qdever.com/stock/getlist', 'POST', data)
}
