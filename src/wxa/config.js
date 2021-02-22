/**
 * @desc 数据统计配置
 */
const wxaConfig = {
  project: 'myMiniProgram', // 项目名称
  trackUrl: '', // 后台数据统计接口
  errorUrl: '',  // 后台错误上报接口
  performanceUrl: '', // 后台性能上报接口
  version: '0.1',
  prefix: '_wxa_',
  priority: ['track', 'performance', 'error'], // 发送请求的优先级，发送时，会依次发送
  useStorage: true, // 是否开启storage缓存
  debug: false, // 是否开启调试（显示log）
  autoTrack: true, // 自动上报 onShow, onHide, 分享等 内置事件
  errorReport: false, // 是否开启错误上报
  performanceReport: false, // 接口性能上报
  maxReportNum: 20, // 当次上报最大条数
  intervalTime: 15,  // 定时上报的时间间隔，单位 s
  opportunity: 'appHide' // pageHide、appHide、上报的时机，二选一（自动开启定时上报）
}
export default wxaConfig
