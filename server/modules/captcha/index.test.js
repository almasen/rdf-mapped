const captcha = require("./");

const testHelpers = require("../../test/helpers");

const got = jest.createMockFromModule("got");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("reCAPTCHA verification function works as intended", async () => {
    got.post.mockResolvedValue({
        body: {
            success: false,
        },
    });
    const verificationResponse = await captcha.verifyResponse("test");
    expect(verificationResponse).toBe(false);
});
