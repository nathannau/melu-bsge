'use strict';

var Vue = require('vue');
require('./drop-zone');
var $ = require("jquery");
var hljs = require('highlight.js')

module.exports = Vue.component('file-editor', { 
    template: require('./file-editor.html'),
    model: {
        prop: 'content',
    },
    props: {
        filename: String,
        content: String,
        type: String,
        extension: String,
    },
    data: function() { 
        return {
            editing: false,
        };
    },
    mounted: function() {
        // console.log("mounted")
        this.setContent(this.content);
        hljs.highlightBlock(this.$refs.code);
    },
    methods: {
        getContent: function() { 
            return this.$refs.code.innerText; 
        },
        setContent: function(v) { 
            this.$refs.code.innerText = v; 
        },
        refreshHighlight: function() {
            var selection = document.getSelection();
            var ranges = selection.getRangeAt(0).getClientRects();
            var selectionPosition = {
                x1: ranges[0].left,
                y1: ranges[0].top,
                x2: ranges[ranges.length-1].right,
                y2: ranges[ranges.length-1].top,
            };
            hljs.highlightBlock(this.$refs.code);
            var pos1 = document.caretPositionFromPoint(selectionPosition.x1, selectionPosition.y1+1);
            var pos2 = document.caretPositionFromPoint(selectionPosition.x2, selectionPosition.y2);
            //var range = document.createRange();
            var range = document.getSelection().getRangeAt(0);
            range.setStart(pos1.offsetNode, pos1.offset);
            range.setEnd(pos2.offsetNode, pos2.offset);
        },
        cntInput: function(ev) { 
            // console.log('cntInput', arguments); 
            clearTimeout(this.refreshHighlightTimer);
            this.refreshHighlightTimer = setTimeout(()=>{this.refreshHighlight();}, 1500);

            this.$emit('input', this.getContent());
        },
        insertTab: function(ev) {
            // console.log('insertTab : ', ev);
            ev.preventDefault();
            var range = document.getSelection().getRangeAt(0);
            var container = range.startContainer, offset = range.startOffset

            if (range.startContainer.nodeType != Node.TEXT_NODE) return;
            var text = range.startContainer.nodeValue;
            range.startContainer.nodeValue = 
                text.substr(0, range.startOffset) + 
                "\t" + 
                text.substr(range.startOffset);
            range.setStart(container, offset+1);
                
            this.$emit('input', this.getContent());
            },
        switchEditor: function() { 
            // console.log('Switch !'); 
            this.editing = !this.editing; 
        },
        drop: function(file) { 
            //console.log('TODO fe.drop !', arguments); 
            this.setContent(file.content);
            hljs.highlightBlock(this.$refs.code);
            this.$emit('input', file.content);
        },
        download: function() { 
            // console.log('TODO download !', arguments); 
            var content = new Blob([this.getContent()], {type: 'application/octet-stream' /*'text/plain'*/});
            //console.log(content);
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

});


