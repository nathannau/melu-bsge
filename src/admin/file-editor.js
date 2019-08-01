'use strict';

var Vue = require('vue');
require('./drop-zone');
var $ = require("jquery");
var hljs = require('highlight.js')

module.exports = Vue.component('file-editor', { 
    template: require('./file-editor.html'),
    model: { prop: 'content' },
    props: {
        filename: String,
        content: String,
        type: String,
        extension: String,
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
    mounted: function() {
        console.log("mounted")
        // console.log(this.$refs.code.innerHTML)
        hljs.highlightBlock(this.$refs.code);
    },
    methods: {
        cntInput: function(ev) { 
            console.log('cntInput', arguments); 
            this.$emit('input', this.$refs.code.innerText);
            console.log(this.$refs.code);

            var selection = document.getSelection();
            var ranges = selection.getRangeAt(0).getClientRects();
            var selectionPosition = {
                x1: ranges[0].left,
                y1: ranges[0].top,
                x2: ranges[ranges.length-1].right,
                y2: ranges[ranges.length-1].bottom,
            };
            hljs.highlightBlock(this.$refs.code);
            var pos1 = document.caretPositionFromPoint(selectionPosition.x1, selectionPosition.y1);
            var pos2 = document.caretPositionFromPoint(selectionPosition.x2, selectionPosition.y2);
            

            //console.log(this.$refs.code.innerHTML);
        },
        // cntChange: function() { console.log('cntChange'); },

        switchEditor: function() { 
            // console.log('Switch !'); 
            this.editing = !this.editing; 
        },
        drop: function(content) { 
            //console.log('TODO fe.drop !', arguments); 
            this.$emit('input', content);
        },
        download: function() { 
            // console.log('TODO download !', arguments); 
            var content = new Blob([this.content], {type: 'application/octet-stream' /*'text/plain'*/});
            console.log(content);
            var url = window.URL.createObjectURL(content);

            var lnk = $('<a />').attr({
                href:url,
                download: this.filename,
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
                accept: this.extension,
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
                reader.readAsText(file, "UTF-8");
                var content = await readerPromise;
                that.$emit('input', content);
            }
            inputFile[0].click();
            inputFile.remove();
        },
    }
    // watch: {
    //     item: { deep:true, handler: function(value) { 
    //         this.$emit('input', JSON.stringify(value));
    //     } },
    // },

});


