require("dotenv").config();
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = process.env.TEST_LOG_LEVEL ? process.env.TEST_LOG_LEVEL : 'off';
require("../../util/log");
const db = require("../../database/connection");

afterAll(() => { // close database pool after finishing test suite
    return db.end();
});
