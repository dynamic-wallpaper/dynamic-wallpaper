/**
 * b站相关配置
 */

export const UP = {
  鹿鸣: 488836173,
  原神: 401742377,
  动态壁纸研究院: 5838658
}

export const QUALITY = {
  '240P': 6,
  '360P': 16,
  '480P': 32,
  '720P': 64,
  '720P60': 74,
  '1080P': 80,
  '1080P+': 112,
  '1080P60': 116,
  '4K': 120
}

export const PROTOCOL = 'bilibili'

export const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:56.0) Gecko/20100101 Firefox/56.0'

export const LOGIN_URL = 'https://passport.bilibili.com/ajax/miniLogin/minilogin'

export const getHeaders = function (cookie = '') {
  return {
    'User-Agent': UA,
    Cookie: cookie
  }
}

export const getDownloadHeaders = function (cookie, bvid) {
  return {
    'User-Agent': UA,
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Range: 'bytes=0-',
    'Content-Type': 'application/octet-stream',
    Referer: `https://www.bilibili.com/video/${bvid}/`,
    Origin: 'https://www.bilibili.com',
    Connection: 'keep-alive',
    Cookie: cookie
  }
}
