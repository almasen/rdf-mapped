const mailService = require("./");

const testHelpers = require("../../test/helpers");

const sgMail = jest.createMockFromModule("@sendgrid/mail");

jest.mock("@sendgrid/mail");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("sending email from default address works", async () => {
    sgMail.send.mockResolvedValue();
    try {
        await mailService.sendEmail(null, "test@test.com", "test subject", "test plain text body", "<p>test html body</p>");
    } catch (error) {
        fail("Err: " + error.message);
    }
});

test("sending email from custom address with only plain text body works", async () => {
    sgMail.send.mockResolvedValue();
    try {
        await mailService.sendEmail("test@test.com", "to@test.com", "test subject", "test plain text body", null);
    } catch (error) {
        fail("Err: " + error.message);
    }
});
