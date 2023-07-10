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
      $match: { isDeleted: false }
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
                  config.imageServer,
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

  const submodules = await subModuleService.querySubModules({ parentId: subModule.id }, options);
  if (!submodules) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Modules not found');
  }

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

  response.navHierarchy = hierarchy.map(obj => ({ id: obj.id, code: obj.code }));

  return response;
};


module.exports = {
  querySubModulesWithModule,
  querySubModulesByModule,
  querySubModulesByModuleSlug
};
