import { AWTLogManager, AWTLogger } from '@aria/webjs-sdk';

// AWTLogger logger


let _logger: AWTLogger;
let _token: string;
let _name: string = "logging";
let _table: string;
let _config = {};

function getLogger(): AWTLogger {
    if (!_logger) {
        // _manager = 
        AWTLogManager.initialize(_token);
        _logger = AWTLogManager.getLogger();
        _logger.setContext("AppName", _name);
        _logger.setContext("UserAgent", navigator.userAgent);
        for (var key in _config) {
            _logger.setContext(key, _config[key]);
        }
    }
    return _logger;
}

// export function setToken(token: string): void {
//     _token = token;
// }

// export function setName(name: string): void {
//     _name = name;
// }

export function init(token: string, name: string, table?: string, config?: Object): void {
    _token = token;
    _name = name;
    _table = table;
    for (var key in config) {
        _config[key] = config[key];
    }
}

/**
 * 记录日志
 * @param data -  data to log
 */
export function log(data: any): void {
    return getLogger().logEvent({
        name: _table || _name,
        properties: data,
    });
}

/**
 * 统计数据
 * @param data - data to telemetry
 */
export function telemetry(data): void {
    return getLogger().logEvent({
        name: 'telemetry',
        properties: data
    });
}

export function flush(): boolean {
    if (_logger) {
        AWTLogManager.flushAndTeardown();
        _logger = null;
    }
    return true;
}