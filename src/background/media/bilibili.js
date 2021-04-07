/* eslint-disable no-useless-escape */
/**
 * b站专用视频下载助手
 */
import { PROTOCOL } from '@/configs/bilibili'
import { protocol } from 'electron'

const regexp = new RegExp(`^${PROTOCOL}:\/\/`)

/**
 * 获取bvid
 * @param {*} sourceUrl
 * @returns
 */
export const decodeUrl = function (sourceUrl = '') {
  const bvid = sourceUrl.replace(regexp, '')
  return bvid
}

export default function () {
  protocol.registerStringProtocol(PROTOCOL, (request, callback) => {
    const bvid = request
    callback(bvid)
  })
}
