// following this example https://node-postgres.com/guides/project-structure
const log = require("../../util/log");
const pg = require('pg');
const pgCamelCase = require('pg-camelcase');
const {Pool} = pg;
const types = pg.types;

pgCamelCase.inject(pg);
types.setTypeParser(1700, 'text', parseFloat); // converts Postgres numeric types to js Numbers


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: 5432,
});

const query = (text, params, callback) => {
    log.debug(">>> %s", text);
    if (params && params.length > 0) {
        log.debug(">>> %s", params);
    }
    return pool.query(text, params, callback)
        .then(res => {
            log.debug("<<< %s", JSON.stringify(res.rows));
            return res;
        });
};

module.exports = {
    query,
    end: () => pool.end(),
};
