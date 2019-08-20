'use strict';

var Vue = require('vue');
var topicParse = require('../shared/topic-parse')
// var { api } = require('./api');

module.exports = Vue.component('clients', { 
    template: require('./clients.html'),
    // props: {
    //     label: String,
    //     gestionnaireId: Number,
    // },
    data: function() { return {
        clients: {},
        // clientIds: [],
    }},
    mounted: function() {
        this.$mqtt.subscribe('game/clients/+/console', {});
        // this.$mqtt.subscribe('game/clients/+', {});
    },
    beforeDestroy: function() {
        this.$mqtt.unsubscribe('game/clients/+/console');
        // this.$mqtt.unsubscribe('game/clients/+');
    },
    mqtt: {
        'game/clients/+/console': function(data, topic) {
            var parts = topicParse('game/clients/+/console', topic);
            var clientId = parts[0];

            data = data.toString();
            if (!data.length) {
                Vue.delete(this.clients, clientId);
                return;
            } else {
                Vue.set(this.clients, clientsId, data)
            }
            this.actualValue = this.value = data.toString();
        },
        // 'game/clients/+': function(data, topic) {
        //     var parts = topicParse('game/clients/+', topic);
        //     var clientId = parts[0];

        //     data = JSON.parse(data.toString());
        //     console.log(topic, data);
        //     if (!data.length) {
        //         Vue.delete(this.clients, clientId);
        //         return;
        //     } else {
        //         Vue.set(this.clients, clientsId, JSON.parse(data))
        //     }
        //     this.actualValue = this.value = data.toString();
        // },
    },
});


