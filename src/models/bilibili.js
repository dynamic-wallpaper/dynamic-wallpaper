/**
 * b站接口
 */
import requester from './requester'
// const requesterInstance = requester.create({
//   baseURL: 'https://api.bilibili.com',
//   transformRequest (data) {
//     console.log(data)
//     return data
//   }
// })

export default {
  search (keyword = '') {
    return requester.get('https://api.bilibili.com/x/web-interface/search/all/v2', {
      params: {
        keyword: encodeURIComponent(keyword)
      }
    })
  }
}
