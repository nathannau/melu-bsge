'use strict';

var Vue = require('vue');
var api = require('./Api');

var app = new Vue({
    el: '#app',
    data: {
        title: 'Le titre',
        message: require('./test.txt')
    },
    methods: {
        login: function() {
            //alert('login');
            api.login('pouet');
        }
    },
    template: require('./main.html')
})
wapp = app