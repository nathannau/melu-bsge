'use strict';

var Vue = require('vue');
var { api } = require('./api');
require('./controle');

module.exports = Vue.component('controles', { 
    template: require('./controles.html'),
    data: function() { return {
        items: [],
        removed: [],
    }},
    mounted: async function() {
        this.$showLoading();
        this.items.splice(0, this.items.length, ... await api.getControles());
        this.$hideLoading();
    },
    computed: {
        hasOneError: function() {
            return !this.items.every(item=>{return !this.hasError(item); });
        },
    },
    methods: {
        hasErrorIdInDouble: function(item) {
            return !item.controleId && 
                this.items.find((el)=>{ return el!=item && 
                    (el.controleId || el.newControleId)==item.newControleId; });
        },
        hasError: function(item) {
            if (!item.controleId)
                return !item.newControleId || this.hasErrorIdInDouble(item);
            return false;
        },
        itemKey: function(item) {
            if (item.controleId) return item.controleId;
            if (!item.tmpKey) item.tmpKey = Math.random().toString(36).substring(2);
            return item.tmpKey;
        },
        add: function() {
            this.items.push({
                controleId:	null,
                newControleId:	null,
                libelle: "Nouv Controle",
                defaultValue: null,
                type: "numeric",
                config: "{}",
            });
        },
        remove: function(index) {
            this.$openAsk({
                title: "Supprimer",
                message: "Voulez vous supprimer ce controle ?",
                buttons: { no: "Non", yes: "Oui"},
                onselect: (key) => {
                    if (key=="yes") {
                        var item = this.items.splice(index,1)[0];
                        if (item.controleId)
                            this.removed.push(item.controleId);
                    }
                }
            })
        },
        save: async function() { 
            this.$showLoading();
            this.items.forEach(async item => {
                await api.setControle(item.controleId || item.newControleId, item);
                item.controleId = item.controleId || item.newControleId;
            });
            this.removed.forEach(async key => {
                await api.removeControle(key);
            });
            this.removed.splice(0, this.removed.length);
            this.$hideLoading();
            this.$openAlert({
                title:'Sauvegarde', 
                message:'Controles sauvegardés avec succès', 
                timeout:2000});
        },
    }
});


