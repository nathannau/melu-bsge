'use strict';

var Vue = require('vue');

module.exports = Vue.component('drop-zone', { 
    template: require('./drop-zone.html'),
    props: {
        type: String,
    },
    methods: {
        drop: function(ev) { 
            //console.log('drop !', arguments, ev.dataTransfer);
            ev.preventDefault(); 
            var files = ev.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let fr = new FileReader();
                fr.onload = evt=>{
                    this.$emit('drop', { 
                        content: evt.target.result,
                        filename: file.name,
                        contentType: file.type,
                        size: file.size,
                    });
                }
                if (this.type=='text')
                    fr.readAsText(file);
                else if (this.type=='binary')
                    fr.readAsBinaryString(file);
                else if (this.type=='array')
                    fr.readAsArrayBuffer(file);
                else if (this.type=='url')
                    fr.readAsDataURL(file);
            }
        },
        dragover: function(ev) { 
            ev.dataTransfer.dropEffect = "copy";
            ev.preventDefault();
        },
    }

});


