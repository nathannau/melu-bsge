'use strict'; 

const fs = require('fs')
const sqlite = require('sqlite3');

class GameConfig {
    constructor(path) {
        this._path = path
        this.mustInit = !fs.existsSync(this._path);
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
                .exec(`CREATE TABLE controle(
                    controleId TEXT PRIMARY KEY,
                    libelle TEXT,
                    defaultValue TEXT,
                    type TEXT,
                    config TEXT
                )`)
                .exec(`CREATE TABLE console(
                    consoleId TEXT PRIMARY KEY,
                    libelle TEXT,
                    type TEXT,
                    config TEXT
                )`)
                .exec(`CREATE TABLE gestionnaire(
                    gestionnaireId INTEGER PRIMARY KEY,
                    libelle TEXT,
                    config TEXT
                )`)
                // .run(`INSERT INTO controle(controleId, libelle, defaultValue, type, config) VALUES('controleId', 'libelle', 'defaultValue', 'type', 'config')`)
                // .run(`INSERT INTO console(consoleId, libelle, type, config) VALUES('consoleId', 'libelle', 'type', 'config')`)
                // .run(`INSERT INTO gestionnaire(libelle, config) VALUES('libelle', 'config')`)
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

    async import(datas) {
        await this.waitInit();
        return new Promise(resolve=>{
            var queries = {
                controle: { 
                    delete: { query: `DELETE FROM controle` },
                    insert: { query: `INSERT INTO controle (controleId, libelle, defaultValue, type, config) VALUES (?,?,?,?,?)`, args: ['controleId', 'libelle', 'defaultValue', 'type', 'config'] }
                },
                console: {
                    delete: { query: `DELETE FROM console` },
                    insert: { query: `INSERT INTO console(consoleId, libelle, type, config) VALUES (?,?,?,?)`, args: ['consoleId', 'libelle', 'type', 'config'] }
                },
                gestionnaire: {
                    delete: { query: `DELETE FROM gestionnaire` },
                    insert: { query: `INSERT INTO gestionnaire(gestionnaireId, libelle, config) VALUES (?,?,?)`, args: ['gestionnaireId', 'libelle', 'config'] }
                }
            };
    
            this.db.serialize(()=>{
                for (let i in queries) {
                    this.db.run(queries[i].delete.query);
                    for (let j=0; j<datas[i].length; j++) {
                        console.log(queries[i].insert.query, queries[i].insert.args.map(x => datas[i][j][x]));
                        this.db.run(
                            queries[i].insert.query, 
                            queries[i].insert.args.map(x => datas[i][j][x]),
                            ()=>{ }
                        );
                    }
                }
                this.db.run('SELECT 1', ()=>{ resolve(); } );
            });
        });
    }
    async export() {
        await this.waitInit();
        return new Promise(resolve=>{
            var queries = {
                controle: `SELECT * FROM controle`,
                console: `SELECT * FROM console`,
                gestionnaire: `SELECT * FROM gestionnaire`
            }
            var datas = {};
    
            this.db.serialize(()=>{
                for (let i in queries)
                    this.db.all(queries[i], (err, rows) => { datas[i] = rows; });
                this.db.run('SELECT 1', ()=>{ resolve(datas); } );
            });
        });
    }

    // Controles
    async getControles() {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.all(`SELECT * FROM controle`, (err, rows) => { resolve(rows) });
        });
    }
    async getControle(controleId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.get(`SELECT * FROM controle WHERE controleId=?`, [controleId], (err, row) => { resolve(row) });
        });
    }
    async setControle(controleId, values = {}) {
        await this.waitInit();
        return new Promise(resolve=>{
            var flds = [ 'controleId' ], params = [ '?' ], vals = [ controleId ];
            ['libelle', 'defaultValue', 'type', 'config'].forEach(i=>{
                if (values[i]!=undefined) {
                    flds.push(i);
                    params.push('?');
                    vals.push(values[i]);
                }
            });
            this.db.run(`REPLACE INTO controle(` + flds.join(',') + `) VALUES(` + params.join(',') + `)`, vals, (result, err) => { resolve(); });
        });
    }
    async deleteControle(controleId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.run(`DELETE FROM controle WHERE controleId=?`, [controleId], (result, err) => { resolve() });
        });
    }
    // Consoles
    async getConsoles() {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.all(`SELECT * FROM console`, (err, rows) => { resolve(rows) });
        });
    }
    async getConsole(consoleId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.get(`SELECT * FROM console WHERE consoleId=?`, [consoleId], (err, row) => { resolve(row) });
        });
    }
    async setConsole(consoleId, values = {}) {
        await this.waitInit();
        return new Promise(resolve=>{
            var flds = [ 'consoleId' ], params = [ '?' ], vals = [ consoleId ];
            ['libelle', 'type', 'config'].forEach(i=>{
                if (values[i]!=undefined) {
                    flds.push(i);
                    params.push('?');
                    vals.push(values[i]);
                }
            });
            this.db.run(`REPLACE INTO console(` + flds.join(',') + `) VALUES(` + params.join(',') + `)`, vals, (result, err) => { resolve(); });
        });
    }
    async deleteConsole(consoleId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.run(`DELETE FROM console WHERE consoleId=?`, [consoleId], (result, err) => { resolve() });
        });
    }
    // Gestionnaire
    async getGestionnaires() {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.all(`SELECT * FROM gestionnaire`, (err, rows) => { resolve(rows) });
        });
    }
    async getGestionnaire(gestionnaireId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.get(`SELECT * FROM gestionnaire WHERE gestionnaireId=?`, [gestionnaireId], (err, row) => { resolve(row) });
        });
    }
    async setGestionnaire(gestionnaireId, values = {}) {
        await this.waitInit();
        return new Promise(resolve=>{
            values.gestionnaireId = gestionnaireId;
            var flds = [ ], params = [ ], vals = [ ];
            ['gestionnaireId', 'libelle', 'config'].forEach(i=>{
                if (values[i]!=undefined) {
                    flds.push(i);
                    params.push('?');
                    vals.push(values[i]);
                }
            });
            this.db.run(`REPLACE INTO gestionnaire(` + flds.join(',') + `) VALUES(` + params.join(',') + `)`, vals, (result, err) => { console.log(result, err, this); resolve(); });
            if (!gestionnaireId)
                this.db.get(`SELECT last_insert_rowid()`, (result, err) => { console.log(result, err, this); resolve(); });
        });
    }
    async deleteGestionnaire(gestionnaireId) {
        await this.waitInit();
        return new Promise(resolve=>{
            this.db.run(`DELETE FROM gestionnaire WHERE gestionnaireId=?`, [gestionnaireId], (result, err) => { resolve() });
        });
    }

}

module.exports = GameConfig;
