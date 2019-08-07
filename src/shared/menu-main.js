'use strict';

var Vue = require('vue');
var qs = require('querystringify');

// const items = [
//     { route: 'home',         libelle: 'Home'},
//     { route: 'controle',     libelle: 'Controles'},
//     { route: 'console',      libelle: 'Consoles'},
//     { route: 'gestionnaire', libelle: 'Gestionnaire'},
//     { route: 'login',        libelle: 'Connexion'},
// ];

module.exports = Vue.component('menu-main', { 
    template: require('./menu-main.html'),
    props: {
        currentRoute: String,
        routes: Array,
    },
    // data: function() { return {
    //     items: items
    // }}
    methods: {
        getOptions: function(route) {
            if (!route.arguments) return '';
            return qs.stringify(route.arguments, true);
        }
    }
});


