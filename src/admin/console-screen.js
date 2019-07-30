'use strict';

var Vue = require('vue');

module.exports = Vue.component('console-screen', { 
    template: require('./console-screen.html'),
    props: {
        value: String,
    },
    data: function() { 
        var item = null;
        try { item = JSON.parse(this.value); } catch { item = {}; }
        if (typeof(item)!='object') item = {};

        return {
            item:  Object.assign({
                controles: [],
            }, item),
            controles: this.controles,
        };
    },
    inject: [ 'controles' ],
    watch: {
        item: { deep:true, handler: function(value) { 
            this.$emit('input', JSON.stringify(value));
        } },
    },

});


