'use strict';

var Vue = require('vue');
require('./drop-zone');

module.exports = Vue.component('file-editor', { 
    template: require('./file-editor.html'),
    model: { prop: 'content' },
    props: {
        filename: String,
        content: String,
        type: String,
    },
    data: function() { 
    //     var item = null;
    //     try { item = JSON.parse(this.value); } catch { item = {}; }
    //     if (typeof(item)!='object') item = {};

        return {
            editing: false
    //         item:  Object.assign({
    //             controles: [],
    //         }, item),
    //         controles: this.controles,
        };
    },
    methods: {
        switchEditor: function() { this.editing = !this.editing; },
        drop: function(ev) { 
            console.log('TODO fe.drop !', arguments); 
        },
        download: function() { console.log('TODO download !', arguments); },
        upload: function() { console.log('TODO upload !', arguments); },
    }
    // watch: {
    //     item: { deep:true, handler: function(value) { 
    //         this.$emit('input', JSON.stringify(value));
    //     } },
    // },

});


