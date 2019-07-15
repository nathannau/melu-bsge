'use strict';

var $ = require("jquery");

class Api {

    constructor() {
        this.token = null;
    }

    _call(method, path, data, settings = {}) {
        var headers = settings.headers || {};
        console.log(this.token)
        if (this.token)
            headers.Authorization = 'Bearer ' + this.token
        else
            delete headers.Authorization;
//        headers.Authorization = this.token ? 'Bearer ' + this.token : ''

        if (method.toUpperCase()=='GET')
            $.extend(settings, {
                url: path,
                data: data,
                dataType: 'json',
                method: method,
                headers : headers
            });
        else
            $.extend(settings, {
                url: path,
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                method: method,
                headers : headers
            })

        $.ajax(settings);
    }

    login(pwd) {
        var self = this;
        this._call('POST', '/api/admin/login', {
            password: pwd
        }, { 
            success: function(data) {
                self.token = (data.status!='success') ? null : data.token;

                console.log( 'success', data);
            },
        });
    }

    test() {
        var self = this;
        this._call('GET', '/api/admin/test', { a:'aa', b:2}, {
            success: function(data) {

                console.log( 'success', data);
            },
        });

    }

    display() {
        alert('cool !');
        console.log($);
    }


}


module.exports = new Api();