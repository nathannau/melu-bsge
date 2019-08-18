'use strict';

var Vue = require('vue');

module.exports = Vue.component('controle-string', { 
    template: require('./controle-string.html'),
    props: {
        config: Object,
        value: String,
    },
});


