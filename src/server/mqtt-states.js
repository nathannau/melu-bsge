'use strict'; 

const fs = require('fs')
const sqlite = require('sqlite3');

class States {
    constructor(path) {
        this._path = path
        var mustInit = !fs.existsSync(this._path);
        this.db = new sqlite.Database(this._path);

        this.initPromise = this.mustInit ? this._initDatabase() : null;
    }

    async waitInit()
    {
        if (this.initPromise)
            await this.initPromise;
        this.initPromise = null;
    }

    /**
     * initialise la Database
     * @api private
     */
    async _initDatabase() {
        return new Promise(resolve=>{ this.db.serialize(()=>{
            this.db
                .exec(`CREATE TABLE client(
                    clientId TEXT PRIMARY KEY,
                    console TEXT
                )`)
                .exec(`CREATE TABLE controle(
                    controleId TEXT PRIMARY KEY,
                    value TEXT
                )`)
                .run(`SELECT 1`, ()=>{resolve();})
            ;
        })});
    }

    /**
     * initialise la Database
     * @api public
     */
    clear() {
        this.db.close();
        fs.unlinkSync(this._path);
        this.db = new sqlite.Database(this._path);
        this.initPromise = this._initDatabase();
    }

    async getClients() {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.all(`SELECT * FROM client`, (err, rows) => { resolve(rows) })
        });
    }

    async setClient(clientId, consoleId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.run(`REPLACE INTO client(clientId, console) VALUES(?, ?)`, [clientId, consoleId], (result, err) => { resolve });
        });
    }

    async getControles() {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.all(`SELECT * FROM controle`, (err, rows) => { resolve(rows) })
        });
    }

    async setControle(controleId, value) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.run(`REPLACE INTO controle(controleId, value) VALUES(?, ?)`, [controleId, value], (result, err) => { resolve });
        });
    }

}

module.exports = States;
