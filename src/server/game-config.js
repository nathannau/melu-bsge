'use strict'; 

const fs = require('fs')
const sqlite = require('sqlite3');

class GameConfig {
    constructor(path) {
        this._path = path
        var mustInit = !fs.existsSync(this._path);
        this.db = new sqlite.Database(this._path);

        if (mustInit)
            this.initDatabase();
    }

    /**
     * initialise la Database
     * @api private
     */
    initDatabase() {
        this.db.exec(`CREATE TABLE controle(
            controleId TEXT PRIMARY KEY,
            libelle TEXT,
            defaultValue TEXT,
            type TEXT,
            config TEXT
        )`);
        this.db.exec(`CREATE TABLE console(
            consoleId TEXT PRIMARY KEY,
            libelle TEXT,
            type TEXT,
            config TEXT
        )`);
        this.db.exec(`CREATE TABLE gestionnaire(
            gestionnaireId INTEGER PRIMARY KEY,
            libelle TEXT,
            config TEXT
        )`);

        // this.db.run(`INSERT INTO controle(controleId, libelle, defaultValue, type, config) VALUES('controleId', 'libelle', 'defaultValue', 'type', 'config')`);
        // this.db.run(`INSERT INTO console(consoleId, libelle, type, config) VALUES('consoleId', 'libelle', 'type', 'config')`);
        // this.db.run(`INSERT INTO gestionnaire(libelle, config) VALUES('libelle', 'config')`);
    }

    /**
     * initialise la Database
     * @api public
     */
    clear() {
        this.db.close();
        fs.unlinkSync(this._path);
        this.db = new sqlite.Database(this._path);
        this.initDatabase();
    }

    import(data) {

    }

    async export() {
        var queries = {
            controle: `SELECT * FROM controle`,
            console: `SELECT * FROM console`,
            gestionnaire: `SELECT * FROM gestionnaire`
        }
        var datas = {};

        for (var i in queries) {
            console.log('i : ', i);
            await new Promise(resolve=>{
                console.log('query : ', queries[i]);
                this.db.all(queries[i], (err, rows) => {
                    datas[i] = rows;
                    console.log('datas : ', datas);
                    resolve();
                });
            });
        }
        return datas;
    }

    getClients(callback) {
        this.db.all(`SELECT * FROM client`, (err, rows) => {
            //console.log(err, rows);
            if (callback)
                callback(rows)
        })
    }

    setClient(clientId, consoleId) {
        this.db.run(`REPLACE INTO client(clientId, console) VALUES(?, ?)`, [clientId, consoleId], (result, err) => {
            //console.log(result, err);
        })
    }

}

module.exports = GameConfig;
