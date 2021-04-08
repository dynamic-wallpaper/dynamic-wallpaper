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
  getMyInfo (cookie) {
    return requester.get('/x/space/myinfo', {
      headers: getHeaders(cookie)
    })
      .then(res => res.data)
  }
}
