'use strict';

var Vue = require('vue');
var qs = require('querystringify');
var api = require('./Api');

module.exports = Vue.component('controles', { 
    template: require('./controles.html'),
    data: ()=>{ return {
        items: []
    }},
    mounted: async function() {
        api.
        console.log('controles.mounted')
    },
    methods: {
    }
});


