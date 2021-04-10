/* eslint-disable no-useless-escape */
/**
 * b站专用视频下载助手
 */
import bilibiliModel from '@/models/bilibili'
import { PROTOCOL, getHeaders, getDownloadHeaders } from '@/configs/bilibili'
import { store } from '@/store/index'

const regexp = new RegExp(`^${PROTOCOL}:\/\/`)

export const BILIBILI_PROTOCOL = PROTOCOL

/**
 * 获取bvid
 * @param {*} sourceUrl
 * @returns
 */
export const getDownloadConfig = async function (sourceUrl = '') {
  const cookie = store.get('cookie')
  const bvid = sourceUrl.replace(regexp, '').replace('.mp4', '')
  const cid = await bilibiliModel.getCid(bvid)
  const downloadInfo = await bilibiliModel.getDownloadInfo({ bvid, cid }, getHeaders(cookie))
  const headers = getDownloadHeaders(cookie, bvid)
  return {
    headers,
    url: downloadInfo.video.baseUrl
  }
}

export default {
  getDownloadConfig,
  BILIBILI_PROTOCOL
}
