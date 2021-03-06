const db = require("../../database/connection");

const insert = (course) => {
    const query = "INSERT INTO course(title, hyperlink, capability_id, category_id, competency_id, urn) VALUES ($1, $2, $3, $4, $5, $6) " +
        "RETURNING *"; // returns passed course with it's id set to corresponding id in database
    const params = [course.title, course.hyperlink, course.capabilityId, course.categoryId, course.competencyId, course.urn];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM course WHERE id=$1";
    return db.query(query, [id]);
};

const findByIdJoint = (id) => {
    const query = "SELECT " +
        "title(course) AS title, hyperlink(course) AS hyperlink, id(course) AS id, urn(course) AS urn, " +
        "title(capability) AS capability_title, id(capability) AS capability_id, " +
        "title(category) AS category_title, id(category) AS category_id, " +
        "title(competency) AS competency_title, id(competency) AS competency_id " +
        "FROM course " +
        "LEFT JOIN capability ON id(capability) = capability_id " +
        "LEFT JOIN category ON id(category) = category_id " +
        "LEFT JOIN competency ON id(competency) = competency_id " +
        "WHERE id(course)=$1";
    return db.query(query, [id]);
};

const findByIdWithFullInfo = (id) => {
    const query = "SELECT " +
        "ARRAY(SELECT phase_id(course_phase) FROM course_phase WHERE course_id(course_phase) = id(course)) AS phases, " +
        "title(course) AS title, hyperlink(course) AS hyperlink, id(course) AS id, urn(course) AS urn, " +
        "title(capability) AS capability_title, id(capability) AS capability_id, " +
        "title(category) AS category_title, id(category) AS category_id, " +
        "title(competency) AS competency_title, id(competency) AS competency_id " +
        "FROM course " +
        "LEFT JOIN capability ON id(capability) = capability_id " +
        "LEFT JOIN category ON id(category) = category_id " +
        "LEFT JOIN competency ON id(competency) = competency_id " +
        "WHERE id(course)=$1";
    return db.query(query, [id]);
};

const update = (course) => {
    const query = "UPDATE course SET title = $2, hyperlink = $3, capability_id = $4, category_id = $5, " +
        "competency_id = $6, urn = $7 WHERE id = $1" +
        "RETURNING *"; // returns passed course with it's id set to corresponding id in database
    const params = [course.id, course.title, course.hyperlink, course.capabilityId, course.categoryId, course.competencyId, course.urn];
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

const findByKeyword = (keyword) => {
    const query = "SELECT * FROM course WHERE UPPER(title) LIKE UPPER($1)";
    return db.query(query, [`%${keyword}%`]);
};

const findByFiltersAndKeyword = (search) => {
    const query = "SELECT * FROM course LEFT JOIN course_phase ON course_id(course_phase) = id WHERE " +
        "($1 = -1 OR capability_id = $1) AND " +
        "($2 = -1 OR category_id = $2) AND " +
        "($3 = -1 OR competency_id = $3) AND " +
        "($4 = -1 OR phase_id = $4) AND " +
        "($5 = '%%' OR (UPPER(title) LIKE UPPER($5)))";
    const params = [search.filters.capabilityId, search.filters.categoryId,
        search.filters.competencyId, search.filters.phaseId, `%${search.keyword}%`];
    return db.query(query, params);
};

const findByFiltersAndKeywordJoint = (search) => {
    const query = "SELECT DISTINCT ON (id(course)) " +
        "ARRAY(SELECT phase_id(course_phase) FROM course_phase WHERE course_id(course_phase) = id(course)) AS phases, " +
        "title(course) AS title, hyperlink(course) AS hyperlink, id(course) AS id, urn(course) AS urn, " +
        "title(capability) AS capability_title, id(capability) AS capability_id, " +
        "title(category) AS category_title, id(category) AS category_id, " +
        "title(competency) AS competency_title, id(competency) AS competency_id " +
        "FROM course " +
        "LEFT JOIN capability ON id(capability) = capability_id " +
        "LEFT JOIN category ON id(category) = category_id " +
        "LEFT JOIN competency ON id(competency) = competency_id " +
        "LEFT JOIN course_phase ON course_id(course_phase) = id(course) " +
        "WHERE " +
        "($1 = -1 OR capability_id(course) = $1) AND " +
        "($2 = -1 OR category_id(course) = $2) AND " +
        "($3 = -1 OR competency_id(course) = $3) AND " +
        "($4 = -1 OR phase_id(course_phase) = $4) AND " +
        "($5 = '%%' OR (UPPER(title(course)) LIKE UPPER($5))) " +
        "ORDER BY id(course)";
    const params = [search.filters.capabilityId, search.filters.categoryId,
        search.filters.competencyId, search.filters.phaseId, `%${search.keyword}%`];
    return db.query(query, params);
};

module.exports = {
    insert,
    findById,
    findByIdJoint,
    update,
    removeById,
    findByFilters,
    findByKeyword,
    findByFiltersAndKeyword,
    findByIdWithFullInfo,
    findByFiltersAndKeywordJoint,
};
