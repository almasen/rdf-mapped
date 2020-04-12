const db = require("../../database/connection");

const insert = (course) => {
    const query = "INSERT INTO course(title, hyperlink, capability_id, category_id, competency_id) VALUES ($1, $2, $3, $4, $5) " +
        "RETURNING *"; // returns passed course with it's id set to corresponding id in database
    const params = [course.title, course.hyperlink, course.capabilityId, course.categoryId, course.competencyId];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM course WHERE id=$1";
    return db.query(query, [id]);
};

const update = (course) => {
    const query = "UPDATE course SET title = $2, hyperlink = $3, capability_id = $4, category_id = $5, competency_id = $6 WHERE id = $1" +
        "RETURNING *"; // returns passed course with it's id set to corresponding id in database
    const params = [course.id, course.title, course.hyperlink, course.capabilityId, course.categoryId, course.competencyId];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM course WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

const findByFilters = (filters) => {
    const query = "SELECT * FROM course LEFT JOIN course_phase ON course_id(course_phase) = id WHERE " +
        "($1 = -1 OR capability_id = $1) AND " +
        "($2 = -1 OR category_id = $2) AND " +
        "($3 = -1 OR competency_id = $3) AND " +
        "($4 = -1 OR phase_id = $4)";
    const params = [filters.capabilityId, filters.categoryId, filters.competencyId, filters.phaseId];
    return db.query(query, params);
};

const searchByKeyword = (keyword) => {
    const query = "SELECT * FROM course WHERE title LIKE $1";
    return db.query(query, [`%${keyword}%`]);
};

const findByFiltersAndKeyword = (search) => {
    const query = "SELECT * FROM course LEFT JOIN course_phase ON course_id(course_phase) = id WHERE " +
        "($1 = -1 OR capability_id = $1) AND " +
        "($2 = -1 OR category_id = $2) AND " +
        "($3 = -1 OR competency_id = $3) AND " +
        "($4 = -1 OR phase_id = $4) AND " +
        "title LIKE $5";
    const params = [search.filters.capabilityId, search.filters.categoryId,
        search.filters.competencyId, search.filters.phaseId, `%${search.keyword}%`];
    return db.query(query, params);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
    findByFilters,
    searchByKeyword,
    findByFiltersAndKeyword,
};
