const testHelpers = require("../../../test/helpers");
const selectedCauseRepository = require("./");
const causeRepository = require("../");
const userRepository = require("../../user");
const registrationRepository = require("../../registration");

let registrationExample3, cause, userExample3;

beforeEach(() => {
    registrationExample3 = testHelpers.getRegistrationExample3();
    cause = testHelpers.getCause();
    userExample3 = testHelpers.getUserExample3();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause)
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(userId, causeId);
    expect(insertResult.rows[0]).toMatchObject({
        userId: userId,
        causeId: causeId
    });
});
test('find works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause)
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(userId, causeId);
    const findResult = await selectedCauseRepository.find(userId, causeId);
    const findByCauseIdResult = await selectedCauseRepository.findByCauseId(causeId);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(userId);
    expect(findResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByCauseIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByUserIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
});
