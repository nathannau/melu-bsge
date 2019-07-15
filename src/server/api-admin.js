
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
    if (typeof(rules)!='Array') rules = [rules];
    return function(req, res) {
        res.send(401, 'Unauthorized : invalid token');
    };
}

module.exports = function() {

    return express.Router()
        .use(express.json({'limit':'5120kb'}))
        .post('/login', function(req,res) {
            console.log("/login");
            //console.log('req :', req.params, req.headers, req.body);
//            console.log('res : ', res);
            var config = getConfig();

            var auth = req.headers.authorization;
            var val = jwt.verify(auth, config.key);
            console.log('valid : ', val);

            if (config.pwd==req.body.password)
                res.json({ 
                    status: "success",
                    token: jwt.sign({rule:'admin'}, config.key)
                });
            else
                res.json({ status: "error"});
            //
        });
}
