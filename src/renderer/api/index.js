import request from '@/utils/request'

/**
 * 公告列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getAfficheList(data) {
  return request.POST('/api/affiche/list', 'POST', data)
}

/**
 * 添加意见反馈
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function addSuggestion(data) {
  return request.POST('/api/feedback/create', 'POST', data)
}

/**
 * 获取个人信息
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function getUserInfo(data) {
  return request.POST('/api/user/information', 'POST', data)
}

/**
 * 修改个人信息
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function updateUserInfo(data) {
  return request.POST('/api/user/reviseInfo', 'POST', data)
}

/**
 * 绑定手机
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function bindPhone(data) {
  return request.POST('/api/user/bindPhone', 'POST', data)
}

/**
 * 指标列表
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function getIndexTree(data) {
  return request.POST('/api/quota/list', 'POST', data)
}

/**
 * 新建指标
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function createIndex(data) {
  return request.POST('/api/quota/create', 'POST', data)
}

/**
 * 获取编辑详情
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function getDetail(data) {
  return request.POST('/api/quota/detail', 'POST', data)
}

/**
 * 修改自定义指标
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function editIndex(data) {
  return request.POST('/api/quota/edit', 'POST', data)
}

/**
 * 删除指标
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function deleteIndex(data) {
  return request.POST('/api/quota/delete', 'POST', data)
}

/**
 * 检查名称是否存在
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function validIndexName(data) {
  return request.POST('/api/quota/checkname', 'POST', data)
}

/**
 * 创建笔记
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function createNote(data) {
  return request.POST('/api/note/create', 'POST', data)
}

/**
 * 获取笔记列表
 * @param data
 */
export function getNoteList(data) {
  return request.POST('/api/note/getList', 'POST', data)
}

/**
 * 修改笔记
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function editNote(data) {
  return request.POST('/api/note/edit', 'POST', data)
}

/**
 * 删除笔记
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function deleteNote(data) {
  return request.POST('/api/note/delete', 'POST', data)
}

/**
 * 币种简介
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function getCurrencyIntro(data) {
  return request.POST('/api/currency/introduction', 'POST', data)
}

/**
 * 预警列表
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function getWarnList(data) {
  return request.POST('/api/warning/list', 'POST', data)
}

/**
 * 获取下拉列表
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function getOption(data) {
  return request.POST('/api/currency/getOption', 'POST', data)
}

/**
 * 添加预警
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function addWarn(data) {
  return request.POST('/api/warning/create', 'POST', data)
}

/**
 * 删除预警
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function deleteWarn(data) {
  return request.POST('/api/warning/delete', 'POST', data)
}

/**
 * 修改预警
 * @param data
 * @returns {Promise | Promise<any>}
 */
export function editWarn(data) {
  return request.POST('/api/warning/edit', 'POST', data)
}

/**
 * 资讯详情
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getInfoDetail(data) {
  return request.POST('/api/news/detail', 'POST', data)
}

/**
 * 添加自选
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function createCollect(data) {
  return request.POST('/api/collect/create', 'POST', data)
}

/**
 * 移除自选
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function deleteCollect(data) {
  return request.POST('/api/collect/delete', 'POST', data)
}

/**
 * 获取昨日收盘价
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getYClose(data) {
  return request.POST('/api/sysCfg/getYClose', 'POST', data)
}

/**
 * 全局搜索币种
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getSearch(data) {
  return request.POST('/api/currency/getSearch', 'POST', data)
}

/**
 * 获取usdt和人民币的汇率
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getRate(data) {
  return request.POST('/api/sysCfg/getRate', 'POST', data)
}

/**
 * 获取当前版本信息
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getVersion(data) {
  return request.POST('/api/edition/upgrade', 'POST', data)
}

/**
 * 获取最新通知
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getNotification(data) {
  return request.POST('/api/notice/list', 'POST', data)
}

/**
 * 合约简介
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getContractInfo(data) {
  return request.POST('/api/contract/info', 'POST', data)
}

/**
 * 添加画图
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function addPaintData(data) {
  return request.POST('/api/paint/create', 'POST', data)
}

/**
 * 修改画图
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function editPaint(data) {
  return request.POST('/api/paint/edit', 'POST', data)
}

/**
 * 获取画图
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getPaintList(data) {
  return request.POST('/api/paint/getList', 'POST', data)
}
