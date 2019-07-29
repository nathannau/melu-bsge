'use strict';

var Vue = require('vue');
var { api } = require('./Api');
require('./console');

module.exports = Vue.component('consoles', { 
    template: require('./consoles.html'),
    data: function() { return {
        items: [],
        controles: [],
        removed: [],
    }},
    mounted: async function() {
        this.$showLoading();
        this.items.splice(0, this.items.length, ... await api.getConsoles());
        this.controles.splice(0, this.controles.length, ... await api.getControles());
        this.$hideLoading();
    },
    provide: function() {
        return {
            controles: this.controles,
        }
    },
    computed: {
        hasOneError: function() {
            return !this.items.every(item=>{return !this.hasError(item); });
        },
    },
    methods: {
        hasErrorIdInDouble: function(item) {
            return !item.consoleId && 
                this.items.find((el)=>{ return el!=item && 
                    (el.consoleId || el.newConsoleId)==item.newConsoleId; });
        },
        hasError: function(item) {
            if (!item.consoleId)
                return !item.newConsoleId || this.hasErrorIdInDouble(item);
            return false;
        },
        itemKey: function(item) {
            if (item.consoleId) return item.consoleId;
            if (!item.tmpKey) item.tmpKey = Math.random().toString(36).substring(2);
            return item.tmpKey;
        },
        add: function() {
            this.items.push({
                consoleId:	null,
                newConsoleId:	null,
                libelle: "Nouv Console",
                type: "numeric",
                config: "{}",
            });
        },
        remove: function(index) {
            this.$openAsk({
                title: "Supprimer",
                message: "Voulez vous supprimer cette console ?",
                buttons: { no: "Non", yes: "Oui"},
                onselect: (key) => {
                    if (key=="yes") {
                        var item = this.items.splice(index,1)[0];
                        if (item.consoleId)
                            this.removed.push(item.consoleId);
                    }
                }
            })
        },
        save: async function() { 
            this.$showLoading();
            this.items.forEach(async item => {
                await api.setConsole(item.consoleId || item.newConsoleId, item);
                item.consoleId = item.consoleId || item.newConsoleId;
            });
            this.removed.forEach(async key => {
                await api.removeConsole(key);
            });
            this.removed.splice(0, this.removed.length);
            this.$hideLoading();
            this.$openAlert({
                title:'Sauvegarde', 
                message:'Consoles sauvegardées avec succès', 
                timeout:2000});
        },
    }
});


