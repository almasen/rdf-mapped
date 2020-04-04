const userRepository = require("../user");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");
const authenticationRepository = require("./");

let userExample1, userExample2, registrationExample1, registrationExample2, authenticationExample1, authenticationExample2;
beforeEach(() => {
    userExample1 = testHelpers.getUserExample1();
    userExample2 = testHelpers.getUserExample2();
    registrationExample1 = testHelpers.getRegistrationExample1();
    registrationExample2 = testHelpers.getRegistrationExample2();
    authenticationExample1 = testHelpers.getAuthenticationExample1();
    authenticationExample2 = testHelpers.getAuthenticationExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert authenticationExample1 and findById authenticationExample1 work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    authenticationExample1.userId = insertUserResult.rows[0].id;
    const insertAuthenticationResult = await authenticationRepository.insert(authenticationExample1);
    const findAuthenticationResult = await authenticationRepository.findById(insertAuthenticationResult.rows[0].id);
    expect(insertAuthenticationResult.rows[0]).toMatchObject(findAuthenticationResult.rows[0]);
});

test('find all authentications', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    const insertRegistrationResult2 = await registrationRepository.insert(registrationExample2);

    userExample1.email = insertRegistrationResult.rows[0].email;
    userExample2.email = insertRegistrationResult2.rows[0].email;

    const insertUserResult1 = await userRepository.insert(userExample1);
    const insertUserResult2 = await userRepository.insert(userExample2);

    authenticationExample1.userId = insertUserResult1.rows[0].id;
    authenticationExample2.userId = insertUserResult2.rows[0].id;
    const insertAuthenticationResult1 = await authenticationRepository.insert(authenticationExample1);
    const insertAuthenticationResult2 = await authenticationRepository.insert(authenticationExample2);
    const findAuthenticationResult = await authenticationRepository.findAll();
    expect(insertAuthenticationResult1.rows[0]).toMatchObject(findAuthenticationResult.rows[0]);
    expect(insertAuthenticationResult2.rows[0]).toMatchObject(findAuthenticationResult.rows[1]);
});

test('find most recent auth token', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);

    userExample1.email = insertRegistrationResult.rows[0].email;

    const insertUserResult1 = await userRepository.insert(userExample1);
    const currentUserID = insertUserResult1.rows[0].id;
    authenticationExample1.userId = currentUserID;
    authenticationExample2.userId = currentUserID;
    authenticationExample1.creationDate = "2016-06-22 19:10:25-07";
    authenticationExample2.creationDate = "2018-06-22 19:10:25-07";
    await authenticationRepository.insert(authenticationExample1);
    const insertAuthenticationResult2 = await authenticationRepository.insert(authenticationExample2);
    const findLatestAuthenticationResult = await authenticationRepository.findLatestByUserID(currentUserID);
    expect(findLatestAuthenticationResult.rows[0]).toMatchObject(insertAuthenticationResult2.rows[0]);
    expect(findLatestAuthenticationResult.rowCount).toBe(1);
});
