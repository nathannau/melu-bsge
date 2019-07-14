'use strict'; 

var mqttServer = require('./src/server/mqtt')();
var expressServer = require('./src/server/httpd')();

/* SQLite */
//var sqlite = require('sqlite3');

/* States */
var configMqttState = require('./mqtt-state-config');
var mqttStates = require('./src/server/mqtt-states');
var state = new mqttStates('./db/states.db');
configMqttState(mqttServer, state);



