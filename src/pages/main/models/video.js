/**
 * 视频壁纸
 */
import axios from 'axios'
import SOURCE from '@/configs/source'
import { VIDEO_WALLPAPER } from '@/configs/resource'

export async function getCategories () {
  const url = VIDEO_WALLPAPER[SOURCE.JSDELIVR]
  const { data } = await axios.get(`${url}/index.json`)
  return data.map(({ name, videos }) => ({
    renderer: 'videoRenderer',
    key: name,
    label: name,
    value: videos.map(video => ({
      label: video.name,
      value: `${url}${video.url}`,
      thumbnail: video.cover
    }))
  }))
}

export default {
  getCategories
}
