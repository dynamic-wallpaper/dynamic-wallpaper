/* eslint-disable node/no-callback-literal */
import { session } from 'electron'

const bilibiliFilter = {
  urls: ['https://api.bilibili.com/*']
}

// const cookie = "447d0d3c%2C1627741667%2Cc9fed*21"

export default function () {
  /**
     * b站请求构造
     */
  session.defaultSession.webRequest.onBeforeSendHeaders(
    bilibiliFilter,
    (details, callback) => {
      details.referrer = 'https://search.bilibili.com'
      details.requestHeaders.Referer = 'https://space.bilibili.com/'
      details.requestHeaders.Origin = 'https://www.bilibili.com'
      callback({ requestHeaders: details.requestHeaders })
    }
  )
}
