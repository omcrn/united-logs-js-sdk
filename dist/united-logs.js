/**
 * Created by zura on 6/16/17.
 */
(function (win) {
    var UnitedLogs = (function () {
        function UnitedLogs(key, environment, levels, domain) {
            if (levels === void 0) { levels = null; }
            if (domain === void 0) { domain = null; }
            this.levels = ['warning', 'info', 'error', 'success'];
            if (!key) {
                console.error('API Key not specified');
            }
            if (!environment) {
                console.error('Environment not specified');
            }
            this.key = key;
            this.environment = environment;
            if (levels !== null) {
                this.levels = levels;
            }
            if (domain === null && UNITED_LOGS_DOMAIN) {
                console.error('Please define the domain as global variable with name UNITED_LOGS_DOMAIN or specify it when constructing UnitedLogs object.');
            }
            this.domain = domain ? (domain + '/api/v1/log') : UNITED_LOGS_DOMAIN + "/api/v1/log";
        }
        UnitedLogs.prototype.error = function (message, category, $params) {
            if ($params === void 0) { $params = null; }
            return this.sendLog(UnitedLogs.LEVEL_ERROR, message, category, $params);
        };
        UnitedLogs.prototype.success = function () {
        };
        UnitedLogs.prototype.info = function () {
        };
        UnitedLogs.prototype.warning = function () {
        };
        UnitedLogs.prototype.sendLog = function (level, message, category, params) {
            if (this.levels.indexOf(level) === -1) {
                return false;
            }
            var data = {
                'api': this.key,
                'environment': this.environment,
                'message': message,
                'category': category,
                'params': params
            };
            this.sendRequest(this.domain + "/" + level, 'POST', data);
        };
        UnitedLogs.prototype.sendRequest = function (url, method, data, async) {
            if (data === void 0) { data = {}; }
            if (async === void 0) { async = true; }
            var xhttp, callbacks = [], ret = {
                finished: function (fn) {
                    callbacks.push(fn);
                    return ret;
                }
            };
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest();
            }
            else {
                // code for IE6, IE5
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4) {
                    var res = JSON.parse(xhttp.responseText);
                    for (var i = 0; i < callbacks.length; i++) {
                        if (callbacks[i] && typeof callbacks[i] === 'function') {
                            callbacks[i](xhttp.status, res);
                        }
                    }
                }
            };
            xhttp.open(method, url, async);
            xhttp.send(data);
            return ret;
        };
        return UnitedLogs;
    }());
    UnitedLogs.LEVEL_WARNING = 'warning';
    UnitedLogs.LEVEL_ERROR = 'error';
    UnitedLogs.LEVEL_INFO = 'info';
    UnitedLogs.LEVEL_SUCCESS = 'success';
    win.UnitedLogs = UnitedLogs;
})(window);
