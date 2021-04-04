import { protocol } from 'electron'
import { PROXY_PROTOCOL } from '@/configs/protocol'

export default function () {
  protocol.registerFileProtocol(PROXY_PROTOCOL, (request, callback) => {
    //   request
    // const url = request.url.substr(PROXY_PROTOCOL.length + '..')
    callback(JSON.stringify(1))
  })
}
