'use strict';

var Vue = require('vue');

module.exports = Vue.component('drop-zone', { 
    template: require('./drop-zone.html'),
    // model: { prop: 'content' },
    // props: {
    //     filename: String,
    //     content: String,
    //     type: String,
    // },
    // data: function() { 
    // //     var item = null;
    // //     try { item = JSON.parse(this.value); } catch { item = {}; }
    // //     if (typeof(item)!='object') item = {};

    //     return {
    //         editing: false
    // //         item:  Object.assign({
    // //             controles: [],
    // //         }, item),
    // //         controles: this.controles,
    //     };
    // },
    methods: {
        drop: function(ev) { 
            console.log('TODO drop !', arguments, ev.dataTransfer);
            ev.preventDefault(); 
            var files = ev.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let fr = new FileReader();
                fr.onload = evt=>{
                    this.$emit('drop', evt.target.result);
                }
                fr.readAsText(file);
            }
        },
        dragover: function(ev) { 
            ev.dataTransfer.dropEffect = "copy";
            ev.preventDefault();
        },
    }
    // watch: {
    //     item: { deep:true, handler: function(value) { 
    //         this.$emit('input', JSON.stringify(value));
    //     } },
    // },

});


