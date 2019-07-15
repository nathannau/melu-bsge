'use strict';

var Vue = require('vue');
var api = require('./Api');

var app = new Vue({
    el: '#app',
    data: {
        title: 'Le titre',
        message: require('./test.txt'),
        pwd: 'hhj94toirw'
    },
    methods: {
        login: function() {
            api.login(this.pwd);
        },
        test: function() {
            api.test();
        }
    },
    template: require('./main.html')
})
wapp = app