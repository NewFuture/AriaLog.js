import { log, init, telemetry, flush } from "./logger";

/**
 * 配置
 */
const ARIA_SCRIPT = document.getElementById('ARIA-LOG');
console.assert(!!ARIA_SCRIPT, 'the element with id="ARIA-LOG" NOT exist in this document');

const CONFIG = document.getElementById('ARIA-LOG').dataset;

const TOKEN = CONFIG.token;
const LEVEL = (CONFIG.level || 'warn').toLocaleLowerCase();
const CORRELATION_ID = CONFIG.correlation || ((new Date).getTime() + '-' + Math.random());
const APP_NAME = CONFIG.appname || location.hostname;
const LOG_TABLE = (CONFIG.table || APP_NAME).replace(/[^\w\d]/g, '');
const VERBOSE = 'debug' in CONFIG ? CONFIG['debug'].toLowerCase() === "true" : true;

console.assert(TOKEN && TOKEN.length > 0, 'data-token="token string" MUST have an value');
console.assert(LOG_TABLE.length >= 4, 'the table name MUST be 4-100 alphanumeric chars');


/**
 * 日志级别
 */
enum LogLevel {
    all = 0,
    trace = 10,
    debug = 20,
    info = 400,
    warn = 500,
    error = 600,
    critical = 700,
    alert = 800,
}
/**
 * 原始console API
 */
const _originConsole: Console | any = {
    log: console.log
};

/**
* @param {string} level 日志级别小写
* @param {string} action 日志关键action或者位置
* @param {any?} content 内容可以是string,数字或者Object
*/
function Log(level: string, action: string, content?: any, attrs?: any) {
    var data: { [key: string]: any } = {
        action: action,
        title: document.title,
        url: document.URL
    }
    for (var key in attrs) {
        data[key] = attrs[key];
    }
    data.content = typeof content === 'object' ? JSON.stringify(content) : content;
    if (level === "telemetry") {
        telemetry(data);
    } else if (!LEVEL || (LogLevel[level] >= LogLevel[LEVEL])) {
        data.level = level;
        log(data);
    }
};



/**
 * 初始化设置
 */
init(TOKEN, APP_NAME, LOG_TABLE, {
    correlationId: CORRELATION_ID,
    userId: CONFIG.userid,
    subscribeId: CONFIG.subid,
});

/**
 * 日志接口覆盖
 */
console.log = function () {
    if (VERBOSE) {
        _originConsole.log.apply(console, arguments);
    }
    if (arguments.length > 1 && arguments.length < 3) {
        Log.apply(null, arguments);
    }
};

/**
 * 接口扩展
 */
['info', 'debug', 'warn', 'error'].forEach(key => {
    _originConsole[key] = console[key];
    console[key] = function (...args) {
        if (VERBOSE) {
            _originConsole[key].apply(null, args);
        }
        if (args.length && args.length < 3) {
            args.unshift(key);
            Log.apply(Log, args);
        }
    }
});

//关闭前清空
if (CONFIG.flush === "true") {
    window.onbeforeunload = flush;
}

//捕获全局错误

window.onerror = function (msg, url, line, col, error) {
    Log('error', msg as string, error, {
        file: url,
        line: line,
        col: col,
    })
}

// callback
if (CONFIG.init) {
    window[CONFIG.init]();
}