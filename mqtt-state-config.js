'use strict';

var topicParse = require('./src/shared/topic-parse');

function subscribe(server, topics, callback) {
    if (!Array.isArray(topics)) topics = [topics];

    server.on('published', function(packet, client) {
        if (!packet.topic) return;
        for(var i=0; i<topics.length; i++) {
            var parts = topicParse(topics[i], packet.topic);
            if (!parts) continue;
            callback(packet, client, parts, topics[i], i);
        }
    });

}

module.exports = function(server, state)
{
    state.getClients().then((clients)=>{
        clients.forEach((client)=>{
            server.publish({
                topic: `game/clients/${client.clientId}`,
                payload: JSON.stringify(client.console),
                qos: 0,
                retain: true,
            })
        });
    });

    state.getControles().then((controles)=>{
        controles.forEach((controle)=>{
            server.publish({
                topic: `game/controls/${controle.controleId}`,
                payload: controle.value,
                qos: 0,
                retain: true,
            })
        });
    });
    
    subscribe(server, 'game/controls/+', function(packet, client, parts, topic) {
        // console.log(packet, !client);
        if (!packet.retain) return;
        //if (!client) return;
        console.log(`Controle(${parts[0]}) <= ${packet.payload.toString()}`);
        state.setControle(parts[0], packet.payload.toString());
    })

    // server.on('published', function(packet, client) {
    //     console.log(packet, packet.payload.toString(), !!client);
    // });
    // server.on('clientConnected', function(client) {
    //     state.getClients().then((clients)=> {
    //         if (clients[client.id] == undefined)
    //         {
    //             state.setClient(client.id, null);
    //             server.publish({
    //                 topic: `game/clients/${client.id}`,
    //                 payload: JSON.stringify(null),
    //                 qos: 0,
    //                 retain: true
    //             })
    //         }
    //     });
    // });
    
    //https://www.frugalprototype.com/developpez-propre-api-node-js-express/
    //https://www.robinwieruch.de/node-express-server-rest-api/
    //https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
    
}