require("dotenv").config();
process.env.NODE_ENV = 'test';
require("../../util/log");
const db = require("../../database/connection");

afterAll(() => { // close database pool after finishing test suite
    return db.end();
});
