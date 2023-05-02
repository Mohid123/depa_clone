const httpStatus = require('http-status');
const { Category, Module } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for Categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModulesByCategory = async (filter, options) => {
  let { sortBy, limit, page } = options;
  limit = limit ?? 6;
  page = page ?? 1;

  const Categories = await Category.aggregate([
    {
      $lookup: {
        from: "modules",
        localField: "_id",
        foreignField: "categoryId",
        as: "modules",
      },
    },
    {
      $sort: {
        ['name']: sortBy === "asc" ? 1 : -1, // sort ascending by the specified field
      },
    },
    {
      $skip: limit * (page - 1),
    },
    {
      $limit: limit,
    }
  ]);

  return Categories;
};

/**
 * Get Category by id
 * @param {ObjectId} id
 * @returns {Promise<Module>}
 */
const querySubModulesByModule = async (id) => {
  return Module.findById(id);
};


module.exports = {
  queryModulesByCategory,
  querySubModulesByModule
};
