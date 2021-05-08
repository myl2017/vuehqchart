import request from '@/utils/request'

/**
 * 现货和BTC, 币种列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getCurrencyList(data) {
  return request.POST('/api/currency/list', 'POST', data)
}

/**
 * 获取自选列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getCollectList(data) {
  return request.POST('/api/collect/list', 'POST', data)
}

/**
 * 获取合约列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getContractList(data) {
  return request.POST('/api/contract/list', 'POST', data)
}

/**
 * 资讯列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getInfoList(data) {
  return request.POST('/api/news/roll', 'POST', data)
}

/**
 * 获取配置信息
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getConfig(data) {
  return request.POST('/api/sysCfg/getValue', 'POST', data)
}

/**
 * 获取热门币种
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getHotCurrency(data) {
  return request.POST('/api/currency/hot', 'POST', data)
}

/**
 * 获取板块分类列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getPlateClassifyList(data) {
  return request.POST('/api/currency/platelist', 'POST', data)
}

/**
 * 获取某个板块的币种
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getPlateListById(data) {
  return request.POST('/api/currency/platedetail', 'POST', data)
}
