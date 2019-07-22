'use strict';

var $ = require("jquery");

class Api {

    constructor() {
        this.token = null;
    }

    _call(method, path, data, settings = {}) {
        var headers = settings.headers || {};

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
    _asyncCall(method, path, data, settings = {}) {
        return new Promise((resolve, reject)=>{
            settings.success = resolve;
            settings.error = reject;
            this._call(method, path, data, settings);
        });
    }

    hasToken() {
        return !!this.token;
    }

    async login(pwd) {
        var data = await this._asyncCall('POST', `/api/admin/login`, { password: pwd });
        this.token = (data.status!='success') ? null : data.token;
        return !!this.token;
    }

    async getControles() {
        var datas = await this._asyncCall('GET', `/api/admin/controles`);
        return datas
    }
    
    async getControle(id) {
        var data = await this._asyncCall('GET', `/api/admin/controles/${id}`);
        return data
    }
    
    async addControle(data) {
        var id = await this._asyncCall('POST', `/api/admin/controles`, data);
        return id
    }
    
    async setControle(id, data) {
        await this._asyncCall('POST', `/api/admin/controles/${id}`, data);
    }

    // test() {
    //     var self = this;
    //     this._call('GET', '/api/admin/test', { a:'aa', b:2}, {
    //         success: function(data) {

    //             console.log( 'success', data);
    //         },
    //     });

    // }

    // display() {
    //     alert('cool !');
    //     console.log($);
    // }


}


module.exports = new Api();