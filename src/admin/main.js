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
            //alert('login');
            //console.log(this.pwd);
            api.login(this.pwd);
        }
    },
    template: require('./main.html')
})
wapp = app