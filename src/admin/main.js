'use strict';

var Vue = require('vue');
var qs = require('querystringify');
var { ApiError, ApiUnauthorizedError } = require('./api');

const NotFound = { template: '<p class="status404">Page not found</p>' };

require('./login');
require('../shared/overlay');
require('./home');
require('./controles');
require('./consoles');
require('./gestionnaires');
require('../shared/menu-main');
require('../shared/input-number');

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

const routes = [
    { paths: ['home',''],      label: 'Home',         controler: 'home', },
    { paths: ['controle'],     label: 'Controles',    controler: 'controles', },
    { paths: ['console'],      label: 'Consoles',     controler: 'consoles', },
    { paths: ['gestionnaire'], label: 'Gestionnaire', controler: 'gestionnaires', },
    { paths: ['login'],        label: 'Connexion',    controler: 'login', },
];
var routesControler = {};
routes.forEach(route=>{
    route.paths.forEach(path=>{
        routesControler[path] = route.controler;
    });
});

var app = new Vue({
    el: '#app',
    data: {
        currentUrl: window.location.hash,
        currentHash: '',
        currentArgs: {},
        routes: routes,
        routesControler: routesControler,
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
            return this.routesControler[this.currentHash] || NotFound;
        }
    },
    // methods: {
    // },
    template: require('./main.html')
})
window.addEventListener('popstate', () => {
    app.currentUrl = window.location.hash
})

window.app = app