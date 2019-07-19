'use strict';

var Vue = require('vue');
var api = require('./Api');

module.exports = Vue.component('login', { 
    data: function() { return {
        pwd: "",
        error: false
    }; },
    methods: {
        connect: async function() {
            console.log('connect !')
            var succes = await api.login(this.pwd);
            console.log('succes')
            this.error = succes ? false : "Mot de passe invalid"
            console.log(this.error)
        },

    },
    template: require('./login.html') 
});