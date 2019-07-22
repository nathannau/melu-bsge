'use strict';

var Vue = require('vue');
//var qs = require('querystringify');
var api = require('./Api');

const types = {
    string: { label:"Texte", component: {template:'<div>Comp. Texte</div>'} },
    numeric: { label:"Numérique", component: {template:'<div>Comp. Numérique</div>'} },
    bool: { label:"Oui/Non", component: {template:'<div>Comp. Oui/Non</div>'} },
};
const invalidType = {template:'<div>Type invalide</div>'}

module.exports = Vue.component('controles', { 
    template: require('./controles.html'),
    data: ()=>{ return {
        items: [],
        types: types
    }},
    mounted: async function() {
        console.log('controles.mounted');
        this.items = await api.getControles();
    },
    methods: {
        add: function() { 
            console.log('controles.add'); 
            this.items.push({
                controleId:	null,
                libelle: "Nouv Controle",
                defaultValue: null,
                type: "numeric",
                config:"{}",
            });
        },
        save: function() { console.log('controles.save')},
        getComponent: function(type) { return types[type] ? types[type].component : invalidType; }
    }
});


