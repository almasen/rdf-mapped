const sorting = require("./");
const distance = require("../distance");

jest.mock("../distance");

const event0 = {
    date: "01/01/2020",
    title: "event0",
    causeName: "a",
};

const event1 = {
    date: "01/09/1420",
    title: "event1",
    causeName: "a",
};

const event2 = {
    date: "01/09/1420",
    title: "event2",
    causeName: "b",
};

test("sorting by time works", async () => {
    distance.getDistance.mockReturnValue(0);
    const result = sorting.sortByTimeAndDistance([event0, event1], {});
    expect(result[0].date).toStrictEqual(event1.date);
    expect(result[1].date).toStrictEqual(event0.date);

    const result2 = sorting.sortByTimeAndDistance([event1, event0], {});
    expect(result2[0].date).toStrictEqual(event1.date);
    expect(result2[1].date).toStrictEqual(event0.date);
});

test("sorting events by time with the same date gives back the same result as expected", async () => {
    distance.getDistance.mockReturnValue(0);
    const result = sorting.sortByTimeAndDistance([event1, event2], {});
    expect(result[0].date).toStrictEqual(event1.date);
    expect(result[1].date).toStrictEqual(event2.date);
    expect(result[0].title).toStrictEqual(event1.title);
    expect(result[1].title).toStrictEqual(event2.title);

    const result2 = sorting.sortByTimeAndDistance([event2, event1], {});
    expect(result2[0].date).toStrictEqual(event1.date);
    expect(result2[1].date).toStrictEqual(event2.date);
    expect(result2[0].title).toStrictEqual(event2.title);
    expect(result2[1].title).toStrictEqual(event1.title);
});

test("grouping events by causes works", async () => {
    const result = sorting.groupByCause([event0, event2, event1]);
    expect(result.a.length).toBe(2);
    expect(result.b.length).toBe(1);
    expect(result.b[0].title).toStrictEqual(event2.title);
});

