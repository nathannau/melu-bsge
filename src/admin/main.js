'use strict';

var Vue = require('vue');
var qs = require('querystringify');
var api = require('./Api');

const NotFound = { template: '<p class="status404">Page not found</p>' };
const Home = { template: '<p>Home</p>' };
const Login = require('./login');
const Controles = require('./controles');

var menuMain = require('./menu-main');
var overlay = require('./overlay');

const routes = {
    '': Home,
    'home': Home,
    'login': Login,
    'controle': Controles,
}
var app = new Vue({
    el: '#app',
    data: {
        currentUrl: window.location.hash,
        currentHash: '',
        currentArgs: {}
    },
    watch: {
        currentUrl: {
            immediate: true,
            handler: function(val){
                var parts = val.split('?', 2);
                this.currentHash = parts[0].replace(/^#*/g, '');
                this.currentArgs = (parts.length>1) ? qs.parse(parts[1]) : {};
            }
        }
    },
    computed: {
        mainView() {
            return routes[this.currentHash] || NotFound;
        }
    },
    methods: {
        // login: function() {
        //     api.login(this.pwd);
        // },
        // test: function() {
        //     api.test();
        // }
    },
    template: require('./main.html')
})
window.addEventListener('popstate', () => {
    app.currentUrl = window.location.hash
})

window.app = app