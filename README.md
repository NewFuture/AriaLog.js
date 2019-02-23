# AriaLog.js

[![Greenkeeper badge](https://badges.greenkeeper.io/NewFuture/AriaLog.js.svg?token=4d38eb48ae4676abd96890c59a5edcbb94f11502921b22c7a79d4454dcd55199&ts=1550894330041)](https://greenkeeper.io/)

## tips

1. 前端数据永远是不可信的
2. 前端日志和统计通常是不完整
3. 尽量减少前端日志的数量
4. 尽量减小前端日志的体积
5. 记录时机**用户操作** 或者 **API返回结果**，在init期间日志接口可能没有覆盖，不会记录

## Feathers
* [x] auto rewrite console interface
* [x] async loading 
* [x] catch global JavaScript error event

## Usage
引入前端日志文件,延迟异步自动注入
```html
<script src="https://newfuture.github.io/AriaLog.js/dist/logger.js"
        data-token="ariaToken"
        data-correlation="CorrelationID"
        data-user  ="用户标识"
        data-appname="AppName"
        data-table="APP写入表名"
        data-level="warn"
        data-debug="true"
        data-flush="false"
        data-init=""
        id="ARIA-LOG"
        async=true
        defer="defer">
</script>
```

| 字段            | 说明           | 要求              |
| --------------- | :------------- | :---------------: |
| data-token      | Aria 链接TOKEN | 必须              |
| data-appname    | app name       | 与table不同时为空 |
| data-table      | 写入表明       | 自动默认appname   |
| data-user       | 用户标识       | 可空              |
| data-correlation | 关联ID         | 可空(自动生成)    |
| data-subid      | 订阅ID         | 可空              |
| data-level      | 日志级别       | 可空(默认`warn`)  |
| data-debug      | 是否打印       | 可空(默认`true`)  |
| data-flush      | 关闭前强制刷新 | 可空(默认`false`) |
| data-init       | 回调函数名     | 可空             |



## log注入
前端log作用：分析,发现和定位页面BUG的

注入方式
```js
/**
* @param {string} level 日志级别小写
* @param {string} action 日志关键action或者位置
* @param {any?} content 内容可以是string,数字或者Object
*/
console.log('{level}','{action}',content)
```

### 快速调用接口
快速调用,两个参数
```js
console.error('actionName1',content)
console.warn('actionName2',content)
console.info('action',content)
console.debug('action',content)
```

| 字段         | 说明        | 来源             |
| ------------ | :---------- | :--------------: |
| action       | 操作        | 参数(字符串)     |
| content      | 内容        | 参数(任意)       |
| userId       | 用户标识    | 预设(可空)       |
| correlationId | 关联ID      | 预设(空自动生成) |
| subscribeId  | 订阅ID      | 预设             |
| appname      | app         | 预设             |
| level        | 日志级别    | 自动判断和过滤   |
| label        | 区分标签    | 自动             |
| userAgent    | UA信息      | 自动生成         |
| url          | 当前连接URL | 自动             |
| trace        | 调用栈      | ?                |


### telemetry注入
统计用户数据(不一定100%覆盖)
```js
console.log('telemetry','action',content)
```

| 字段        | 说明        | 来源         |
| ----------- | :---------- | :----------: |
| action      | 操作        | 参数(字符串) |
| content     | 内容        | 参数设置     |
| appname     | app         | 预设         |
| userId      | 用户标识    | 预设         |
| userAgent   | UA信息      | 自动生成     |
| url         | 当前连接URL | 自动         |
| subscribeId | 订阅ID      | 预设         |
