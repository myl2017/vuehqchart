import request from '@/utils/request'

export function login_back(username, password) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 获取主机列表
 * @param data
 * @returns {*|Promise|Promise<any>}
 */
export function getHostList(data) {
  return request.POST('/api/auth/hostList', 'POST', data)
}

/**
 * 手机号注册
 * @param data
 * @returns {Promise<any>}
 */
export function phoneRegister(data) {
  return request.POST('/api/auth/phoneregister', 'POST', data)
}

/**
 * 用户名注册
 * @param data
 * @returns {Promise<any>}
 */
export function userNameRegister(data) {
  return request.POST('/api/auth/usernameregister', 'POST', data)
}

/**
 * 获取短信验证码
 * @param data
 * @returns {Promise<any>}
 */
export function getSMSVerificaCode(data) {
  return request.POST('/api/auth/code', 'POST', data)
}

/**
 * 登录功能
 * @param data
 * @returns {Promise<any>}
 */
export function login(data) {
  return request.POST('/api/auth/login', 'POST', data)
}

/**
 * 找回密码
 * @param data
 * @returns {Promise<any>}
 */
export function retrievePass(data) {
  return request.POST('/api/auth/findBackPassword', 'POST', data)
}
