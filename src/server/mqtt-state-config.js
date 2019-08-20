'use strict';

var topicParse = require('../shared/topic-parse');

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
                topic: `game/clients/${client.clientId}/console`,
                payload: client.console,
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

    subscribe(server, 'game/clients/+', async function(packet, client, parts, topic) {
        console.log(packet, packet.payload.toString());
        var clientId = parts[0];
        
        try {
            var data = JSON.parse(packet.payload.toString());
            switch (data.action.toLowerCase()) {
                case 'hello':
                    console.log('HELLO !!!!')
                    if (!await state.getClient(clientId))
                        server.publish({
                            topic: `game/clients/${clientId}/console`,
                            payload: 'null',
                            qos: 0,
                            retain: true,
                        })
                break;
                case 'goodbye':
                    server.publish({
                        topic: `game/clients/${clientId}/console`,
                        payload: '',
                        qos: 0,
                        retain: true,
                    })
                        // state.setClient(clientId);
                break;
            }
        }
        catch {}
    })

    subscribe(server, 'game/clients/+/console', function(packet, client, parts, topic) {
        console.log(packet, !client);
        if (!packet.retain) return;
        //if (!client) return;
        console.log(`Client(${parts[0]}) <= ${packet.payload.toString()}`);
        state.setClient(parts[0], packet.payload.toString());
    })
    
}