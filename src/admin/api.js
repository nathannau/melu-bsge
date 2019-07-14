'use strict';

var $ = require("jquery");

class Api {

    constructor() {
        this.token = null;
    }

    _call(method, path, data, settings = {})
    {
        var headers = settings.headers || {};
        headers.Authorization = this.token ? 'Bearer '+this.token : ''

        $.extend(settings, {
            url: path,
            data: data,
            dataType: 'json',
            method: method,
            headers : {}
        })
        
        $.ajax(settings);
    }

    login(pwd)
    {
        this._call('POST', '/api/admin/login', {
            password: pwd
        }, { 
            success: function(a,b) {
                console.log( 'success', a,b);
            },
            error: function(_,a,b) {
                console.log( 'error', a,b);
            },
        });

    }

    display() {
        alert('cool !');
        console.log($);
    }


}


module.exports = new Api();