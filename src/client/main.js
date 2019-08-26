'use strict';

var $ = require('jquery');
var qs = require('querystringify');
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
    // console.log('Start !')
    var clientId = clientName.getName({ prefix:'client_' });
    // console.log('clientId : ', clientId);

    var client = mqtt.connect(`mqtt://${window.location.hostname}:8883`)
    client.on('connect', function () {
        // console.log('connected');

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
            'game/clients/+/console': async parts=>{
                if (!data.length) { // Tentative de suppression
                    client.publish(`game/clients/${clientId}`, JSON.stringify({action:'hello'}), { retain: false, qos: 0 })
                    return;
                }
                if (currentConsoleId!=null) { // Si une console est déja affichée
                    window.location.reload();
                    return;
                }
                let consoleId = JSON.parse(data);
                // console.log('Receive console :', consoleId);
                var search = qs.parse(window.location.search);
                if (search.console) {
                    consoleId = search.console;
                    // console.log('Force console :', consoleId);
                }
                currentConsoleId = consoleId;
                if (consoleId==null) {
                    let content = require('./fullIdentity.html');
                    content = eval('`'+content+'`');
                    $('body').html(content);
                } else {
                    var frame = $('<iframe/>')
                        .attr({src:`/client/${consoleId}/index.html`})
                        .css({ 
                            height: '100%', 
                            width: '100%',
                            border: 0,
                            // margin: 0, 
                            // padding: 0,
                            display: 'block',
                        })
                        .on('load', function() { 
                            // console.log('iframe onload : ');
                            var innerDocHead = frame.contents().find('head');
                            innerDocHead.append(`<script type="text/javascript">
                                var head = document.head;
                                var s1 = document.createElement('script');
                                s1.type = 'text/javascript',
                                s1.src = 'script.js';
                                var s2 = document.createElement('script');
                                s2.type = 'text/javascript',
                                s2.src = '../melu-mqtt.js';
                                var c1 = document.createElement('link');
                                c1.rel = 'stylesheet';
                                c1.href = 'style.css';
                                head.appendChild(s1);
                                head.appendChild(s2);
                                head.appendChild(c1);
                            </script>`)
                        })
                        .appendTo('body');
                }


            },
            'game/clients/+': parts=>{
                let content = JSON.parse(data);
                // console.log('Commande :', content.action);
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

