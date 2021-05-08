/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 手机号码 */
export function validatePhoneNumber(str) {
  // const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  const reg = /^1[0-9]{10}$/
  return reg.test(str)
}

/* 电子邮箱 */
export function validateEmail(str) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(str)
}

/* 邮编 */
export function validateZipCode(str) {
  const reg = /^[1-9][0-9]{5}$/
  return reg.test(str)
}

/* 身份证 */
export function validateIDCard(str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}

/* 银行卡号 15位或者16位或者19位 */
export function validateBank(str) {
  const reg = /^([1-9]{1})(\d{14}|\d{18}|\d{15})$/
  return reg.test(str)
}

/* 密码验证的正则表达式 (6-16位字母和数字组合) */
export function validatePassword(str) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
  return reg.test(str)
}

/* 密码验证的正则表达式 (4-16位英文、数字组合) */
export function validateName(str) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,16}$/
  return reg.test(str)
}

/* qq号码正则表达式 */
export function validateQQ(str) {
  const reg = /^[1-9][0-9]{4,10}$/gim
  return reg.test(str)
}

/* 正整数、浮点数保留两位正则表达式 */
export function validateNums(str) {
  const reg = /(^[0-9]{1,5}$)|(^[0-9]{1,5}[\.]{1}[0-9]{1,2}$)/
  return reg.test(str)
}


/* 数字和小数点正则表达式 */
export function validateNumber(str) {
  const reg = /^\d+$|^\d*\.\d+$/g
  return reg.test(str)
}
