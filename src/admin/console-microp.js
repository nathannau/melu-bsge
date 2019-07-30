'use strict';

var Vue = require('vue');

module.exports = Vue.component('console-microp', { 
    template: require('./console-microp.html'),
    props: {
        value: String,
    },
    data: function() { 
        var item = null;
        try { item = JSON.parse(this.value); } catch { item = {}; }
        if (typeof(item)!='object') item = {};

        return {
            item:  Object.assign({
                controles: [],
            }, item),
            controles: this.controles,
        };
    },
    inject: [ 'controles' ],
    methods: {
        addValue: function() { this.item.controles.push({ controleId:'', pin:1, direction:'IN' }) },
        removeValue: function(index) { this.item.controles.splice(index, 1); },
    },
    watch: {
        item: { deep:true, handler: function(value) { 
            this.$emit('input', JSON.stringify(value));
        } },
    },

});


