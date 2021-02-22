/**
 * @desc 工具函数
 */
import http from './http'
import wxaConfig from './config'
import wxaData from './data'
import { eventMap, constMap } from './constant'

const wxaUtils = {
  getTime() {
    return (new Date()).getTime()
  },
  getPagePath() {
    try {
      /* global getCurrentPages */
      const routers = getCurrentPages()
      let currRoute = '/'
      routers.length > 0 && (currRoute = routers.pop().route)
      const index = currRoute.lastIndexOf('/')
      if (index > 0) {
        currRoute = currRoute.substring(index + 1)
      }
      return currRoute
    } catch (e) {
      console.log('get current page path error:' + e)
    }
  },
  getSystemInfo () {
    const a = wx.getSystemInfoSync()
    return a
  },
  getNetworkType (callback) {
    wx.getNetworkType({
      success(b) {
        callback(b.networkType)
      }
    })
  },
  setBasicInfo () {
    let systemInfo = wxaUtils.getSystemInfo()
    wxaUtils.getNetworkType(function (res) {
      wxaData.systemInfo.network = res
    })
    wxaData.systemInfo = systemInfo
    // 监听网络变化
    wx.onNetworkStatusChange(function (e) {
      wxaData.systemInfo.network = e.networkType
    })
  },
  send (url, data) {
    delete data.url
    return http.post({url, data})
  },
  log(errno, msg) {
    msg = msg || ''
    const ERRORMAP = {
      1001: 'WXA is already defined, Fail to start!',
      1002: 'fail to track, track function only allow one param, which type must be a object or  a array!'
    }
    ERRORMAP[errno] && console.warn(['Error(SMA):', ERRORMAP[errno], '(CODE' + errno + ')'].join(' '))
  },
  logInfo () {
    if (wxaConfig.debug) {
      if (typeof console === 'object' && console.log) {
        try {
          return console.log.apply(console, arguments)
        } catch (e) {
          console.log(arguments[0])
        }
      }
    }
  },
  logData () {
    wxaUtils.logInfo('trackData:', wxaData.trackData)
    wxaUtils.logInfo('errorData:', wxaData.errorData)
    wxaUtils.logInfo('performanceData:', wxaData.performanceData)
  },
  composeData (type, data) {
    const isArray = wxaUtils.isArray(data)
    let resData = []
    let mapData = isArray ? data : [data]
    resData = mapData.map((item) => {
      return {
        timestamp: wxaUtils.getTime(),
        type,
        event: item.event,
        network: wxaData.systemInfo.network || 'unknown',
        systemInfo: item.event === eventMap.appSystemInfo ? wxaData.systemInfo : '',
        pagePath: ((delete item.event), wxaUtils.getPagePath()),
        data: {
          ...item
        }
      }
    })
    if (data.isRealTime) {
      resData.isRealTime = true
    }
    return resData
  },
  composeErrorData (type, data) {},
  isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  },
  isArray (o) {
    return Object.prototype.toString.call(o) === '[object Array]'
  },
  isValidDataType (d) {
    return wxaUtils.isObject(d) || wxaUtils.isArray(d)
  },
  getRequestUrl (type) {
    let url = ''
    switch (type) {
      case constMap.track:
        url = wxaConfig.trackUrl
        break
      case constMap.error:
        url = wxaConfig.errorUrl
        break
      case constMap.performance:
        url = wxaConfig.performanceUrl
        break
      default:
    }
    return url
  }
}
export {
  wxaUtils
}
