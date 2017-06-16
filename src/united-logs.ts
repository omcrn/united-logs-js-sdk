/**
 * Created by zura on 6/16/17.
 */


(function (win) {

  class UnitedLogs {
    private levels: Array<string> = ['warning', 'info', 'error', 'success'];
    private key: string;
    private environment: string;
    private domain: string;

    static LEVEL_WARNING = 'warning';
    static LEVEL_ERROR = 'error';
    static LEVEL_INFO = 'info';
    static LEVEL_SUCCESS = 'success';


    constructor(key: string, environment: string, levels: Array<string> = null, domain: string = null) {

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

    public error(message: string, category: string, $params: any = null) {
      return this.sendLog(UnitedLogs.LEVEL_ERROR, message, category, $params);
    }

    public success() {

    }

    public info() {

    }

    public warning() {

    }

    private sendLog(level: string, message: string, category: string, params: any) {
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

    private sendRequest(url: string, method: string, data: Object = {}, async: boolean = true) {
      let xhttp: XMLHttpRequest,
        callbacks: Array<Function> = [],
        ret = {
          finished: function (fn: Function) {
            callbacks.push(fn);
            return ret;
          }
        };
      if (XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
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