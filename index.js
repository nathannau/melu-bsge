'use strict'; 

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
server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});
// fired when a message is received
// server.on('published', function(packet, client) {
//     console.log('Published', packet, packet.payload.toString());
// });

/* Init Serveur de fichier */
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'))
app.listen(8080);

/* SQLite */
//var sqlite = require('sqlite3');

/* States */
var States = require('./states');
var state = new States('./db/states.db');

state.getClients((clients)=>{
    clients.forEach((client)=>{
        server.publish({
            topic: `game/clients/${client.clientId}`,
            payload: JSON.stringify(client.console),
            qos: 0,
            retain: true
        })
    });
});


server.on('clientConnected', function(client) {
    state.getClients((clients)=> {
        if (clients[client.id] == undefined)
        {
            state.setClient(client.id, null);
            server.publish({
                topic: `game/clients/${client.id}`,
                payload: JSON.stringify(null),
                qos: 0,
                retain: true
            })
        }
    });
});

//https://www.frugalprototype.com/developpez-propre-api-node-js-express/
//https://www.robinwieruch.de/node-express-server-rest-api/
//https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd



