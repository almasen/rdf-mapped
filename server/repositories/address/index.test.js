const addressRepository = require("./");
const testHelpers = require("../../test/helpers");

let address;

beforeEach(() => {
    address = testHelpers.getAddress();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and findById work', async () => {
    const insertResult = await addressRepository.insert(address);
    const findResult = await addressRepository.findById(insertResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(insertResult.rows[0]);
});

test('update works', async () => {
    const insertAddressResult = await addressRepository.insert(address);
    const insertedAddress = insertAddressResult.rows[0];
    insertedAddress.city = "Tallinn";
    insertedAddress.lat = 15.3;
    const updateAddressResult = await addressRepository.update(insertedAddress);
    expect(updateAddressResult.rows[0]).toMatchObject(insertedAddress);
});
