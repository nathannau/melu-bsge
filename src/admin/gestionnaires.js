'use strict';

var Vue = require('vue');
var { api } = require('./Api');
require('./gestionnaire');

module.exports = Vue.component('gestionnaires', { 
    template: require('./gestionnaires.html'),
    data: function() { return {
        items: [],
        controles: [],
        removed: [],
    }},
    mounted: async function() {
        this.$showLoading();
        this.items.splice(0, this.items.length, ... await api.getGestionnaires());
        // this.items = await api.getGestionnaires();
        this.controles.splice(0, this.controles.length, ... await api.getControles());
        //this.controles = await api.getControles();
        this.$hideLoading();
    },
    provide: function() {
        return {
            controles: this.controles,
        }
    },
    methods: {
        // getControles: function() {
        //     return this.controles;
        // },
        itemKey: function(item) {
            if (item.gestionnaireId) return item.gestionnaireId;
            if (!item.tmpKey) item.tmpKey = Math.random().toString(36).substring(2);
            return item.tmpKey;
        },
        add: function() {
            this.items.push({
                gestionnaireId:	null,
                libelle: "Nouv Gestionnaire",
                config: "{}",
            });
        },
        remove: function(index) {
            this.$openAsk({
                title: "Supprimer",
                message: "Voulez vous supprimer ce gestionnaire ?",
                buttons: { no: "Non", yes: "Oui"},
                onselect: (key) => {
                    if (key=="yes") {
                        var item = this.items.splice(index,1)[0];
                        if (item.gestionnaireId)
                            this.removed.push(item.gestionnaireId);
                    }
                }
            })
        },
        save: async function() { 
            this.$showLoading();
            this.items.forEach(async item => {
                if (item.gestionnaireId)
                    await api.setGestionnaire(item.gestionnaireId, item);
                else 
                    item.gestionnaireId = await api.addGestionnaire(item);
            });
            this.removed.forEach(async key => {
                await api.removeGestionnaire(key);
            });
            this.removed.splice(0, this.removed.length);
            this.$hideLoading();
            this.$openAlert({
                title:'Sauvegarde', 
                message:'Gestionnaires sauvegardés avec succès', 
                timeout:2000});
        },
    }
});


