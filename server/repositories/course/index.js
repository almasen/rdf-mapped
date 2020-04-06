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
    const query = "SELECT * FROM course WHERE " +
        "($1 = -1 OR capability_id = $1) AND " +
        "($2 = -1 OR category_id = $2) AND " +
        "($3 = -1 OR competency_id = $3)";
    const params = [filters.capabilityId, filters.categoryId, filters.competencyId];
    return db.query(query, params);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
    findByFilters,
};
