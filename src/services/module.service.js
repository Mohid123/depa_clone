const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowService = require('./workFlow.service');

/**
 * Create a Module
 * @param {Object} ModuleBody
 * @returns {Promise<Module>}
 */
const createModule = async (ModuleBody) => {
  if (await Module.isCodeTaken(ModuleBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }

  const createdWorkflow = await workFlowService.createWorkFlow(ModuleBody);
  ModuleBody.workFlowId = createdWorkflow._id;

  return Module.create(ModuleBody);

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
  const Modules = await Module.paginate(filter, options);
  return Modules;
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
 * Update Module by id
 * @param {ObjectId} ModuleId
 * @param {Object} updateBody
 * @returns {Promise<Module>}
 */
const updateModuleById = async (ModuleId, updateBody) => {
  const Module = await getModuleById(ModuleId);
  if (!Module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  if (updateBody.steps) {
    const updatedWorkFlow = await workFlowService.updateWorkFlowById(Module.workFlowId.id, updateBody);
    return updatedWorkFlow;
  }

  Object.assign(Module, updateBody);
  await Module.save();
  return await getModuleById(ModuleId);
};

/**
 * Delete Module by id
 * @param {ObjectId} ModuleId
 * @returns {Promise<Module>}
 */
const deleteModuleById = async (ModuleId) => {
  const Module = await getModuleById(ModuleId);
  if (!Module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  await Module.remove();
  return Module;
};

module.exports = {
  createModule,
  queryModules,
  getModuleById,
  updateModuleById,
  deleteModuleById,
};
