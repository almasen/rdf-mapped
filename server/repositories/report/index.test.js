const userRepository = require("../user");
const reportUserRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let registrationExample1, userExample1, registrationExample2, userExample2, reportUser;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    registrationExample2 = testHelpers.getRegistrationExample2();
    userExample2 = testHelpers.getUserExample2();
    reportUser = testHelpers.getReportUser();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert report and find work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    const insertRegistrationRepository2 = await registrationRepository.insert(registrationExample2);
    userExample2.email = insertRegistrationRepository2.rows[0].email;
    const insertUserResult2 = await userRepository.insert(userExample2);

    reportUser.userReported = insertUserResult.rows[0].id;
    reportUser.userReporting = insertUserResult2.rows[0].id;
    const insertReportUser = await reportUserRepository.insert(reportUser);
    const findReportUserResult = await reportUserRepository.findByUserId(insertUserResult.rows[0].id);
    const findReportUserResult2 = await reportUserRepository.findByUserId(insertUserResult2.rows[0].id);
    const findResult = await reportUserRepository.find(insertReportUser.rows[0].id);

    reportUser.id = insertReportUser.rows[0].id;
    expect(insertReportUser.rows[0]).toMatchObject(findReportUserResult.rows[0]);
    expect(insertReportUser.rows[0]).toMatchObject(findReportUserResult2.rows[0]);
    expect(reportUser).toMatchObject(findResult.rows[0]);
});

test('delete report works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    const insertRegistrationRepository2 = await registrationRepository.insert(registrationExample2);
    userExample2.email = insertRegistrationRepository2.rows[0].email;
    const insertUserResult2 = await userRepository.insert(userExample2);

    reportUser.userReported = insertUserResult.rows[0].id;
    reportUser.userReporting = insertUserResult2.rows[0].id;
    await reportUserRepository.insert(reportUser);
    await reportUserRepository.removeByUserId(15);
    const findReportUserResult = await reportUserRepository.findByUserId(insertUserResult.rows[0].id);

    await reportUserRepository.removeByUserId(insertUserResult.rows[0].id);
    const findReportUserResult2 = await reportUserRepository.findByUserId(insertUserResult.rows[0].id);

    expect(findReportUserResult.rowCount).toBe(1);
    expect(findReportUserResult2.rowCount).toBe(0);
});
