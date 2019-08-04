'use strict';

var Vue = require('vue');
require('./file-editor');
require('./image-editor');

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
                // controles: [],
                html: "",
                js: "",
                css: "",
                images: []
            }, item),
            // controles: this.controles,
        };
    },
    methods: {
        addImage: function() {
            this.item.images.push({
                content:null,
                filename: null,
                type:null,
            });
        },
        removeImage: function(index) {
            this.item.images.splice(index,1);
        }
    },
    watch: {
        item: { deep:true, handler: function(value) { 
            this.$emit('input', JSON.stringify(value));
        } },
    },

});


