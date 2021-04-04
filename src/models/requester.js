/**
 * 支持通过electron自动代理的
 */
import Axios from 'axios'
import { PROXY_PROTOCOL } from '@/configs/protocol'

const requester = Axios.create()
requester.interceptors.request.use(req => {
  console.log(req, PROXY_PROTOCOL)
})

export default requester
