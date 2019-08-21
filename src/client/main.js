'use strict';

var $ = require('jquery');
// var qs = require('querystringify');
// var { ApiError, ApiUnauthorizedError, api } = require('./api');
var mqtt = require('mqtt');
var clientName = require('../shared/client-name');
var topicParse = require('../shared/topic-parse');

function dispatchMqtt(topic, actions) {
    for(var key in actions) {
        var parts = topicParse(key, topic);
        if (parts) {
            actions[key](parts, topic);
            break;
        }
    }
}

$(function(){
    console.log('Start !')
    var clientId = clientName.getName({ prefix:'client_' });
    console.log('clientId : ', clientId);

    var client = mqtt.connect(`mqtt://${window.location.hostname}:8883`)
    client.on('connect', function () {
        console.log('connected');

        client.subscribe([
            //`game/clients/${clientId}`,
            `game/clients/${clientId}/#`
        ], { });

        client.publish(`game/clients/${clientId}`, JSON.stringify({action:'hello'}), { retain: false, qos: 0 })
    });

    var currentConsoleId = null;
    client.on('message', function (topic, message) {
        // message is Buffer
        var data = message.toString();
        var _clientId = clientId;

        dispatchMqtt(topic, {
            'game/clients/+/console': parts=>{
                if (!data.length) { // Tentative de suppression
                    client.publish(`game/clients/${clientId}`, JSON.stringify({action:'hello'}), { retain: false, qos: 0 })
                    return;
                }
                if (currentConsoleId!=null) { // Si une console est déja affichée
                    window.location.reload();
                    return;
                }
                let consoleId = JSON.parse(data);
                console.log('Afficher console :', consoleId);

                currentConsoleId = consoleId;
                if (consoleId==null) {
                    let content = require('./fullIdentity.html');
                    content = eval('`'+content+'`');
                    $('body').html(content);
                } else {
                    // currentConsoleId = consoleId;
                }


            },
            'game/clients/+': parts=>{
                let content = JSON.parse(data);
                console.log('Commande :', content.action);
                switch (content.action.toLowerCase()) {
                    case 'ping':
                        client.publish(`game/clients/${_clientId}`, JSON.stringify({action:'pong'}), { retain: false, qos: 0 })
                    break;
                    case 'reset-id':
                        client.publish(`game/clients/${_clientId}`, JSON.stringify({action:'goodbye'}), { retain: false, qos: 0 })
                        clientName.reset();
                    break;
                    case 'identify':
                        console.log('identify clientId :', _clientId)
                        var divId = $('<div></div>')
                            .css({
                                position: 'absolute',
                                zIndex: 100000, 
                                top: 0,
                                right: 0, 
                                fontSize: '15px',
                                fontWeight: 'normal',
                                border: '1px solid #000',
                                background: '#fff',
                                color: '#000',
                                margin: 0,
                                padding: '5px',
                            })
                            .text(_clientId)
                            .appendTo('body');
                        setTimeout(()=>{ divId.remove(); }, content.duration || 2000)
                    break;
                }
            },
        })
        // console.log('message', topic, message.toString())
        //client.end()
    });

})

