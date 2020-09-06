const informationRepository = require("./");
const testHelpers = require("../../test/helpers");

let informationExample;

beforeEach(() => {
    informationExample = testHelpers.getInformation1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert information and findByType work', async () => {
    const insertInformationResult = await informationRepository.insert(informationExample);
    const findInformationResult = await informationRepository.findByType(insertInformationResult.rows[0].type);

    expect(insertInformationResult.rows[0]).toMatchObject(findInformationResult.rows[0]);
});

test('information update works', async () => {
    const insertInformationResult = await informationRepository.insert(informationExample);
    const insertedInformation = insertInformationResult.rows[0];
    insertedInformation.content = "Nothing";
    const updateInformationResult = await informationRepository.update(insertedInformation);
    expect(updateInformationResult.rows[0]).toMatchObject(insertedInformation);
});
