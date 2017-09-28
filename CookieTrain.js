import request from "request-promise";

class CookieTrain {
    constructor(url, authorization) {
        this.url = url;
        this.authorization = authorization;
    }

    execute(type, payload) {
        return request({
            url: this.url + '/api/resource/' + type + '/invoke',
            method: 'post',
            body: payload,
            json: true,
            headers: {
                Authorization: this.authorization
            }
        }).then(data => {
            if(data.statusCode === 200) {
                return JSON.parse(data.body);
            } else {
                throw new Error(data.statusCode);
            }
        })
    }

    withCookies(type, cb) {
        let cookies = null;

        return request({
            method: 'get',
            url: this.url + '/api/resource/' + type + '/session',
            json: true,
            headers: {
                Authorization: this.authorization
            }
        }).then(_cookies => {
            cookies = _cookies;
            return cb(cookies);
        }).finally(() => {
            if (cookies) {
                request({
                    method: 'post',
                    url: this.url + '/api/resource/' + type + '/register',
                    body: cookies,
                    json: true,
                    headers: {
                        Authorization: this.authorization
                    }
                });
            }
        });
    }
}

export default CookieTrain;
