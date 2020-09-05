const filter = require("./");

const testHelpers = require("../../test/helpers");

let course1, course2;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    course2 = testHelpers.getCourse2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("filtering and sorting by title works", async () => {
    const records = [
        {
            title: "b",
            content: "abc",
        },
        {
            title: "a",
            content: "abc",
        },
        {
            title: "a",
            content: "abc",
        },
    ]
    const filteredAndSorted = filter.filterAndSortByTitle(records);
    expect(filteredAndSorted.length).toStrictEqual(2);
    expect(filteredAndSorted[0].title).toStrictEqual("a");
    expect(filteredAndSorted[1].title).toStrictEqual("b");
});

test("grouping by parents works", async () => {
    const records = [
        {
            parId: 1,
            content: "a",
        },
        {
            parId: 2,
            content: "b",
        },
        {
            parId: 2,
            content: "c",
        },
        {
            parId: 3,
            content: "d",
        },
        {
            parId: 3,
            content: "e",
        },
        {
            parId: 3,
            content: "f",
        },
    ]
    const grouped = filter.groupByParent(records, "parId");
    expect(typeof grouped).toStrictEqual("object");
    expect(grouped['1'].length).toStrictEqual(1);
    expect(grouped['2'].length).toStrictEqual(2);
    expect(grouped['3'].length).toStrictEqual(3);
    expect(grouped['1'][0].content).toStrictEqual("a");
    expect(grouped['2'][0].content).toStrictEqual("b");
    expect(grouped['2'][1].content).toStrictEqual("c");
});