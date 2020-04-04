const registrationRepository = require("./");
const testHelpers = require("../../test/helpers");

let registrationExample1, registrationExample2;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    registrationExample2 = testHelpers.getRegistrationExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert registration and findByEmail registration work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    const findRegistrationResult = await registrationRepository.findByEmail(insertRegistrationResult.rows[0].email);
    expect(insertRegistrationResult.rows[0]).toMatchObject(findRegistrationResult.rows[0]);
});

test('find all registrations', async () => {
    const insertRegistrationResult1 = await registrationRepository.insert(registrationExample1);
    const insertRegistrationResult2 = await registrationRepository.insert(registrationExample2);
    const findRegistrationResult = await registrationRepository.findAll();
    expect(insertRegistrationResult1.rows[0]).toMatchObject(findRegistrationResult.rows[0]);
    expect(insertRegistrationResult2.rows[0]).toMatchObject(findRegistrationResult.rows[1]);
});

test('registration update works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    const insertedRegistration = insertRegistrationResult.rows[0];
    insertedRegistration.emailFlag = 1;
    insertedRegistration.idFlag = 1;
    insertedRegistration.phoneFlag = 1;

    const updateRegistrationResult = await registrationRepository.update(insertedRegistration);
    expect(updateRegistrationResult.rows[0]).toMatchObject(insertedRegistration);
});
