
var express = require('express');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var gameConfig = new (require('./game-config'))('./db/game.db');
var topicParse = require('../shared/topic-parse');

const CONFIG_FILE = 'config-admin.json';
function getConfig()
{
    var mustWrite = false;
    var config = {}; 

    try {
        if (fs.existsSync(CONFIG_FILE))
            config = JSON.parse(fs.readFileSync(CONFIG_FILE, { 'encoding': 'utf-8' }));
    } catch { 
        mustWrite = true;
    }

    if (!config.key) {
        mustWrite = true;
        config.key = "";
        while(config.key.length<30) 
            config.key += Math.floor(Math.random() * 36).toString(36);
    }

    if (!config.pwd) {
        mustWrite = true;
        config.pwd = "";
        while(config.pwd.length<10)
            config.pwd += Math.floor(Math.random() * 36).toString(36);
    }

    if (mustWrite)
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 4), { encoding: 'utf-8' });
    
    return config;
}

function hasRule(rules) {
    if (!Array.isArray(rules)) rules = [rules];
    var config = getConfig();

    return function(req, res, next) {
        // next(); return;
        var parts = req.headers.authorization ? req.headers.authorization.split(' ') : [];
        if (parts.length != 2)
            res.status(401).send('Unauthorized : Format is Authorization: Bearer [token]');
        else if (parts[0].toLowerCase() != 'bearer')
            res.status(401).send('Unauthorized : Format is Authorization: Bearer [token]');
        else {
            var token = parts[1];
            try {
                var payload = jwt.verify(token, config.key);
                if (!rules.includes(payload.rule))
                    res.status(401).send('Unauthorized : Unauthorized access');
                else
                    next();
            } catch {
                res.status(401).send('Unauthorized : Invalid token');
            }
        }
    };
}

module.exports = function(mqttServer) {
    var gameTopics = { };
    mqttServer.on('published', function(packet, client) {
        if (topicParse('game/#', packet.topic))
            gameTopics[packet.topic] = !!packet.payload;
    });

    return express.Router()
        .use(express.json({'limit':'5120kb'}))
        // Login
        .post('/login', function(req, res) {
            console.log("/login");
            var config = getConfig();

            if (config.pwd==req.body.password)
                res.json({ 
                    status: "success",
                    token: jwt.sign({rule:'admin'}, config.key)
                });
            else
                res.json({ status: "error"});
        })
        // Config
        .get('/config', hasRule('admin'), async function(req, res) {
            console.log('GET /config');

            var data = await gameConfig.export();
            res.json({ 
                status: "success",
                data: data
            });
        })
        .post('/config', hasRule('admin'), async function(req, res) {
            console.log('POST /config');

            await gameConfig.import(req.body);
            res.json({ 
                status: "success",
            });
        })
        // Partie
        .get('/game/start', hasRule('admin'), async function(req, res) {
            console.log('GET /game/start');

            Object.keys(gameTopics).forEach(function(topic){
                if (gameTopics[topic])
                    mqttServer.publish({
                        topic: topic,
                        payload: [],
                        qos: 0,
                        retain: true
                    });
            });

            var controles = await gameConfig.getControles();
            controles.forEach(controle=>{
                console.log(controle.controleId, controle.defaultValue);
                mqttServer.publish({
                    topic: `game/controls/${controle.controleId}`,
                    payload: controle.defaultValue,
                    qos: 0,
                    retain: true
                });
            })


            res.json({ 
                status: "success",
            });
        })
        // Controles
        .get('/controles', hasRule('admin'), async function(req, res) {
            console.log('GET /controles');

            var datas = await gameConfig.getControles();
            res.json({ 
                status: "success",
                datas: datas
            });
        })
        .get('/controles/:id', hasRule('admin'), async function(req, res) {
            console.log('GET /controles/:id');

            var data = await gameConfig.getControle(req.params.id);
            if (data==undefined)
                res.status(404).send('controle not found');
            else
                res.json({ 
                    status: "success",
                    data: data
                });
        })
        .post('/controles/:id', hasRule('admin'), async function(req, res) {
            console.log('POST /controles/:id');

            await gameConfig.setControle(req.params.id, req.body);
            res.json({ 
                status: "success",
            });
        })
        .delete('/controles/:id', hasRule('admin'), async function(req, res) {
            console.log('DELETE /controles/:id');

            await gameConfig.deleteControle(req.params.id);
            res.json({ 
                status: "success",
            });
        })
        // Consoles
        .get('/consoles', hasRule('admin'), async function(req, res) {
            console.log('GET /consoles');

            var datas = await gameConfig.getConsoles();

            res.json({ 
                status: "success",
                datas: datas
            });
        })
        .get('/consoles/:id', hasRule('admin'), async function(req, res) {
            console.log('GET /consoles/:id');

            var data = await gameConfig.getConsole(req.params.id);
            if (data==undefined)
                res.status(404).send('console not found');
            else
                res.json({ 
                    status: "success",
                    data: data
                });
        })
        .post('/consoles/:id', hasRule('admin'), async function(req, res) {
            console.log('POST /consoles/:id');

            await gameConfig.setConsole(req.params.id, req.body);
            res.json({ 
                status: "success",
            });
        })
        .delete('/consoles/:id', hasRule('admin'), async function(req, res) {
            console.log('DELETE /consoles/:id');

            await gameConfig.deleteConsole(req.params.id);
            res.json({ 
                status: "success",
            });
        })
        // Gestionnaire
        .get('/gestionnaires', hasRule('admin'), async function(req, res) {
            console.log('GET /gestionnaires');

            var datas = await gameConfig.getGestionnaires();

            res.json({ 
                status: "success",
                datas: datas
            });
        })
        .get('/gestionnaires/:id', hasRule('admin'), async function(req, res) {
            console.log('GET /gestionnaires/:id');

            var data = await gameConfig.getGestionnaire(req.params.id);
            if (data==undefined)
                res.status(404).send('gestionnaire not found');
            else
                res.json({ 
                    status: "success",
                    data: data
                });
        })
        .post('/gestionnaires/:id?', hasRule('admin'), async function(req, res) {
            console.log('POST /gestionnaires/:id');

            var id = await gameConfig.setGestionnaire(req.params.id, req.body);
            res.json({ 
                status: "success",
                id: id
            });
        })
        .delete('/gestionnaires/:id', hasRule('admin'), async function(req, res) {
            console.log('DELETE /gestionnaires/:id');

            await gameConfig.deleteGestionnaire(req.params.id);
            res.json({ 
                status: "success",
            });
        })


        // // Test
        // .get('/test', /*hasRule('admin'),*/ async function(req, res) {
        //     console.log("/test");

        //     var datas = await gameConfig.export();
        //     gameConfig.import(datas);

        //     res.json({ 
        //         status: "success",
        //         datas: datas
        //     });
        // });
}
