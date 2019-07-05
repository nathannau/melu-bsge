/* Init MQTT */
var mosca = require('mosca');
var settings = {
    port: 1883,
    http: {
        port: 8082
    }
};
var server = new mosca.Server(settings);
server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});
// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});


/* Init Serveur de fichier */
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'))
app.listen(8080);

/* SQLite */
var sqlite = require('sqlite3');




