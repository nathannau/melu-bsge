'use strict'; 

var express = require('express');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var gameConfig = new (require('./game-config'))('./db/game.db');


module.exports = function() {

    return express.Router()
        .get('/:consoleId/:file', async function(req, res) {
            console.log('GET /client/consoleId/:id', req.params.consoleId, req.params.file);
            
            // var data = await gameConfig.getControle(req.params.id);
            // if (data==undefined)
                res.status(404).send('controle not found');
            // else
            //     res.json({ 
            //         status: "success",
            //         data: data
            //     });
        })

};