'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieTrain = function () {
    function CookieTrain(url, authorization) {
        _classCallCheck(this, CookieTrain);

        this.url = url;
        this.authorization = authorization;
    }

    _createClass(CookieTrain, [{
        key: 'execute',
        value: function execute(type, payload) {
            return (0, _requestPromise2.default)({
                url: this.url + '/api/resource/' + type + '/invoke',
                method: 'post',
                body: payload,
                json: true,
                headers: {
                    Authorization: this.authorization
                }
            }).then(function (data) {
                if (data.statusCode === 200) {
                    return JSON.parse(data.body);
                } else {
                    throw new Error(data.statusCode);
                }
            });
        }
    }, {
        key: 'withCookies',
        value: function withCookies(type, cb) {
            var _this = this;

            var cookies = null;

            return (0, _requestPromise2.default)({
                method: 'get',
                url: this.url + '/api/resource/' + type + '/session',
                json: true,
                headers: {
                    Authorization: this.authorization
                }
            }).then(function (_cookies) {
                cookies = _cookies;
                return cb(cookies);
            }).finally(function () {
                if (cookies) {
                    (0, _requestPromise2.default)({
                        method: 'post',
                        url: _this.url + '/api/resource/' + type + '/register',
                        body: cookies,
                        json: true,
                        headers: {
                            Authorization: _this.authorization
                        }
                    });
                }
            });
        }
    }]);

    return CookieTrain;
}();

exports.default = CookieTrain;