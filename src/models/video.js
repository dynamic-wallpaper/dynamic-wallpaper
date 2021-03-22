/**
 * 视频壁纸
 */
import axios from 'axios'
import { DEFAULT_SOURCE } from '@/configs/source'
import { VIDEO_WALLPAPER } from '@/configs/resource'

/**
 * 获取本地是否已下载
 * @returns
 */
export async function getCategories () {
  const url = VIDEO_WALLPAPER[DEFAULT_SOURCE]
  const { data } = await axios.get(`${url}/index.json`)
  return data.map(({ name, videos }) => ({
    key: name,
    label: name,
    value: videos.map(video => ({
      value: video.url,
      label: video.name,
      downloadUrl: `${'https://media.githubusercontent.com/media/dynamic-wallpaper/video-wallpaper/main'}${video.url}`,
      thumbnail: `${url}${video.cover}`
    }))
  }))
}

export default {
  getCategories
}
