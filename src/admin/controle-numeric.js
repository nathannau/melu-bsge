'use strict';

var Vue = require('vue');
var api = require('./Api');

module.exports = Vue.component('controle-numeric', { 
    template: require('./controle-numeric.html'),
    props: {
        config: String,
        defaultValue: String
    },
    data: function() { 
        var item = null;
        console.log('init data :', this.config);
        try { item = JSON.parse(this.config); } catch { item = {}; }
        console.log(item);
        if (typeof(item)!='object') item = {};
        console.log(item);

        var value = parseInt(this.defaultValue, 10)

        return {
            item:  Object.assign({
                    minimum: null,
                    maximum: null,
                    step: 1,
                    }, item),
            value: isNaN(value) ? 0 : value,
        };
    },
    methods: {
        changeDefaultValue: function(value) {
            this.value = value;
        },  
        changeItemAttr: function(attr, value) {
            Vue.set(this.item, attr, value);
        }      
    },
    watch: {
        item: { deep: true, handler: function(value) { 
            this.$emit('update:config', JSON.stringify(value));
        }},
        value: function(value) { this.$emit('update:defaultValue', value.toString()); },
    },

});


