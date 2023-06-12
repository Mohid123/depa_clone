const httpStatus = require('http-status');
const { Category, Module } = require('../models');
const ApiError = require('../utils/ApiError');
const SubModule = require('../models/subModule.model');

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
      $match: { isDeleted: false }
    },
    {
      $lookup: {
        from: "modules",
        localField: "_id",
        foreignField: "categoryId",
        as: "modules",
      },
    },
    {
      $match: { "modules.isDeleted": false }
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
  return SubModule.where('moduleId').equals(id).populate(['moduleId', 'companyId']);
};

/**
 * Get Category by Slug
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Module>}
 */
const querySubModulesByModuleSlug = async (filter, options) => {
  const module = await Module.findOne(filter);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  const page = options.page ? parseInt(options.page) : 1; // Page number
  const limit = options.limit ? parseInt(options.limit) : 10; // Number of items per page

  const results = await SubModule.find({ 'moduleId': module.id, 'isDeleted': filter.isDeleted })
    .populate(['moduleId', 'companyId'])
    .skip((page - 1) * limit)
    .limit(limit);

  const totalResults = await SubModule.countDocuments({ 'moduleId': module.id, 'isDeleted': filter.isDeleted });
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    page: page,
    limit: limit,
    totalPages,
    totalResults,
  };
};


module.exports = {
  queryModulesByCategory,
  querySubModulesByModule,
  querySubModulesByModuleSlug
};
