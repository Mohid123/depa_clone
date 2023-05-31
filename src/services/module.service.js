const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowService = require('./workFlow.service');

/**
 * Create a Module
 * @param {Object} moduleBody
 * @returns {Promise<Module>}
 */
const createModule = async (moduleBody) => {
  if (await Module.isCodeTaken(moduleBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }

  const createdWorkflow = await workFlowService.createWorkFlow(moduleBody);
  moduleBody.workFlowId = createdWorkflow._id;

  return Module.create(moduleBody);

};

/**
 * Query for Modules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModules = async (filter, options) => {
  const modules = await Module.paginate(filter, options);
  return modules;
};

/**
 * Get Module by id
 * @param {ObjectId} id
 * @returns {Promise<Module>}
 */
const getModuleById = async (id) => {
  return Module.findById(id).populate(['categoryId', {
    path: 'workFlowId',
    populate: {
      path: 'stepIds',
      populate: {
        path: 'approverIds'
      }
    }
  }]);
};

/**
 * Get Module by slug
 * @param {String} slug
 * @returns {Promise<Module>}
 */
const getModuleBySlug = async (slug) => {
  return Module.findOne({ 'code': slug, 'isDeleted': false }).populate(['categoryId', {
    path: 'workFlowId',
    populate: {
      path: 'stepIds',
      populate: {
        path: 'approverIds'
      }
    }
  }]);
};

/**
 * Update Module by id
 * @param {ObjectId} moduleId
 * @param {Object} updateBody
 * @returns {Promise<Module>}
 */
const updateModuleById = async (moduleId, updateBody) => {
  const module = await getModuleById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  if (await Module.isCodeTaken(updateBody.code, module.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Module Key already taken');
  }

  if (updateBody.steps) {
    await workFlowService.updateWorkFlowById(module.workFlowId.id, updateBody);
  }

  Object.assign(module, updateBody);
  await module.save();
  return await getModuleById(moduleId);
};

/**
 * Delete Module by id
 * @param {ObjectId} moduleId
 * @returns {Promise<Module>}
 */
const deleteModuleById = async (moduleId) => {
  const module = await getModuleById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  await module.softDelete();
  return module;
};

module.exports = {
  createModule,
  queryModules,
  getModuleById,
  getModuleBySlug,
  updateModuleById,
  deleteModuleById,
};
