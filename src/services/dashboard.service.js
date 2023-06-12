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

  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  let sortBy = null;

  const subModuleFilter = {};
  subModuleFilter.moduleId = module.id;
  subModuleFilter.isDeleted = filter.isDeleted;

  if (options.field === "subModuleCode") {
    if (options.search) {
      subModuleFilter.code = { $regex: options.search, $options: 'i' };
    }

    if (options.sortBy === "asc") {
      sortBy = 'code';
    } else if (options.sortBy === "desc") {
      sortBy = '-code';
    }
  } else {
    if (options.sortBy === "asc") {
      sortBy = { 'companyId.title': 1 };
    } else if (options.sortBy === "desc") {
      sortBy = { 'companyId.title': -1 };
    }
  }

  // return {
  //   subModuleFilter: subModuleFilter,
  //   page: page,
  //   limit: limit,
  //   sortBy: sortBy
  // };
  const query = SubModule.find(subModuleFilter)
    .populate(['moduleId', {
      path: 'companyId',
      // options: { sort: sortBy }
    }])
    .skip((page - 1) * limit)
    .limit(limit);

  if (options.sortBy) {
    query.sort(sortBy);
  } else {
    query.sort(options.sortByTime == "oldest" ? { createdAt: 1 } : { createdAt: -1 }); // Sort by createdAt date in descending order
  }

  const results = await query;

  const totalResults = await SubModule.countDocuments(subModuleFilter);
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
