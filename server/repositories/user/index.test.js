const userRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let userExample1, userExample2, registrationExample1, registrationExample2;

beforeEach(() => {
    userExample1 = testHelpers.getUserExample1();
    userExample2 = testHelpers.getUserExample2();
    registrationExample1 = testHelpers.getRegistrationExample1();
    registrationExample2 = testHelpers.getRegistrationExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();

});

test('insert user and findById user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const findUserResult = await userRepository.findById(insertUserResult.rows[0].id);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('find all users', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    const insertRegistrationResult2 = await registrationRepository.insert(registrationExample2);

    userExample1.email = insertRegistrationResult.rows[0].email;
    userExample2.email = insertRegistrationResult2.rows[0].email;

    const insertUserResult1 = await userRepository.insert(userExample1);
    const insertUserResult2 = await userRepository.insert(userExample2);
    const findUserResult = await userRepository.findAll();
    expect(insertUserResult1.rows[0]).toMatchObject(findUserResult.rows[0]);
    expect(insertUserResult2.rows[0]).toMatchObject(findUserResult.rows[1]);
});
