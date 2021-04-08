/* eslint-disable no-useless-escape */
/**
 * b站专用视频下载助手
 */
import bilibiliModel from '@/models/bilibili'
import { PROTOCOL } from '@/configs/bilibili'

const regexp = new RegExp(`^${PROTOCOL}:\/\/`)

export const BILIBILI_PROTOCOL = PROTOCOL

/**
 * 获取bvid
 * @param {*} sourceUrl
 * @returns
 */
export const decodeUrl = async function (sourceUrl = '') {
  const bvid = sourceUrl.replace(regexp, '').replace('.mp4', '')
  const cid = await bilibiliModel.getCid(bvid)
  return cid
}
