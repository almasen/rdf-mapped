const userRepository = require("../user");
const notificationRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let registrationExample1, userExample1, registrationExample2, userExample2, address, notification;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    registrationExample2 = testHelpers.getRegistrationExample2();
    userExample2 = testHelpers.getUserExample2();
    notification = testHelpers.getNotification();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert notification and findByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    const insertRegistrationRepository2 = await registrationRepository.insert(registrationExample2);
    userExample2.email = insertRegistrationRepository2.rows[0].email;
    const insertUserResult2 = await userRepository.insert(userExample2);

    notification.senderId = insertUserResult2.rows[0].id;
    notification.receiverId = insertUserResult.rows[0].id;
    const insertNotificationResult = await notificationRepository.insert(notification);
    const findNotificationResult = await notificationRepository.findByUserId(insertUserResult.rows[0].id);

    expect(insertNotificationResult.rows[0]).toMatchObject(findNotificationResult.rows[0]);
});