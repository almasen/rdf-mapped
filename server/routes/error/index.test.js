const errorRoute = require("./");
const request = require("supertest");
const app = require("../../app");

beforeEach(() => {
    process.env.NO_AUTH=1;
});

afterEach(() => {
    process.env.NO_AUTH=0;
    jest.clearAllMocks();
});

test('bug report endpoint in case of a system error returns error message as expected', async () => {

    const response = await request(app)
        .get("/error?token=noAuth&data=undefined")
        .set("authorization", "abc")
        .send();

    expect(response.body.message).toBe("Unknown system error.");
    expect(response.status).toBe(500);
});