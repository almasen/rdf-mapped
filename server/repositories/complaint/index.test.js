const userRepository = require("../user");
const complaintRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let registrationExample1, userExample1, complaint;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    complaint = testHelpers.getComplaint();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert complaint and findByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    complaint.userId = insertUserResult.rows[0].id;
    const insertComplaintResult = await complaintRepository.insert(complaint);
    const findComplaintResult = await complaintRepository.find(insertComplaintResult.rows[0].id);
    const findComplaintResultByUserId = await complaintRepository.findByUserId(insertUserResult.rows[0].id);

    complaint.id = insertComplaintResult.rows[0].id;
    expect(insertComplaintResult.rows[0]).toMatchObject(findComplaintResult.rows[0]);
    expect(insertComplaintResult.rows[0]).toMatchObject(findComplaintResultByUserId.rows[0]);
    expect(complaint).toMatchObject(findComplaintResult.rows[0]);
});

test('insert complaint and delete work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    complaint.userId = insertUserResult.rows[0].id;
    await complaintRepository.insert(complaint);
    await complaintRepository.removeByUserId(complaint.userId);
    const findComplaintResultByUserId = await complaintRepository.findByUserId(insertUserResult.rows[0].id);

    expect(findComplaintResultByUserId.rowCount).toBe(0);
});