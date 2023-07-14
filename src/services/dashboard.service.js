const httpStatus = require('http-status');
const { Category, Module } = require('../models');
const ApiError = require('../utils/ApiError');
const SubModule = require('../models/subModule.model');
const config = require('../config/config.js');
const { subModuleService } = require('.');

/**
 * Query for Categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubModulesWithModule = async (filter, options) => {
  let { sortBy, limit, page } = options;
  limit = limit ?? 6;
  page = page ?? 1;

  const modules = await Module.aggregate([
    {
      $match: { status: 1, isDeleted: false }
    },
    {
      $lookup: {
        from: "submodules",
        let: { moduleId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$moduleId", "$moduleId"] },
              $and: [
                { parentId: null },
                { isDeleted: false }
              ]
            }
          },
          {
            $addFields: {
              image: {
                $concat: [
                  config.fileServer,
                  "$image",
                ],
              },
            },
          }
        ],
        as: "submodules"
      },
    },
    {
      $addFields: {
        submodules: {
          $cond: {
            if: { $eq: ["$submodules", []] },
            then: null,
            else: "$submodules"
          }
        }
      }
    },
    {
      $sort: {
        name: sortBy === "asc" ? 1 : -1
      }
    },
    {
      $skip: limit * (page - 1)
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 1,
        title: 1,
        submodules: 1
      }
    }
  ]);

  // Now the modules array will only contain the _id and title fields for each module
  return modules;
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
  const subModule = await SubModule.findOne({ code: filter.code });
  if (!subModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  let sortBy = null;

  const subModuleFilter = {};
  subModuleFilter.parentId = subModule.id;
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
      sortBy = '1companyId.title';
    } else if (options.sortBy === "desc") {
      sortBy = '-1companyId.title';
    }
  }

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

  // const submodules = await subModuleService.querySubModules({ parentId: subModule.id }, options);
  // if (!submodules) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Modules not found');
  // }

  const submodules = {
    results,
    page: page,
    limit: limit,
    totalPages,
    totalResults,
  };

  submodules.results.map(item => {
    item.image = item.image;
    return item;
  })

  // Iterate through the array and update the 'image' property
  const response = submodules;

  const hierarchy = [];
  let currentId = subModule.id;

  while (currentId) {
    const subModule = await SubModule.findById(currentId).populate('parentId').select('id code');
    if (!subModule) {
      break;
    }
    hierarchy.unshift(subModule); // Add current subModule ID to the hierarchy array
    currentId = subModule.parentId; // Update currentId with the parent's ID
  }

  submodules.navHierarchy = hierarchy.map(obj => ({ id: obj.id, code: obj.code }));

  return response;
};


module.exports = {
  querySubModulesWithModule,
  querySubModulesByModule,
  querySubModulesByModuleSlug
};
