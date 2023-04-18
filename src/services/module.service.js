const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Module
 * @param {Object} ModuleBody
 * @returns {Promise<Module>}
 */
const createModule = async (ModuleBody) => {
  // if (await Module.isEmailTaken(ModuleBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
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
  return Module.findById(id);
};

/**
 * Get Module by email
 * @param {string} email
 * @returns {Promise<Module>}
 */
const getModuleByEmail = async (email) => {
  return Module.findOne({ email });
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
  if (updateBody.email && (await Module.isEmailTaken(updateBody.email, ModuleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(Module, updateBody);
  await Module.save();
  return Module;
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
  getModuleByEmail,
  updateModuleById,
  deleteModuleById,
};
