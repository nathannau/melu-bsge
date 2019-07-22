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
        var rep = await this._asyncCall('GET', `/api/admin/controles`);
        return rep.datas
    }
    async getControle(id) {
        var rep = await this._asyncCall('GET', `/api/admin/controles/${id}`);
        return rep.data
    }
    // async addControle(controle) {
    //     var rep = await this._asyncCall('POST', `/api/admin/controles`, controle);
    //     return rep.id
    // }
    async setControle(id, controle) {
        await this._asyncCall('POST', `/api/admin/controles/${id}`, controle);
    }

    async getConsoles() {
        var rep = await this._asyncCall('GET', `/api/admin/consoles`);
        return rep.datas
    }
    async getConsole(id) {
        var rep = await this._asyncCall('GET', `/api/admin/consoles/${id}`);
        return rep.data
    }
    // async addConsole(console) {
    //     var rep = await this._asyncCall('POST', `/api/admin/consoles`, console);
    //     return rep.id
    // }
    async setConsole(id, console) {
        await this._asyncCall('POST', `/api/admin/consoles/${id}`, console);
    }

    async getGestionnaires() {
        var rep = await this._asyncCall('GET', `/api/admin/gestionnaires`);
        return rep.datas
    }
    async getGestionnaire(id) {
        var rep = await this._asyncCall('GET', `/api/admin/gestionnaires/${id}`);
        return rep.data
    }
    async addGestionnaire(gestionnaire) {
        var rep = await this._asyncCall('POST', `/api/admin/gestionnaires`, gestionnaire);
        return rep.id
    }
    async setGestionnaire(id, gestionnaire) {
        await this._asyncCall('POST', `/api/admin/gestionnaires/${id}`, gestionnaire);
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