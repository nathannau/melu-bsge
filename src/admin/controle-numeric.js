'use strict';

var Vue = require('vue');

module.exports = Vue.component('controle-numeric', { 
    template: require('./controle-numeric.html'),
    props: {
        config: String,
        defaultValue: String
    },
    data: function() { 
        var item = null;
        try { item = JSON.parse(this.config); } catch { item = {}; }
        if (typeof(item)!='object') item = {};

        var value = parseInt(this.defaultValue, 10)

        return {
            item:  Object.assign({
                minimum: null,
                maximum: null,
                step: 1,
                decimal:0,
            }, item),
            value: isNaN(value) ? 0 : value,
        };
    },
    computed: {
        precision: function() { return Math.pow(10, -this.item.decimal); }
    },
    watch: {
        item: { deep: true, handler: function(value) { 
            this.$emit('update:config', JSON.stringify(value));
        }},
        value: function(value) { this.$emit('update:defaultValue', value.toString()); },
    },

});


