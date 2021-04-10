export const schema = {
  selected: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
        default: ''
      },
      url: {
        type: 'string',
        default: ''
      },
      category: {
        type: 'string',
        default: ''
      }
    }
  },
  openAtLogin: {
    type: 'boolean'
  },
  lastSelectFileDirPath: {
    type: 'string'
  },
  cookie: {
    type: 'string'
  }
}

/**
 * 从schema获取一个store配置
 */
export function getState (targetSchema = schema) {
  return Object.keys(targetSchema).reduce((state, key) => {
    const { type, properties } = targetSchema[key]

    switch (type) {
      case 'object': {
        state[key] = getState(properties)
        break
      }
      case 'boolean': {
        state[key] = false
        break
      }
      case 'number': {
        state[key] = 0
        break
      }
      default: {
        state[key] = ''
        break
      }
    }

    return state
  }, {})
}

export default schema
