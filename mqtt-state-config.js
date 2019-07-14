'use strict';

module.exports = function(server, state)
{
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
    
}