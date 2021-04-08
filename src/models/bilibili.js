/**
 * b站接口
 */
import axios from 'axios'
import { getHeaders } from '@/configs/bilibili'
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
  },
  /**
   * 获取下载信息
   * @param {*} bvid
   * @param {*} cid
   * @param {*} quality
   * @param {*} headers
   * @returns
   */
  getDownloadInfo (bvid, cid, quality, headers) {
    return requester.get('/x/player/playurl', {
      headers,
      params: {
        bvid,
        cid,
        qn: quality
      }
    })
      .then(res => res.data)
  },
  /**
   * 获取本人信息
   * @param {*} cookie
   * @returns
   */
  getMyInfo (cookie) {
    return requester.get('/x/space/myinfo', {
      headers: getHeaders(cookie)
    })
      .then(res => res.data)
  }
}
