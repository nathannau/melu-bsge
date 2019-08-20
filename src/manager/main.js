'use strict';

var Vue = require('vue');
var qs = require('querystringify');
var { ApiError, ApiUnauthorizedError, api } = require('./api');
var VueMqtt = require('vue-mqtt').default;
var ClientName = require('../shared/client-name');

const NotFound = { template: '<p class="status404">Page not found</p>' };

require('./login');
require('../shared/overlay');
require('./home');
require('./clients');
require('./gestionnaire');
require('../shared/menu-main');

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


Vue.use(
    VueMqtt, `mqtt://${window.location.hostname}:8883`, 
    { clientId: ClientName.getName({
        prefix:'mng_'}),
    }
);

const baseRoutes = [
    { paths: ['home',''],      label: 'Home',         controler: 'home' },
    { paths: ['assign'],       label: 'Client',       controler: 'clients' },
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
        this.routes.splice(0, this.routes.length, ...baseRoutes);
        // this.$mqtt.on('connect', function(p) {
        //     console.log('connected', p, arguments);
        // });
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
                    this.routes.splice(0, this.routes.length, ...baseRoutes);
                    this.routesLoaded = false;
                }
                if (!this.routesLoaded && api.hasToken())
                    this.loadGestionnaires();
            },
        },
    },
    computed: {
        mainViewProps() {
            var index = this.routes.findIndex(route=>{ return route.paths.includes(this.currentHash); });
            if (index<0) 
                return { is:NotFound };
            else {
                var route = this.routes[index];
                return Object.assign({
                    is: route.controler,
                    key: route.paths[0],
                    label: route.label,
                }, route.props);
            }
        },
    },
    methods: {
        loadGestionnaires: async function() {
            this.$showLoading();
            var newRoutes = [];
            var gestionnaires = await api.getGestionnaires();
            gestionnaires.forEach(gestionnaire=>{
                newRoutes.push({ 
                    paths: ['gestionnaire_' + gestionnaire.gestionnaireId], 
                    label: gestionnaire.libelle, 
                    controler: 'gestionnaire', 
                    props: { gestionnaireId: gestionnaire.gestionnaireId } });
            });
            this.routes.splice(0, this.routes.length, ...baseRoutes);
            this.routes.splice(2, 0, ...newRoutes);
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