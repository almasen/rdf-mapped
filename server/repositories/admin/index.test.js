const adminRepo = require("./");
const db = require("../../database/connection");

const testHelpers = require("../../test/helpers");

let admin1;

const insertTestObject = async () => {
    const query = "INSERT INTO admin(email, username, password_hash, salt) VALUES ($1, $2, $3, $4) RETURNING *";
    const params = [admin1.email, admin1.username, "123", "123"];
    return db.query(query, params);
}

beforeEach(async () => {
    admin1 = testHelpers.getAdmin1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('finding by email works', async () => {
    await insertTestObject();
    const findResult = await adminRepo.findByEmail(admin1.email);
    const findRecord = findResult.rows[0];
    expect(findRecord.username).toStrictEqual(admin1.username);
});
