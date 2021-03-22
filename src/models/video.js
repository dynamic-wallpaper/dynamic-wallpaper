/**
 * 视频壁纸
 */
import axios from 'axios'
import SOURCE from '@/configs/source'
import { VIDEO_WALLPAPER } from '@/configs/resource'

/**
 * 获取本地是否已下载
 * @returns
 */
export async function getCategories () {
  const url = VIDEO_WALLPAPER[SOURCE.JSDELIVR]
  const { data } = await axios.get(`${url}/index.json`)
  return data.map(({ name, videos }) => ({
    key: name,
    label: name,
    value: videos.map(video => ({
      value: video.url,
      label: video.name,
      downloadUrl: `${url}${video.url}`,
      thumbnail: `${url}${video.cover}`
    }))
  }))
}

export default {
  getCategories
}
