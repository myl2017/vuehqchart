import Cookies from 'js-cookie'
import eventBus from './bus'

const TokenKey = 'Admin-Token'

export function getToken() {
  let token = null
  if (window.localStorage.getItem('SYS_Token')) {
    token = JSON.parse(window.localStorage.getItem('SYS_Token')).token
  } else {
    eventBus.$on('userInformation', (value) => {
      token = value.token
    })
  }
  return token
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  if (window.localStorage.getItem('SYS_Token')) {
    window.localStorage.removeItem('SYS_Token')
    return true
  } else {
    return false
  }
  // return Cookies.remove(TokenKey)
}
