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
            var succes = await api.login(this.pwd);
            this.error = succes ? false : "Mot de passe invalid"
            if (succes) window.location = '#home'
        },

    },
    template: require('./login.html') 
});