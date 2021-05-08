import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.baseURL = 'http://im-admin.tester.qdever.com/'
// axios.defaults.baseURL = 'http://admin.dchats.net/'
// axios.defaults.baseURL = 'http://hqapp.qdever.com/'
axios.defaults.baseURL = ' https://market.newbt.cn'
// axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
  timeout: 600000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = store.getters.token// 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 1 && res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

service.GET = function GET(url, type = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      url: url,
      method: type,
      params: data,
      validateStatus(status) {
        return (status >= 200 && status < 300) || status === 400
      },
      headers: { 'cache-control': 'no-cache', 'content-type': 'application/json' }
    }
    axios(options).then((res) => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        Message.error(res.data.msg)
        reject(res.data)
      }
    }).catch((err) => {
      console.log(err)
      Message.error('网络异常')
      reject({ mssage: '网络异常' })
    })
  })
}

service.POST = function POST(url, type = 'POST', data = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      url: url,
      method: type,
      data: data,
      transformRequest: [function(data) {
        let formData = ''
        for (var field in data) {
          formData += encodeURIComponent(field) + '=' + encodeURIComponent(data[field]) + '&'
        }
        return formData.substring(0, formData.length - 1)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus(status) {
        return (status >= 200 && status < 300) || status === 400
      }
    }
    axios(options).then((res) => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        Message.error(res.data.msg)
        reject(res.data)
      }
    }).catch((err) => {
      console.log(err)
      Message.error('网络异常')
      reject({ mssage: '网络异常' })
    })
  })
}

export default service
