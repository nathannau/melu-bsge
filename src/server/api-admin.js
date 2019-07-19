
var express = require('express');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var gameConfig = new (require('./game-config'))('./db/game.db');

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

module.exports = function() {

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
        // Controles
        .get('/controles', async function(req, res) {
            console.log('GET /controles');

            var datas = await gameConfig.getControles();

            res.json({ 
                status: "success",
                datas: datas
            });
        })
        .get('/controles/:id', async function(req, res) {
            console.log('GET /controles/:id');

            var data = await gameConfig.getControle(req.params.id);
            if (data==undefined)
                res.status(404).send('controle not found');
            else
                res.json({ 
                    status: "success",
                    datas: data
                });
        })
        .post('/controles/:id', async function(req, res) {
            console.log('POST /controles/:id');

            await gameConfig.setControle(req.params.id, req.body);
            res.json({ 
                status: "success",
            });
        })
        .delete('/controles/:id', async function(req, res) {
            console.log('DELETE /controles/:id');

            await gameConfig.deleteControle(req.params.id);
            res.json({ 
                status: "success",
            });
        })
        // Consoles
        .get('/consoles', async function(req, res) {
            console.log('GET /consoles');

            var datas = await gameConfig.getConsoles();

            res.json({ 
                status: "success",
                datas: datas
            });
        })
        .get('/consoles/:id', async function(req, res) {
            console.log('GET /consoles/:id');

            var data = await gameConfig.getConsole(req.params.id);
            if (data==undefined)
                res.status(404).send('console not found');
            else
                res.json({ 
                    status: "success",
                    datas: data
                });
        })
        .post('/consoles/:id', async function(req, res) {
            console.log('POST /consoles/:id');

            await gameConfig.setConsole(req.params.id, req.body);
            res.json({ 
                status: "success",
            });
        })
        .delete('/consoles/:id', async function(req, res) {
            console.log('DELETE /consoles/:id');

            await gameConfig.deleteConsole(req.params.id);
            res.json({ 
                status: "success",
            });
        })
        // Gestionnaire
        .get('/gestionnaires', async function(req, res) {
            console.log('GET /gestionnaires');

            var datas = await gameConfig.getGestionnaires();

            res.json({ 
                status: "success",
                datas: datas
            });
        })
        .get('/gestionnaires/:id', async function(req, res) {
            console.log('GET /gestionnaires/:id');

            var data = await gameConfig.getGestionnaire(req.params.id);
            if (data==undefined)
                res.status(404).send('gestionnaire not found');
            else
                res.json({ 
                    status: "success",
                    datas: data
                });
        })
        .post('/gestionnaires/:id?', async function(req, res) {
            console.log('POST /gestionnaires/:id');

            await gameConfig.setGestionnaire(req.params.id, req.body);
            res.json({ 
                status: "success",
            });
        })
        .delete('/gestionnaires/:id', async function(req, res) {
            console.log('DELETE /gestionnaires/:id');

            await gameConfig.deleteGestionnaire(req.params.id);
            res.json({ 
                status: "success",
            });
        })


        // Test
        .get('/test', /*hasRule('admin'),*/ async function(req, res) {
            console.log("/test");

            var datas = await gameConfig.export();
            gameConfig.import(datas);

            res.json({ 
                status: "success",
                datas: datas
            });
        });
}
