'use strict';

var Vue = require('vue');

module.exports = Vue.component('gestionnaire', { 
    template: require('./gestionnaire.html'),
    props: {
        value: Object,
    },
    data: function() { return {
        item:  Object.assign({
            newControleId: null
            }, this.value),
    }},
    methods: {
    },
    watch: {
        item: { deep: true, handler: function(value) { 
            this.$emit('input', value);
        }},
    },
});


