const pagination = require("./");

test("paginating data for default page works", async () => {
    const data = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
    const result = pagination.getPageData(1, 10, data);
    expect(result.data[0]).toEqual(data[0]);
    expect(result.data[result.data.length - 1]).toEqual(data[9]);
});

test("paginating data for multiple pages works", async () => {
    const data = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
    const result = pagination.getPageData(2, 10, data);
    expect(result.data[0]).toEqual(data[10]);
    expect(result.data[result.data.length - 1]).toEqual(data[19]);
});
