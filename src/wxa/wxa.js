 /**
 * @desc 数据统计和错误上报
 */
/* eslint-disable one-var */
import defaultConfig from './config'
import { eventMap, constMap } from './constant'
import { wxaUtils } from './utils'
import wxaData from './data'
import report from './report'
import { interceptWxfunc, otherReportInit } from './intercept'

let wxaConfig
const WXA = {
  appStartTime: wxaUtils.getTime(),
  sendFlag: false, // 数据上传开关
  init (config = {}) {
    if (wx.wxa) {
      return wxaUtils.log(1001)
    }
    wxaConfig = Object.assign({}, defaultConfig, config)
    wxaUtils.setBasicInfo()
    // 拦截微信相关方法
    interceptWxfunc()
    otherReportInit()
    // 注入 WXA
    wx.wxa = WXA
    console.log('wxa init success...')
  },
  _collect (type, data) {
    if (!wxaUtils.isValidDataType(data)) {
      return wxaUtils.log(1002)
    }
    const sendData = wxaUtils.composeData(type, data)
    sendData['offset_time'] = wxaUtils.getTime() - this.appStartTime;
    wxaUtils.logInfo('数据跟踪.....', sendData)
    wxaData.addData(type, sendData)
  },
  // 事件跟踪
  track (data) {
    this._collect(constMap.track, data)
  },
  errorReport (data) {
    this._collect(constMap.error, data)
  },
  performanceReport (data) {
    if (data.url) {
        let pos = data.url.indexOf('?');
        if (pos > 0) {
            let query = data.url.substring(pos);
            if (query.length > 33) {
                query = query.substring(0, 33) + "...";
                data.url = data.url.substring(0, pos) + query;
            }
        }
    }
    this._collect(constMap.performance, data)
  },
  // 开始上报
  start () {
    this.sendFlag = true
    // 定时上报
    wxaData.reportTimer = setInterval(function() {
      report.sendData()
    }, wxaConfig.intervalTime * 1000)
    this.track({event: eventMap.appSystemInfo})
    console.log('wxa  started...')
  },
  // 停止上报
  stop () {
    this.sendFlag = false
    clearInterval(wxaData.reportTimer)
  },
  setUserInfo (data) {
    wxaData.userInfo = data
  }
}

export default WXA
