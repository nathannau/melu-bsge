'use strict';

var Vue = require('vue');
var { api } = require('./api');
var $ = require("jquery");

module.exports = Vue.component('home', { 
    template: require('./home.html'),
    data: function() { return {
    }; },
    methods: {
        save: async function() {
            this.$showLoading();
            var data = await api.getConfig();
            console.log(JSON.stringify(data));
            var content = new Blob([JSON.stringify(data)], {type: 'application/octet-stream' /*'text/plain'*/});
            console.log(content);
            var url = window.URL.createObjectURL(content);

            var lnk = $('<a />').attr({
                href:url,
                download: "melu.cnf",
            }).css({ display:'none'});
            lnk.appendTo('body');
            lnk[0].click();
            lnk.remove();
            window.URL.revokeObjectURL(url);
            this.$hideLoading();
        },
        load: async function() {
            var inputFile = $('<input />').attr({
                type:'file',
                accept:'.cnf',
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
                content = JSON.parse(content);
                that.$showLoading();
                await api.setConfig(content);
                that.$hideLoading();
                that.$openAlert({
                    title:'Restauration', 
                    message:'Configuration restaurée avec succès. N\'oubliez de commencer la partie pour réinitialiser les valeurs par défauts', 
                    timeout:2000})
            }
            inputFile[0].click();
            inputFile.remove();

        },
        start: async function() {
            var that = this;
            var ask = new Promise(function(resolve) {
                that.$openAsk({
                    title:'Commencer une partie', 
                    message:'Attention, cette opération va réinitialiser la partie en cours.', 
                    buttons: {
                        'cancel': 'Annuler',
                        'confirm': 'Continuer',
                    },
                    onselect: resolve
                });
            });
            if ((await ask) != 'confirm') return;

            await api.startGame();

            this.$openAlert({
                title:'Commencer une partie', 
                message:'Nouvelle partie initialisée', 
                timeout:2000})

        },
    },
});