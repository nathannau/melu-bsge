'use strict'; 

const fs = require('fs')
const sqlite = require('sqlite3');

class States {
    constructor(path) {
        this._path = path
        var mustInit = !fs.existsSync(this._path);
        this.db = new sqlite.Database(this._path);

        if (mustInit)
            this.InitDatabase();
    }

    /**
     * initialise la Database
     * @api private
     */
    InitDatabase() {
        this.db.exec(`CREATE TABLE client(
            clientId TEXT PRIMARY KEY,
            console TEXT
        )`);
        this.db.exec(`CREATE TABLE controle(
            controleId TEXT PRIMARY KEY,
            value TEXT
        )`);
    }

    /**
     * initialise la Database
     * @api public
     */
    Clear() {
        this.db.close();
        fs.unlinkSync(this._path);
        this.db = new sqlite.Database(this._path);
        this.InitDatabase();
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

module.exports = States;
