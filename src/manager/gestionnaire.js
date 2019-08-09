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
});


