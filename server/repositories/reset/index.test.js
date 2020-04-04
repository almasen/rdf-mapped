const userRepository = require("../user");
const resetRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let userExample1, registrationExample1;

beforeEach(() => {
    userExample1 = testHelpers.getUserExample1();
    registrationExample1 = testHelpers.getRegistrationExample1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();

});

test('insert token and find token work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const userId = insertUserResult.rows[0].id;
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + (1 * 60 * 60 * 1000));
    const insertTokenResult = await resetRepository.insertResetToken({
        userId: userId,
        token: "333333",
        expiryDate: expiry});
    const findTokenResult = await resetRepository.findLatestByUserId(userId);
    expect(insertTokenResult.rows[0]).toMatchObject(findTokenResult.rows[0]);
});
