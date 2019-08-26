'use strict';

var mqtt = require('mqtt');
var topicParse = require('../shared/topic-parse');

var client = mqtt.connect('mqtt://127.0.0.1:8883')
client.on('connect', function () {
    client.subscribe('game/controls/+', { }, function(err, granted) { if (err) console.error('melu-mqtt : ', err); });
})

var controls = {};

function getControl(controlId, value) {
    controls[controlId] = value;
    window.dispatchEvent(new CustomEvent('get-control', { detail: {
        control: controlId, 
        value: value, 
    }}));
    window.dispatchEvent(new CustomEvent(`get-control-${controlId}`, { detail: {
        value: value, 
    }}));
}

client.on('message', function (topic, message) {
    //console.log('message', topic, message.toString())
    var parts = topicParse('game/controls/+', topic);
    var controlId = parts[0];
    var value = message.toString()
    getControl(controlId, value);
});

function setControl(controlId, value) {
    client.publish(
        `game/controls/${controlId}`, 
        JSON.stringify(value), 
        { retain: true, qos: 0 }, 
        function(err) { if (err) console.error(`Set console (${controlId}, ${value}) : `,err) }
    );
}
window.addEventListener('set-control', function(e) { 
    var controlId = e.detail.control;
    var value = e.detail.value;
    setControl(controlId, value);
});
window.setControl = setControl;

function refreshControl() {
    Object.keys(controls).forEach(controlId=>{
        getControl(controlId, controls[controlId]);
    });

}
window.addEventListener('refresh-control', function() { 
    refreshControl();
});
window.refreshControl = refreshControl;


