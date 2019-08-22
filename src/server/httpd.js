'use strict'; 

module.exports = function(mqttServer) {
    /* Init Serveur de fichier */
    var express = require('express');
    var apiAdmin = require('./api-admin');
    var apiManager = require('./api-manager');
    var fsClient = require('./fs-client');

    var app = express();
    app.use('/client', fsClient())
    app.use(express.static(__dirname + '/../../public'))
    app.use('/api/admin', apiAdmin(mqttServer))
    app.use('/api/manager', apiManager())
    app.listen(8080);

    return app;


};