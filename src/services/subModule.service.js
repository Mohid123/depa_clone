const httpStatus = require('http-status');
const { SubModule } = require('../models');
const ApiError = require('../utils/ApiError');
const formService = require('./form.service');
const workFlowService = require('./workFlow.service');
const emailNotifyToService = require('./emailNotifyTo.service');

/**
 * Validate submodule code is taken or not
 * @param {Object} filter
 * @returns {Promise<SubModule>}
 */
const validateCreateSubModule = async (filter) => {
  if (!await SubModule.isCodeTaken(filter.code)) {
    return {
      isCodeTaken: false
    };
  }

  return {
    isCodeTaken: true
  };
}

/**
 * Create a SubModule
 * @param {Object} subModuleBody
 * @returns {Promise<SubModule>}
 */
const createSubModule = async (subModuleBody) => {
  if (await SubModule.isCodeTaken(subModuleBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }

  const forms = await formService.createManyForms(subModuleBody.formIds)
  subModuleBody.formIds = forms.map(({ _id }) => _id);

  // Replace the email addresses in the data with the created EmailNotifyTo document IDs
  const emailNotifyToIds = [];
  for (const step of subModuleBody.steps) {
    if (step.emailNotifyTo.length > 0) {
      subModuleBody.notifyUsers = step.emailNotifyTo;

      const emailNotifyTo = await emailNotifyToService.createEmailNotifyTo(subModuleBody);
      if (!emailNotifyTo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Email Notify To not found');
      }

      step.emailNotifyToId = emailNotifyTo.id;
      emailNotifyToIds.push(emailNotifyTo.id);
    }
  };

  const workFlow = await workFlowService.createWorkFlow(subModuleBody);
  subModuleBody.workFlowId = workFlow;

  const subModule = await SubModule.create(subModuleBody)

  emailNotifyToIds.forEach(emailNotifyToId => {
    emailNotifyToService.updateEmailNotifyToById(emailNotifyToId, {
      "moduleId": subModule.moduleId,
      "subModuleId": subModule._id
    })
  });

  return getSubModuleById(subModule._id);
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
  const subModules = await SubModule.paginate(filter, options);
  return subModules;
};

/**
 * Get SubModule by id
 * @param {ObjectId} id
 * @returns {Promise<SubModule>}
 */
const getSubModuleById = async (id) => {
  return SubModule.findById(id).populate(["adminUsers", "viewOnlyUsers", "formIds", "moduleId", "companyId", {
    path: 'workFlowId',
    populate: {
      path: 'stepIds',
      populate: [
        {
          path: 'approverIds'
        },
        {
          path: 'emailNotifyToId'
        }
      ]
    }
  }]);
};

/**
 * Get SubModule by slug
 * @param {string} slug
 * @returns {Promise<SubModule>}
 */
const getSubModuleBySlug = async (slug) => {
  return SubModule.findOne({ 'code': slug, 'isDeleted': false }).populate(["formIds", {
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
 * Update SubModule by id
 * @param {ObjectId} subModuleId
 * @param {Object} updateBody
 * @returns {Promise<SubModule>}
 */
const updateSubModuleById = async (subModuleId, updateBody) => {
  const subModule = await getSubModuleById(subModuleId);
  if (!subModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
  }

  if (await SubModule.isCodeTaken(updateBody.code, subModule.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Module Key already taken');
  }

  if (updateBody.steps) {
    await workFlowService.updateWorkFlowById(subModule.workFlowId.id, updateBody);
  }

  Object.assign(subModule, updateBody);
  await subModule.save();
  return subModule;
};

/**
 * Delete SubModule by id
 * @param {ObjectId} subModuleId
 * @returns {Promise<SubModule>}
 */
const deleteSubModuleById = async (subModuleId) => {
  const subModule = await getSubModuleById(subModuleId);
  if (!subModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
  }
  await subModule.softDelete();
  return subModule;
};

module.exports = {
  validateCreateSubModule,
  createSubModule,
  querySubModules,
  getSubModuleById,
  getSubModuleBySlug,
  updateSubModuleById,
  deleteSubModuleById,
};
