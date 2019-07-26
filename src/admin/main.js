'use strict';

var Vue = require('vue');
var qs = require('querystringify');
var { ApiError, ApiUnauthorizedError } = require('./Api');

const NotFound = { template: '<p class="status404">Page not found</p>' };

require('./login');
require('./home');
require('./controles');
require('./gestionnaires');
require('./menu-main');
require('./overlay');
require('./input-number');

//console.log(Vue.config.errorHandler);
Vue.config.errorHandler = function (err, vm, info) {
    if (err instanceof ApiUnauthorizedError) {
        console.log('redirect to login', err)
        window.location="#login";
        Vue.resetOverlay();
    }
    // else if (err instanceof ApiError) {
    //     console.log("ApiError : ", err)
    // }

    throw err;
}

const routes = {
    '': 'home',
    'home': 'home',
    'login': 'login',
    'controle': 'controles',
    'gestionnaire' : 'gestionnaires',
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