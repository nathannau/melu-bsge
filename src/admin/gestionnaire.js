'use strict';

var Vue = require('vue');

module.exports = Vue.component('gestionnaire', { 
    template: require('./gestionnaire.html'),
    props: {
        value: Object,
    },
    data: function() { return {
        item:  Object.assign({
            newControleId: null,
        }, this.value),
        config: Object.assign({
            controles: [],
        }, JSON.parse(this.value.config)),
        controles: this.controles,
    }},
    inject: [ 'controles' ],
    methods: {
        ajouter: function() {
            this.config.controles.push(this.$refs.currentControl.value);
        },
        getControleLibelle: function(controleId) {
            var controle = this.controles.find(el=>{ return el.controleId == controleId; });
            return controle ? controle.libelle : "<i>Erreur</i>";
        },
        moveControle: function(dir, index) {
            var bak = this.config.controles[index];
            Vue.set(this.config.controles, index, this.config.controles[index + dir]);
            Vue.set(this.config.controles, index + dir, bak);
        },
        removeControle: function(index) {
            this.config.controles.splice(index, 1);
        }
    },
    watch: {
        config: { deep: true, handler: function(value) { 
            Vue.set(this.item, 'config', JSON.stringify(value));
        }},
        item: { deep: true, handler: function(value) { 
            this.$emit('input', value);
        }},
    },
});


