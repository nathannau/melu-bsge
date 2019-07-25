'use strict';

var Vue = require('vue');
var api = require('./Api');

module.exports = Vue.component('controle-list', { 
    template: require('./controle-list.html'),
    props: {
        config: String,
        defaultValue: String
    },
    data: function() { 
        var item = null;
        try { item = JSON.parse(this.config); } catch { item = {}; }
        if (typeof(item)!='object') item = {};

        var valuePairs = [];
        if (item.values) 
            for ( i in item.values)
                valuePairs.push({ key:i, label:item.values[i] });
            
        var selected = this.defaultValue.split(';')

        return {
            item: Object.assign({
                multiple: false,
                values: {},
            }, item),
            valuePairs: valuePairs,
            value: selected,
            true: true,
            false: false,
        };
    },
    methods: {
        addValue: function() { this.valuePairs.push({ key:'', label:'' }) }
    },
    watch: {
        valuePairs: function(value) {
            console.log('watch valuePairs');
            var values = {};
            value.forEach(pair => { values[pair.key] = pair.label; });
            Vue.set(this.item, 'values', values);
        },
        item: { deep: true, handler: function(value) { 
            this.$emit('update:config', JSON.stringify(value));
        }},
        value: function(value) { this.$emit('update:defaultValue', value.join(';')); },
    },

});


