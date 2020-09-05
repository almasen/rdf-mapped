const courseRepo = require("../../repositories/course");
const coursePhaseRepo = require("../../repositories/course/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const phaseRepo = require("../../repositories/phase");

const cache = require("../cache");
const filtering = require("../filtering");

const courseService = require("./");

const testHelpers = require("../../test/helpers");
const course = require("../../repositories/course");

jest.mock("../../repositories/course");
jest.mock("../../repositories/course/phase");
jest.mock("../../repositories/capability");
jest.mock("../../repositories/category");
jest.mock("../../repositories/competency");
jest.mock("../../repositories/phase");

jest.mock("../cache");
jest.mock("../filtering");

let course1, course2, course3, capability1, category1, competency1, capability2, category2, competency2, phase1, phase2;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    course2 = testHelpers.getCourse2();
    course3 = testHelpers.getCourse3();
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    capability2 = testHelpers.getCapability2();
    category2 = testHelpers.getCategory2();
    competency2 = testHelpers.getCompetency2();
    phase1 = testHelpers.getPhase1();
    phase2 = testHelpers.getPhase2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('fetching similar course objects from cache works', async () => {
    cache.has.mockReturnValue(true);
    course1.phases = [1, 2];
    course2.phases = [1];
    course3.phases = [2, 3];
    course1.id = 1;
    course2.id = 2;
    course3.id = 3;
    cache.get.mockReturnValue([course1, course2, course3]);

    const fetchRecords = await courseService.fetchSimilarCourseRecords({ ...course1});

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(course2);
});

test('fetching similar course objects from database works', async () => {
    cache.has.mockReturnValue(false);
    course1.phases = [1, 2];
    course2.phases = [1];
    course3.phases = [2, 3];
    course1.id = 1;
    course2.id = 2;
    course3.id = 3;
    courseRepo.findByFilters.mockResolvedValue({
        rows: [
            { ...course1 },
            { ...course2 },
        ]
    });

    const fetchRecords = await courseService.fetchSimilarCourseRecords({ ...course1 }, 2);

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(course2);
});

test('fetching and resolving course object from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue({...course1});

    const fetchRecord = await courseService.fetchAndResolveCourse(1);

    expect(fetchRecord.title).toStrictEqual(course1.title);
});

test('attempting to fetch course without cached objects fails as expected', async () => {
    cache.has.mockReturnValue(false);

    try {
        const fetchRecord = await courseService.fetchAndResolveCourse(1);
        fail("should not reach here");
    } catch (error) {
        expect(cache.has).toHaveBeenCalledTimes(1);
    }
});

test('fetching courses based on null filters from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([course1, course2, course3]);

    const fetchRecords = await courseService.fetchByFilters({});

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(course1);
});

test('fetching courses based on null filters from database works', async () => {
    cache.has.mockReturnValue(false);
    courseRepo.findByFiltersAndKeywordJoint.mockResolvedValue({
        rows: [
            { ...course1 },
            { ...course2 },
            { ...course3 },
        ]
    });

    const fetchRecords = await courseService.fetchByFilters({});

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(course1);
});

test('fetching courses based on keyword from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([course1, course2, course3]);

    const fetchRecords = await courseService.fetchByFilters({
        capability: -1,
        category: -1,
        competency: -1,
        phase: -1,
        keyword: course1.title,
    });

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(course1);
});

test('fetching courses based on custom filters from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([course1, course2, course3]);

    const fetchRecords1 = await courseService.fetchByFilters({
        capability: 42,
        category: 58,
        competency: 69,
        phase: 666,
    });

    expect(fetchRecords1.length).toStrictEqual(0);

    course2.capabilityId = 42;
    course2.categoryId = 58;
    course2.competencyId = 69;
    course2.phases = [1, 2, 666, 777];

    const fetchRecords2 = await courseService.fetchByFilters({
        capability: 42,
        category: 58,
        competency: 69,
        phase: 666,
    });

    expect(fetchRecords2.length).toStrictEqual(1);
    expect(fetchRecords2[0]).toStrictEqual(course2);
});

test('fetching courses based on custom filters from database works', async () => {
    cache.has.mockReturnValue(false);
    courseRepo.findByFiltersAndKeywordJoint.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });

    const fetchRecords = await courseService.fetchByFilters({
        capability: 1,
        category: 1,
        competency: 1,
        phase: 1,
        keyword: course1.title,
    });

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(course1);
});

test('fetching all from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([course1, course2, course3]);

    const fetchRecords = await courseService.fetchAll();

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(course1);
});

test('fetching all from database works', async () => {
    cache.has.mockReturnValue(false);
    courseRepo.findByFiltersAndKeywordJoint.mockResolvedValue({
        rows: [
            { ...course1 },
            { ...course2 },
            { ...course3 },
        ]
    });

    const fetchRecords = await courseService.fetchAll();

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(course1);
    expect(courseRepo.findByFiltersAndKeywordJoint).toHaveBeenCalledTimes(1);
});

test('fetching all with unique titles works', async () => {
    cache.has.mockReturnValue(false);
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([course1, course1, course2]);
    filtering.filterAndSortByTitle.mockReturnValue([course1, course2]);

    const fetchRecords = await courseService.fetchAllWithUniqueTitles();

    expect(fetchRecords.length).toStrictEqual(2);
    expect(fetchRecords[0]).toStrictEqual(course1);
    expect(filtering.filterAndSortByTitle).toHaveBeenCalledTimes(1);
});

test('adding a new course with a single phase works', async () => {
    course1.id = 1;
    course1.phases = 1;
    courseRepo.insert.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    coursePhaseRepo.insert.mockResolvedValue();
    courseRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    const newCourseId = await courseService.addNewCourse(course1);

    expect(coursePhaseRepo.insert).toHaveBeenCalledTimes(1);
    expect(newCourseId).toStrictEqual(course1.id);
});

test('adding a new course with multiple phases works', async () => {
    course1.id = 1;
    course1.phases = [1, 2];
    courseRepo.insert.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    coursePhaseRepo.insert.mockResolvedValue();
    courseRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    const newCourseId = await courseService.addNewCourse(course1);

    expect(coursePhaseRepo.insert).toHaveBeenCalledTimes(2);
    expect(newCourseId).toStrictEqual(course1.id);
});

test('updating a course with a single phase works', async () => {
    course1.id = 1;
    course1.phases = 1;
    courseRepo.update.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    coursePhaseRepo.removeByCourseId.mockResolvedValue();
    coursePhaseRepo.insert.mockResolvedValue();
    courseRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    cache.get.mockReturnValue([course1]);
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    await courseService.updateCourse(course1);

    expect(coursePhaseRepo.insert).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(2);
});

test('updating a course with multiple phases works', async () => {
    course1.id = 1;
    course1.phases = [1, 2];
    courseRepo.update.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    coursePhaseRepo.removeByCourseId.mockResolvedValue();
    coursePhaseRepo.insert.mockResolvedValue();
    courseRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            { ...course1 },
        ]
    });
    cache.get.mockReturnValue([course1]);
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    await courseService.updateCourse(course1);

    expect(coursePhaseRepo.insert).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(2);
});

test('deleting a course works', async () => {
    course1.id = 1;
    courseRepo.removeById.mockResolvedValue();
    coursePhaseRepo.removeByCourseId.mockResolvedValue();
    cache.get.mockReturnValue([course1]);
    cache.del.mockReturnValue();
    cache.set.mockReturnValue();

    await courseService.deleteCourse(course1.id);

    expect(courseRepo.removeById).toHaveBeenCalledTimes(1);
    expect(courseRepo.removeById).toHaveBeenCalledWith(1);
});