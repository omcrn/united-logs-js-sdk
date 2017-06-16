/**
 * Created by zura on 6/16/17.
 */


(function (win) {

  class UnitedLogs {
    private levels: Array = ['warning', 'info', 'error', 'success'];
    private key: String;
    private environment: String;
    private domain: String;

    static LEVEL_WARNING = 'warning';
    static LEVEL_ERROR = 'error';
    static LEVEL_INFO = 'info';
    static LEVEL_SUCCESS = 'success';


    constructor(key: String, environment: String, levels: Array = null, domain: String = null) {

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
      this.domain = domain ? (domain + '/api/v1/log') : `${UNITED_LOGS_DOMAIN}/api/v1/log`;
    }

    public error(message: String, category: String, $params: any = null) {
      return this.sendLog(UnitedLogs.LEVEL_ERROR, message, category, $params);
    }

    public success() {

    }

    public info() {

    }

    public warning() {

    }

    private sendLog(level: String, message: String, category: String, params) {
      if (this.levels.indexOf(level) === -1) {
        return false;
      }

      let data = {
        'api': this.key,
        'environment': this.environment,
        'message': message,
        'category': category,
        'params': params
      };

      this.sendRequest(`${this.domain}/${level}`, 'POST', data)

    }

    private sendRequest(url: String, method: String, data:Object = {}, async:boolean = true) {
      let xhttp,
        callbacks = [],
        ret = {
          finished: function (fn) {
            callbacks.push(fn);
            return ret;
          }
        };
      if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          let res = JSON.parse(xhttp.responseText);
          for (let i = 0; i < callbacks.length; i++) {
            if (callbacks[i] && typeof callbacks[i] === 'function') {
              callbacks[i](xhttp.status, res);
            }
          }
        }
      };
      xhttp.open(method, url, async);
      xhttp.send(data);
      return ret;
    }
  }

  win.UnitedLogs = UnitedLogs;

})(window);