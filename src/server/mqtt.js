'use strict'; 

module.exports = function() {
    /* Init MQTT */
    var mosca = require('mosca');
    var settings = {
        interfaces: [
            { type: 'mqtt', port: 1883 },
            { type: 'http', port: 8883 },
        ],
        persistence: {
            factory: mosca.persistence.Memory
        },
    };

    var server = new mosca.Server(settings);
    
    // server.on('clientConnected', function(client) {
    //     console.log('client connected', client.id);
    // });
    // fired when a message is received
    // server.on('published', function(packet, client) {
    //     console.log('Published', packet, packet.payload.toString());
    // });
    return server;
}

