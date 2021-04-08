/**
 * b站接口
 */
import axios from 'axios'
const requester = axios.create({
  baseURL: 'https://api.bilibili.com'
})

export default {
  getUserVideos (mid, pageNumber = 1) {
    return requester.get('/x/space/arc/search', {
      params: {
        mid,
        pn: pageNumber,
        ps: 30
      }
    })
      .then(res => res.data)
  },
  /**
   * 获取bvid，不过只会获取最后一p的
   * @param {string} bvid
   */
  getCid (bvid) {
    requester.get('/x/player/pagelist', {
      params: {
        bvid
      }
    })
      .then(res => {
        console.log(res.data)
      })
  }
}
