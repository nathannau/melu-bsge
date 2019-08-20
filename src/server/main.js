'use strict'; 

var mqttServer = require('./mqtt')();
var expressServer = require('./httpd')(mqttServer);

/* SQLite */
//var sqlite = require('sqlite3');

/* States */
var configMqttState = require('./mqtt-state-config');
var mqttStates = require('./mqtt-states');
var state = new mqttStates('./db/states.db');
configMqttState(mqttServer, state);



