'use strict';

var Vue = require('vue');
var api = require('./Api');

module.exports = Vue.component('controle-numeric', { 
    template: require('./controle-numeric.html'),
    props: {
        config: Object,
        defaultValue: String
    },
    data: function() { return {
        item:  Object.assign({
            newControleId: null
            }, this.value),
        value: parseInt(this.defaultValue),
        //newId: String,
    }},
    computed: {
        subComponent: function() { return types[this.item.type] ? types[this.item.type].component : invalidType; },
        errorEmpty: function() { return !this.item.controleId && !this.item.newControleId; }
    },
    methods: {
        changeId: function(value) {
            Vue.set(this.item, 'newControleId', value);
            this.$emit('input', this.item);
        },        
    }
});


