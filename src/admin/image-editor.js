'use strict';

var Vue = require('vue');
require('./drop-zone');
var $ = require("jquery");
var { encode, decode } = require('base64-arraybuffer');

module.exports = Vue.component('image-editor', { 
    template: require('./image-editor.html'),
    props: {
        value: Object,
        previewSize: Object,
        extensions: String,
    },
    data: function() { 
        // var image = null;
        // try { image = JSON.parse(this.value); } catch { image = {}; }
        // if (typeof(image)!='object') image = {};

        return {
            size: 0,
            image:  Object.assign({
                content: null,
                filename: null,
                type: null,
            }, this.value),
            // }, image),
        };
    },
    computed: {
        content : function() {
            if (this.image.content)
                return `data:${this.image.type};base64, ${this.image.content}`;
        },        
        styleBySize: function() {
            switch (this.size) {
                case 0: return { display:'none' };
                case 1: return { 
                    maxWidth: this.previewSize.width + 'px', 
                    maxHeight: this.previewSize.height + 'px', 
                };
                case 2: return {}; 
            }
        },
    },
    // mounted: function() {
    //     // console.log("mounted")
    //     this.setContent(this.content);
    // },
    methods: {
        changeSize: function(dir) {
            this.size += dir;
        },
        drop: function(file) { 
            // console.log('TODO drop !', file);
            
            this.image = {
                content: encode(file.content),
                //content: btoa(String.fromCharCode(...new Uint8Array(file.content))),
                filename: file.filename,
                type: file.contentType,
            }
            this.$emit('input', this.image);
        },
        download: function() { 
            // console.log('TODO download !', arguments); 

            //var content = new Blob([ atob(this.image.content) ], {type: this.image.type });
            var content = new Blob([ decode(this.image.content) ], {type: this.image.type });
            var url = window.URL.createObjectURL(content);

            var lnk = $('<a />').attr({
                href:url,
                download: this.image.filename,
            }).css({ display:'none'});
            lnk.appendTo('body');
            lnk[0].click();
            lnk.remove();
            window.URL.revokeObjectURL(url);
        },
        upload: function() { 
            // console.log('TODO upload !', arguments); 
            var inputFile = $('<input />').attr({
                type: 'file',
                accept: this.extensions,
            }).css({ display:'none'});
            inputFile.appendTo('body');
            var that = this;
            inputFile[0].onchange = async function(ev) {
                var files = ev.target.files;
                if (!files.length) return;

                var file = files[0];
                var reader = new FileReader();
                var readerPromise = new Promise((resolve, reject)=>{
                    reader.onload = function (evt) { resolve(evt.target.result); }
                    reader.onerror = function (evt) { reject(evt); }
                });
                reader.readAsArrayBuffer(file);
                var content = await readerPromise;

                that.image = {
                    content: encode(content),
                    // content: btoa(String.fromCharCode(...new Uint8Array(content))),
                    filename: file.name,
                    type: file.type,
                };
                that.$emit('input', that.image);
            }
            inputFile[0].click();
            inputFile.remove();
        },
    }

});


