'use strict'; 

var express = require('express');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var gameConfig = new (require('./game-config'))('./db/game.db');


module.exports = function() {

    return express.Router()
        .get('/:consoleId/:file', async function(req, res) {
            console.log('GET /client/:consoleId/:file', req.params.consoleId, '/', req.params.file);
            
            var data = await gameConfig.getConsole(req.params.consoleId);

            if (data==undefined)
                res.status(404).send('console not found');
            else
                var files = JSON.parse(data.config);
                var content;
                var contentType = false;
                switch(req.params.file) {
                    case 'index.html' : contentType='text/html'; content = files.html; break;
                    case 'script.js' : contentType='application/javascript'; content = files.js; break;
                    case 'style.css' : contentType='text/css'; content = files.css; break;
                    default:
                        var index = files.images.findIndex(img=>{ return img.filename==req.params.file; });
                        console.log(index);
                        if (index>=0) {
                            contentType = files.images[index].type; 
                            content = Buffer.from(files.images[index].content, 'base64');
                        }
                        else
                            res.status(404).send('file not found');
                    break;
                }
                if (contentType) {
                    res.contentType(contentType).send(content);
                    // res.json({ 
                    //     status: "success",
                    //     data: files,
                    // });
                }
        })

};