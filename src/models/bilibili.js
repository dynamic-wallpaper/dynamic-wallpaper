/* eslint-disable no-unused-vars */
/**
 * b站接口
 */
import axios from 'axios'
const requester = axios.create({
  baseURL: 'https://api.bilibili.com'
})

requester.interceptors.response.use((response) => {
  return response.data
})

/**
 * 获取某个人的投稿视频
 * @param {number} mid
 * @param {number} pageNumber
 * @returns
 */
export function getUserVideos (mid, pageNumber = 1) {
  return requester.get('/x/space/arc/search', {
    params: {
      mid,
      pn: pageNumber,
      ps: 30
    }
  })
}

/**
 * 获取bvid，不过只会获取最后一p的
 * @todo 获取宽比高大的那p
 * @param {string} bvid
 */
export function getCid (bvid) {
  return requester.get('/x/player/pagelist', {
    params: {
      bvid
    }
  })
    .then(({ data }) => {
      /**
         * 获取分辨率
         * @todo 根据分辨率来获取最佳的那个p
         */
      const first = data[0]
      return first.cid
    })
}

/**
 * 获取下载信息
 * @see https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/videostream_url.md
 * @param {*} bvid
 * @param {*} cid
 * @param {*} quality
 * @param {*} headers
 * @returns
 */
export function getDownloadInfo ({ bvid, cid, quality }, headers) {
  return requester.get('/x/player/playurl', {
    headers,
    params: {
      bvid,
      cid,
      fourk: 0, // 1为支持4k，解码似乎跟不上
      fnval: 16, // dash模式
      qn: quality
    }
  })
    .then(({ data }) => {
      // 目前只下载视频不考虑音频
      const { dash } = data
      const video = dash.video[0]
      const audio = dash.audio[0]
      return {
        video,
        audio
      }
    })
}

/**
 * 获取本人信息
 * @param {*} cookie
 * @returns
 */
export function getMyInfo () {
  return requester.get('/x/space/myinfo')
}

/**
 * 获取用户创建的收藏夹
 * @param {number} mid
 * @returns
 */
export function getUserCreatedFavFolder (mid) {
  return requester.get('/x/v3/fav/folder/created/list-all', {
    params: {
      up_mid: mid,
      type: 2
    }
  })
    .then(({ data }) => data.list)
}

/**
 * 批量获取指定收藏id的内容
 * @param {number} mid 目标收藏夹mlid（完整id）
 * @returns
 */
export function getFavResources (mid, pageNumber = 1) {
  return requester.get('/x/v3/fav/resource/list', {
    params: {
      media_id: mid,
      pn: pageNumber,
      ps: 10,
      platform: 'web'
    }
  })
}

export default {
  getUserVideos,
  getCid,
  getDownloadInfo,
  getMyInfo,
  getUserCreatedFavFolder,
  getFavResources
}
