const admin = require("./");

const testHelpers = require("../../test/helpers");

const adminRepo = require("../../repositories/admin");
const mail = require("../mail");

jest.mock("../../repositories/admin");
jest.mock("../mail");

let admin1;

beforeEach(() => {
    admin1 = testHelpers.getAdmin1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("logging in admin works", async () => {
    admin1.id = 1;
    adminRepo.findByEmail.mockResolvedValue({
        rows: [{
            ...admin1,
        }],
    });
    const token = await admin.logInAdmin(admin1.email, "password");

    const name = admin.authenticateAdmin(token);

    expect(adminRepo.findByEmail).toHaveBeenCalledTimes(1);
    expect(name).toStrictEqual(admin1.username);
});

test("failure to logging in as admin throws appropriate error messages", async () => {
    // invalid email
    adminRepo.findByEmail.mockResolvedValueOnce({
        rows: [],
    });
    try {
        await admin.logInAdmin("non-existent@email.com", "somepass");
        fail("Should not reach here.");
    } catch (error) {
        expect(error.message).toStrictEqual("Invalid admin email.")
    }

    // correct email, invalid password
    adminRepo.findByEmail.mockResolvedValueOnce({
        rows: [{
            ...admin1,
        }],
    });
    try {
        await admin.logInAdmin(admin1.name, "incorrect-password");
        fail("Should not reach here.");
    } catch (error) {
        expect(error.message).toStrictEqual("Invalid admin password.")
    }
});

test("logging for weekly admin summary works", async () => {
    mail.sendEmail.mockResolvedValue();
    admin.logBugReport({
        email: "test@test.com",
        report: "this doesn't work",
    });

    admin.logContactRequest({
        email: "test@test.com",
        request: "How do I use this site?",
    });

    admin.sendSummary();
    expect(mail.sendEmail).toHaveBeenCalledTimes(1);
});
