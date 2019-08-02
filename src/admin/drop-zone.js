'use strict';

var Vue = require('vue');

module.exports = Vue.component('drop-zone', { 
    template: require('./drop-zone.html'),
    methods: {
        drop: function(ev) { 
            //console.log('drop !', arguments, ev.dataTransfer);
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

});


