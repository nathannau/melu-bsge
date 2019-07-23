'use strict';

var Vue = require('vue');
//var qs = require('querystringify');
var api = require('./Api');
require('./controle');

module.exports = Vue.component('controles', { 
    template: require('./controles.html'),
    data: function() { return {
        items: [],
        removed: [],
    }},
    mounted: async function() {
        this.$showLoading();
        this.items = await api.getControles();
        this.$hideLoading();
    },
    methods: {
        getErrorIdInDouble: function(item) {
            return !item.controleId && 
                this.items.find((el)=>{ return el!=item && 
                    (el.controleId || el.newControleId)==item.newControleId; });
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
            var item = this.items.splice(index,1)[0];
            if (item.controleId)
                this.removed.push(item.controleId);
        },
        save: async function() { 
            this.items.forEach(async item => {
                await api.setControle(item.controleId || item.newControleId, item);
                item.controleId = item.controleId || item.newControleId;
            });
            this.removed.forEach(async key => {
                await api.removeControle(key);
            });
        },
    }
});


