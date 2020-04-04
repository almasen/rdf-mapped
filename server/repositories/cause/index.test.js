const testHelpers = require("../../test/helpers");
const causeRepository = require("./");

let cause;

beforeEach(() => {
    cause = testHelpers.getCause();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert works', async () => {
    const insertResult = await causeRepository.insert(cause);
    const causeId = insertResult.rows[0].id;
    expect(insertResult.rows[0]).toMatchObject({
        'id': causeId,
        ...cause
    });
});

test('find works', async () => {
    const insertResult = await causeRepository.insert(cause);
    const causeId = insertResult.rows[0].id;
    const findAllResult = await causeRepository.findAll();
    const findByIdResult = await causeRepository.findById(causeId);
    const findByNameResult = await causeRepository.findByName(cause.name);
    expect(findAllResult.rows[0]).toMatchObject({
        'id': causeId,
        ...cause
    })
    expect(findByIdResult.rows[0]).toMatchObject({
        'id': causeId,
        ...cause
    })
    expect(findByNameResult.rows[0]).toMatchObject({
        'id': causeId,
        ...cause
    })
});
