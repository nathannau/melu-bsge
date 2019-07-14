'use strict'; 

module.exports = function() {
    /* Init Serveur de fichier */
    var express = require('express');
    var apiAdmin = require('./api-admin');

    var app = express();
    app.use(express.static(__dirname + '/../../public'))
    app.use('/api/admin', apiAdmin())
    app.listen(8080);

    return app;


};