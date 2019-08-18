'use strict';

var Vue = require('vue');
require('../shared/input-number');

module.exports = Vue.component('controle-numeric', { 
    template: require('./controle-numeric.html'),
    props: {
        config: Object,
        value: String,
    },
});


