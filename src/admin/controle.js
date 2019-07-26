'use strict';

var Vue = require('vue');
require('./controle-string');
require('./controle-numeric');
require('./controle-bool');
require('./controle-list');

const types = {
    string: { label:"Texte", component: 'controle-string' },
    numeric: { label:"Numérique", component: 'controle-numeric' },
    bool: { label:"Oui/Non", component: 'controle-bool' },
    list: { label:"Liste", component: 'controle-list' },
};
const invalidType = {template:'<div>Type invalide</div>'}

module.exports = Vue.component('controle', { 
    template: require('./controle.html'),
    props: {
        value: Object,
        errorIdInDouble: Boolean
    },
    data: function() { return {
        item:  Object.assign({
            newControleId: null
            }, this.value),
        types: types,
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
        test: function(v) {
            console.log('controle.test :', v);
        },
    },
    watch: {
        item: { deep: true, handler: function(value) { 
            this.$emit('input', value);
        }},
    },
});


