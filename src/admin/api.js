'use strict';

var $ = require("jquery");
var Vue = require('vue');

class ApiError extends Error {
    constructor(xhr, status, error, ...params) {
        super("ApiError : generic", ...params);
        this.xhr = xhr;
        this.status = status;
        this.error = error;
    }
}

class ApiUnauthorizedError extends Error {
    constructor(xhr, status, error, ...params) {
        super("ApiError : Unauthorized access", ...params);
        this.xhr = xhr;
        this.status = status;
        this.error = error;
    }
}

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
            settings.error = function(xhr, status, error) {
                if (status=="error" && xhr.status==401) 
                    reject(new ApiUnauthorizedError(xhr, status, error, __filename));
                else 
                    reject(new ApiError(xhr, status, error, __filename));
            }
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
    async removeControle(id) {
        await this._asyncCall('DELETE', `/api/admin/controles/${id}`);
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
    async removeConsole(id) {
        await this._asyncCall('DELETE', `/api/admin/consoles/${id}`);
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
    async removeGestionnaire(id) {
        await this._asyncCall('DELETE', `/api/admin/gestionnaires/${id}`);
    }

}


module.exports = { 
    api: new Api(),
    ApiError: ApiError,
    ApiUnauthorizedError: ApiUnauthorizedError,
};