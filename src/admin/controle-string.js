'use strict';

var Vue = require('vue');

module.exports = Vue.component('controle-string', { 
    template: require('./controle-string.html'),
    props: {
        config: String,
        defaultValue: String
    },
    data: function() { 
        var item = null;
        try { item = JSON.parse(this.config); } catch { item = {}; }
        if (typeof(item)!='object') item = {};

        return {
            item:  Object.assign({
                lenMax: null,
            }, item),
            value: this.defaultValue,
        };
    },
    watch: {
        item: { deep: true, handler: function(value) { 
            this.$emit('update:config', JSON.stringify(value));
        }},
        value: function(value) { this.$emit('update:defaultValue', value); },
    },

});


