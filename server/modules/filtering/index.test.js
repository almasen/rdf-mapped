const filterer = require("./index.js");


test("where clause matches boolean filters specified", () => {
    expect(filterer.getWhereClause({booleans: ["physical", "women_only"]})).toBe(" where physical = true and women_only = true ");
    expect(filterer.getWhereClause({booleans: ["!physical", "women_only"]})).toBe(" where physical = false and women_only = true ");
    expect(filterer.getWhereClause({booleans: ["!physical", "!women_only"]})).toBe(" where physical = false and women_only = false ");
    expect(filterer.getWhereClause({booleans: []})).toBe("");
});

test("where clause matches object filters specified", () => {
    const filters = {
        booleans: ['physical', '!women_only'],
        availabilityStart: '2020-03-03',
        availabilityEnd: '2020-12-03',
    };
    const expectedResponse = ` where physical = true and women_only = false and date >= \'${filters.availabilityStart}\' and date <= \'${filters.availabilityEnd}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having only object filters and not booleans works", () => {
    const filters = {
        availabilityStart: '2020-03-03',
        availabilityEnd: '2020-12-03',
    };
    const expectedResponse = ` where date >= \'${filters.availabilityStart}\' and date <= \'${filters.availabilityEnd}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having only availabilityEnd works", () => {
    const filters = {
        availabilityEnd: '2020-12-03',
    };
    const expectedResponse = ` where date <= \'${filters.availabilityEnd}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having only availabilityStart filter works", () => {
    const filters = {
        availabilityStart: '2020-03-03',
    };
    const expectedResponse = ` where date >= \'${filters.availabilityStart}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having no filters returns empty where clause", () => {
    const filters = {};
    expect(filterer.getWhereClause(filters)).toBe("");
});

test("having only incorrect boolean filters throws invalid filter error", () => {
    const filters = {booleans: ["hellowrold", "Delete * from db"]};
    expect(() => {
        filterer.getWhereClause(filters);
    }).toThrowError(new Error('One of the filters is invalid'));
});

test("where clause not affected by undefined and null values", () => {
    const filters = {
        booleans: [null, '!women_only'],
        availabilityStart: null,
        availabilityEnd: null,
    };
    const expectedResponse = " where women_only = false ";
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});
