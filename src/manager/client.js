'use strict';

var Vue = require('vue');
var topicParse = require('../shared/topic-parse')

module.exports = Vue.component('client', { 
    template: require('./client.html'),
    props: {
        clientId: String,
        console: String,
    },
    data: function() { return {
        labelTypes: {
            screen: "Ecran",
            microp: "MicroPro",
        },
        currentConsole: this.console,
        pingDelay: null,
        pingStart: null,
    }},
    inject: [ 'consoles' ],
    mounted: function() {
        this.$mqtt.subscribe(`game/clients/${this.clientId}`, {});
    },
    beforeDestroy: function() {
        this.$mqtt.unsubscribe(`game/clients/${this.clientId}`);
    },
    watch: {
        currentConsole: function(val) {
            this.$mqtt.publish(`game/clients/${this.clientId}/console`, JSON.stringify(val), { retain: true, qos: 0 })
        },
    },
    methods: {
        identify: function() {
            this.$mqtt.publish(`game/clients/${this.clientId}`, JSON.stringify({ action:'identify' }), { retain: false, qos: 0 })
        },
        reset: function() {
            this.$mqtt.publish(`game/clients/${this.clientId}`, JSON.stringify({ action:'reset-id' }), { retain: false, qos: 0 })
        },
        ping: function() {
            this.pingDelay = '- ms';
            this.pingStart = new Date();
            this.$mqtt.publish(`game/clients/${this.clientId}`, JSON.stringify({ action:'ping' }), { retain: false, qos: 0 })
        },
        remove: function() {
            this.$mqtt.publish(`game/clients/${this.clientId}/console`, '', { retain: true, qos: 0 })
        },
    
    },
    // console.log(this.$vnode.key);        
    mqtt: {
        'game/clients/+': function(data, topic) {
            if (!topicParse(`game/clients/${this.clientId}`, topic)) return;
            console.log(topic, this.clientId);
            // var clientId = parts[0];
            // console.log(topic, data);
            data = JSON.parse(data.toString());
            
            switch(data.action.toLowerCase()) {
                case 'pong':
                    // console.log('PONG !', this.pingStart.getMilliseconds(), new Date().getMilliseconds());
                    var delay = new Date() - this.pingStart;
                    this.pingDelay = `${ delay } ms`;
                break;
            }
        },
    },
});


