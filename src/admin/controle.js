'use strict';

var Vue = require('vue');
var api = require('./Api');

const types = {
    string: { label:"Texte", component: {template:'<div>Comp. Texte</div>'} },
    numeric: { label:"Numérique", component: require('./controle-numeric') },
    bool: { label:"Oui/Non", component: {template:'<div>Comp. Oui/Non</div>'} },
    list: { label:"Liste", component: {template:'<div>Comp. Liste</div>'} },
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


