const userRepository = require("../user");
const settingRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let registrationExample1, userExample1, settingExample;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    settingExample = testHelpers.getSetting();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert setting and findByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    settingExample.userId = insertUserResult.rows[0].id;
    const insertSettingResult = await settingRepository.insert(settingExample);
    const findSettingResultByUserId = await settingRepository.findByUserId(insertUserResult.rows[0].id);

    expect(insertSettingResult.rows[0]).toMatchObject(findSettingResultByUserId.rows[0]);
    expect(settingExample).toMatchObject(findSettingResultByUserId.rows[0]);
});

test('insert settingByUserId and findByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    settingExample.userId = insertUserResult.rows[0].id;
    const insertSettingResult = await settingRepository.insertUserId(settingExample.userId);
    const findSettingResultByUserId = await settingRepository.findByUserId(insertUserResult.rows[0].id);

    settingExample.email = 0;
    settingExample.notification = 0;
    expect(insertSettingResult.rows[0]).toMatchObject(findSettingResultByUserId.rows[0]);
    expect(settingExample).toMatchObject(findSettingResultByUserId.rows[0]);
});
test('insert setting and updates work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    settingExample.userId = insertUserResult.rows[0].id;
    const insertSettingResult = await settingRepository.insert(settingExample);
    const findSettingResultByUserId = await settingRepository.findByUserId(insertUserResult.rows[0].id);

    settingExample.email = settingExample.email + 10;
    const updateSettingResult = await settingRepository.update(settingExample);
    const findAfterUpdate = await settingRepository.findByUserId(settingExample.userId);
    expect(findAfterUpdate.rows[0]).not.toMatchObject(findSettingResultByUserId.rows[0]);
    expect(updateSettingResult.rows[0]).toMatchObject(findAfterUpdate.rows[0]);
    expect(findAfterUpdate.rows[0].email).toBe(settingExample.email);
    expect(settingExample).toMatchObject(findAfterUpdate.rows[0]);
});

test('insert setting and deleteByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    settingExample.userId = insertUserResult.rows[0].id;
    await settingRepository.insert(settingExample);
    await settingRepository.removeByUserId(settingExample.userId);
    const findSettingResultByUserId = await settingRepository.findByUserId(insertUserResult.rows[0].id);

    expect(findSettingResultByUserId.rowCount).toBe(0);
});
