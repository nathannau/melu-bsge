'use strict';

var Vue = require('vue');
require('./controle-string');
require('./controle-numeric');
require('./controle-bool');
require('./controle-list');
var topicParse = require('../shared/topic-parse')

const types = {
    string: 'controle-string',
    numeric: 'controle-numeric',
    bool: 'controle-bool',
    list: 'controle-list',
};
const invalidType = { template:'<div>Type invalide</div>' };

module.exports = Vue.component('controle', { 
    template: require('./controle.html'),
    props: {
        type: String,
        libelle: String,
        config: Object,
        defaultValue: String,
        controleId: String,
        bus: Object,
    },
    data: function() { return {
        value: null,
        actualValue: null,
    }},
    mounted: function() {
        this.$mqtt.subscribe(`game/controls/${this.controleId}`, {});
        this.bus.$on('saveAll', ()=>{
            if (this.actualValue != this.value) 
                this.send();
        });
    },
    beforeDestroy: function() {
        this.$mqtt.unsubscribe(`game/controls/${this.controleId}`);
    },
    mqtt: {
        'game/controls/#': function(data, topic) {
            if (!topicParse(`game/controls/${this.controleId}`, topic)) return;
            console.log(`game/controls/${this.controleId} : `, data.toString());
            this.actualValue = this.value = data.toString();
        },
    },
    computed: {
        subComponent: function() { return types[this.type] || invalidType; },
    },
    methods: {
        send: function() {
            this.$mqtt.publish(`game/controls/${this.controleId}`, this.value, { retain: true});
            this.actualValue = this.value;
        }
    },
});


