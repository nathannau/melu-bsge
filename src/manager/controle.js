'use strict';

var Vue = require('vue');
require('./controle-string');
require('./controle-numeric');
require('./controle-bool');
require('./controle-list');

const types = {
    string: 'controle-string',
    numeric: 'controle-numeric',
    bool: 'controle-bool',
    list: 'controle-list',
};
const invalidType = { template:'<div>Type invalide</div>' };

module.exports = Vue.component('controle', { 
    template: require('./controle.html'),
    props: {
        type: String,
        libelle: String,
        config: Object,
        defaultValue: String,
    },
    data: function() { return {
        value: 'this.defaultValue',
    }},
    mounted: function() {
        this.value = this.defaultValue;
    },
    computed: {
        subComponent: function() { return types[this.type] || invalidType; },
    },
    watch: {
        value: function(value) { 
            console.log('watch value', arguments);

            // this.$emit('input', value);
        },
    },
});


