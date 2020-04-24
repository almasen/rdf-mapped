const {calculateLimitAndOffset, paginate} = require('paginate-info');

const getPageData = (currentPage, pageSize, data) => {
    const {limit, offset} = calculateLimitAndOffset(currentPage, pageSize);
    const count = data.length;
    const paginatedData = data.slice(offset, offset + limit);
    const paginationInfo = paginate(currentPage, count, paginatedData);
    return {
        meta: paginationInfo,
        data: paginatedData,
    };
};

module.exports = {
    getPageData,
};

