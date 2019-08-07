'use strict';

var Vue = require('vue');
var qs = require('querystringify');
var { ApiError, ApiUnauthorizedError, api } = require('./api');

const NotFound = { template: '<p class="status404">Page not found</p>' };

require('./login');
require('../shared/overlay');
require('./home');
// require('./controles');
// require('./consoles');
// require('./gestionnaires');
require('../shared/menu-main');
// require('./input-number');

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
    { paths: ['home',''],      label: 'Home',         controler: 'home' },
    { paths: ['login'],        label: 'Connexion',    controler: 'login' },
];
const resetPaths = ['login'];
const DEBUG = true;
var app = new Vue({
    el: '#app',
    data: {
        currentUrl: window.location.hash,
        currentHash: '',
        currentArgs: {},
        routes: [],
        routesLoaded: false,
    },
    mounted: function() {
        this.routes.splice(0, this.routes.length, ...routes);
        if (DEBUG)  this.loadGestionnaires();
    },
    watch: {
        currentUrl: {
            immediate: true,
            handler: function(val){
                var parts = val.split('?', 2);
                this.currentHash = parts[0].replace(/^#*/g, '');
                this.currentArgs = (parts.length>1) ? qs.parse(parts[1]) : {};
                if (resetPaths.includes(this.currentHash))
                {
                    this.routes.splice(0, this.routes.length, ...routes);
                    this.routesLoaded = false;
                }
                if (!this.routesLoaded && api.hasToken())
                    this.loadGestionnaires();
            },
        },
    },
    computed: {
        mainView() {
            return this.routesControler[this.currentHash] || NotFound;
        },
        routesControler() {
            var ret = {};
            this.routes.forEach(route=>{
                route.paths.forEach(path=>{
                    ret[path] = route.controler;
                });
            });
            return ret;
        },
    },
    methods: {
        loadGestionnaires: async function() {
            this.$showLoading();
            var newRoutes = [];
            var gestionnaires = await api.getGestionnaires();
            gestionnaires.forEach(gestionnaire=>{
                newRoutes.push({ paths: ['manager'], label: gestionnaire.libelle, controler: 'manager', arguments: { id: gestionnaire.gestionnaireId } });
            });
            this.routes.splice(1, this.routes.length-2, ...newRoutes);
            this.routesLoaded = true;
            this.$hideLoading();
        },
    },
    template: require('./main.html')
})
window.addEventListener('popstate', () => {
    app.currentUrl = window.location.hash
})

window.app = app