'use strict';

var Vue = require('vue');
require('./console-screen');
require('./console-microp');

const types = {
    screen: { label:"Ecran", component: 'console-screen' },
    microp: { label:"MicroPro", component: 'console-microp' },
};
const invalidType = {template:'<div>Type invalide</div>'}

module.exports = Vue.component('console', { 
    template: require('./console.html'),
    props: {
        value: Object,
        errorIdInDouble: Boolean
    },
    data: function() { return {
        item:  Object.assign({
            newConsoleId: null
            }, this.value),
        types: types,
    }},
    computed: {
        subComponent: function() { return types[this.item.type] ? types[this.item.type].component : invalidType; },
        errorEmpty: function() { return !this.item.consoleId && !this.item.newConsoleId; }
    },
    methods: {
        changeId: function(value) {
            Vue.set(this.item, 'newConsoleId', value);
            this.$emit('input', this.item);
        },
    },
    watch: {
        item: { deep: true, handler: function(value) { 
            this.$emit('input', value);
        }},
    },
});


