'use strict';

var Vue = require('vue');

module.exports = Vue.component('controle-list', { 
    template: require('./controle-list.html'),
    props: {
        config: Object,
        value: String,
    },
    computed: {
        currentValue: {
            get: function() { 
                var val = this.value || "";
                return this.config.multiple ? val.split(';') : val; 
            },
            set: function(val) {
                if (this.config.multiple) {
                    val = val.filter(el=>{ return el; });
                    val = val.join(';');
                }
                this.$emit('input', val);
            },
        } 
    },
});


