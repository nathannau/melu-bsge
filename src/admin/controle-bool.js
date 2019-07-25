'use strict';

var Vue = require('vue');
var api = require('./Api');

module.exports = Vue.component('controle-bool', { 
    template: require('./controle-bool.html'),
    props: {
        config: String,
        defaultValue: String
    },
    data: function() { 
        return {
            value: this.defaultValue,
        };
    },
    watch: {
        value: function(value) { this.$emit('update:defaultValue', value); },
    },

});


