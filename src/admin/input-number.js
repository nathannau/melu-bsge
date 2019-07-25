'use strict';

var Vue = require('vue');

module.exports = Vue.component('input-number', { 
    template: '<input v-bind="$props" type="number" v-bind:value="value" v-on:input="$emit(\'input\', $event.target.valueAsNumber)">',
    props: {
        value: Number
    }
});
