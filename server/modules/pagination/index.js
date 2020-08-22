/**
 * @module pagination
 */
const {calculateLimitAndOffset, paginate} = require('paginate-info');

/**
 * Get page data according to input page number and
 * desired page size.
 * Returns paginated data and metadata.
 * @param {Number} currentPageIn current page number
 * @param {Number} pageSizeIn desired page size
 * @param {Array} data
 * @return {Object} data and meta as object
 */
const getPageData = (currentPageIn, pageSizeIn, data) => {
    const currentPage = currentPageIn ? currentPageIn : 1;
    const pageSize = pageSizeIn ? pageSizeIn : 10;
    const {limit, offset} = calculateLimitAndOffset(currentPage, pageSize);
    const count = data.length;
    const paginatedData = data.slice(offset, offset + limit);
    const paginationInfo = paginate(currentPage, count, data, pageSize);
    paginationInfo.pageSize = parseInt(pageSize);
    return {
        meta: paginationInfo,
        data: paginatedData,
    };
};

module.exports = {
    getPageData,
};

