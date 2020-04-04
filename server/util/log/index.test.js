const log = require("./");

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock("./");

test("production environment logging works", async () => {
    process.env.NODE_ENV = 'production';
    const app = require("../../app");
    expect(log.info).toHaveBeenCalledTimes(1);
});
