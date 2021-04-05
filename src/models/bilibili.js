/**
 * b站接口
 */
import axios from 'axios'
const requester = axios.create({
  baseURL: 'https://api.bilibili.com'
})

export default {
  getUserVideos (mid) {
    return requester.get('/x/space/arc/search', {
      params: {
        mid
      }
    })
  }
}
