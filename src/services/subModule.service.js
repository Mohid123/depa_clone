const httpStatus = require('http-status');
const { SubModule } = require('../models');
const ApiError = require('../utils/ApiError');
const formService = require('./form.service');
const submissionService = require('./submission.service');

/**
 * Create a SubModule
 * @param {Object} SubModuleBody
 * @returns {Promise<SubModule>}
 */
const createSubModule = async (SubModuleBody) => {
  if (await SubModule.isCodeTaken(SubModuleBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }

  const forms = await formService.createManyForms(SubModuleBody.formIds)
  SubModuleBody.formIds = forms.map(({ _id }) => _id)

  const subModule = await SubModule.create(SubModuleBody);
  SubModuleBody.subModuleId = subModule._id;

  const submission = await submissionService.createSubmission(SubModuleBody);

  return await {
    'subModule': subModule,
    'submission': submission
  };
};

/**
 * Query for SubModules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubModules = async (filter, options) => {
  const SubModules = await SubModule.paginate(filter, options);
  return SubModules;
};

/**
 * Get SubModule by id
 * @param {ObjectId} id
 * @returns {Promise<SubModule>}
 */
const getSubModuleById = async (id) => {
  return SubModule.findById(id);
};

/**
 * Get SubModule by email
 * @param {string} email
 * @returns {Promise<SubModule>}
 */
const getSubModuleByEmail = async (email) => {
  return SubModule.findOne({ email });
};

/**
 * Update SubModule by id
 * @param {ObjectId} SubModuleId
 * @param {Object} updateBody
 * @returns {Promise<SubModule>}
 */
const updateSubModuleById = async (SubModuleId, updateBody) => {
  const SubModule = await getSubModuleById(SubModuleId);
  if (!SubModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
  }
  Object.assign(SubModule, updateBody);
  await SubModule.save();
  return SubModule;
};

/**
 * Delete SubModule by id
 * @param {ObjectId} SubModuleId
 * @returns {Promise<SubModule>}
 */
const deleteSubModuleById = async (SubModuleId) => {
  const SubModule = await getSubModuleById(SubModuleId);
  if (!SubModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
  }
  await SubModule.remove();
  return SubModule;
};

module.exports = {
  createSubModule,
  querySubModules,
  getSubModuleById,
  getSubModuleByEmail,
  updateSubModuleById,
  deleteSubModuleById,
};
