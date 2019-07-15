
var express = require('express');
var jwt = require('jsonwebtoken');
var fs = require('fs');

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
        .post('/login', function(req,res) {
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
        .get('/test', hasRule('admin'), function(req,res) {
            console.log("/test");
            console.log("req.query : ", req.query);
            console.log("req.body : ", req.body);
            console.log("req.url : ", req.url);
            console.log("req.xhr : ", req.xhr);
            
            res.json({ 
                status: "success"
            });
        });
}
