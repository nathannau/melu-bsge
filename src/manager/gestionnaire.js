'use strict';

var Vue = require('vue');
var { api } = require('./api');

module.exports = Vue.component('gestionnaire', { 
    template: require('./gestionnaire.html'),
    props: {
        gestionnaireId: Number,
    },
    data: function() { return {
        controles: [],
    //     item:  Object.assign({
    //         newControleId: null,
    //     }, this.value),
    //     config: Object.assign({
    //         controles: [],
    //     }, JSON.parse(this.value.config)),
    //     controles: this.controles,
    }},
    mounted: async function() {
        this.$showLoading();

        var controles = await api.getGestionnaireControles(this.gestionnaireId);
        controles.forEach(controle => { 
            if (controle) 
                controle.config = JSON.parse(controle.config); 7
        });

        this.controles.splice(0, this.controles.length, ...controles);
        console.log(this.controles);
        this.$hideLoading();
    },
    // inject: [ 'urlArgs' ],
    // computed: {
    //     gestionnaireId: function() {
    //         return this.urlArgs.gestionnaireId;
    //     }
    // }
    // methods: {
    //     ajouter: function() {
    //         this.config.controles.push(this.$refs.currentControl.value);
    //     },
    //     getControleLibelle: function(controleId) {
    //         var controle = this.controles.find(el=>{ return el.controleId == controleId; });
    //         return controle ? controle.libelle : "<i>Erreur</i>";
    //     },
    //     moveControle: function(dir, index) {
    //         var bak = this.config.controles[index];
    //         Vue.set(this.config.controles, index, this.config.controles[index + dir]);
    //         Vue.set(this.config.controles, index + dir, bak);
    //     },
    //     removeControle: function(index) {
    //         this.config.controles.splice(index, 1);
    //     }
    // },
    // watch: {
    //     config: { deep: true, handler: function(value) { 
    //         Vue.set(this.item, 'config', JSON.stringify(value));
    //     }},
    //     item: { deep: true, handler: function(value) { 
    //         this.$emit('input', value);
    //     }},
    // },
});


