const errorRoute = require("./");
const request = require("supertest");
const app = require("../../app");

beforeEach(() => {
    process.env.NO_AUTH=1;
});

afterEach(async () => {
    process.env.NO_AUTH=0;
    jest.clearAllMocks();
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

test('bug report endpoint in case of a system error returns error message as expected', async () => {

    const response = await request(app)
        .get("/error?data=undefined")
        .send();

    expect(response.body.message).toBe("Unknown system error.");
    expect(response.status).toBe(500);
});

test('bug report endpoint in case of a custom error query returns custom error as expected', async () => {

    const response = await request(app)
        .get("/error?status=400&message=Bad%20request&data=undefined")
        .send();

    expect(response.body.message).toBe("Bad request");
    expect(response.status).toBe(400);
});
