'use strict';

var Vue = require('vue');

module.exports = Vue.component('controle-bool', { 
    template: require('./controle-bool.html'),
    props: {
        config: Object,
        value: String,
    },
    computed: {
        boolValue: {
            get: function() { return this.value=='true'; },
            set: function (val) { this.$emit('input', val.toString()) }
        },
    },
});


