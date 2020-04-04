require("dotenv").config();
process.env.NODE_ENV = 'test';
require("../../util/log");
require('twilio');
const db = require("../../database");

// jest.mock("twilio", () => jest.fn()); // prevent actual initalization of Twilio client in tests

// afterAll(() => { // close database pool after finishing test suite
//     return db.end();
// });
