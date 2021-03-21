import log from 'electron-log'

if (process.env.NODE_ENV === 'production') {
  Object.assign(console, log.functions)
}
