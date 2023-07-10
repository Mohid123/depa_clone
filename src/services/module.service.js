const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowService = require('./workFlow.service');
const emailNotifyToService = require('./emailNotifyTo.service');

/**
 * Create a Module
 * @param {Object} moduleBody
 * @returns {Promise<Module>}
 */
const createModule = async (moduleBody) => {
  if (await Module.isCodeTaken(moduleBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }

  // Replace the email addresses in the data with the created EmailNotifyTo document IDs
  const emailNotifyToIds = [];
  for (const step of moduleBody.steps) {
    if (step.emailNotifyTo.length > 0) {
      moduleBody.notifyUsers = step.emailNotifyTo;

      const emailNotifyTo = await emailNotifyToService.createEmailNotifyTo(moduleBody);
      if (!emailNotifyTo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Email Notify To not found');
      }

      step.emailNotifyToId = emailNotifyTo.id;
      emailNotifyToIds.push(emailNotifyTo.id);
    }
  };

  const createdWorkflow = await workFlowService.createWorkFlow(moduleBody);
  if (!createdWorkflow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workflow not found');
  }
  moduleBody.workFlowId = createdWorkflow._id;

  const module = await Module.create(moduleBody);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  emailNotifyToIds.forEach(emailNotifyToId => {
    emailNotifyToService.updateEmailNotifyToById(emailNotifyToId, {
      "moduleId": module._id
    })
  });

  return module;
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

  // Iterate through the array and update the 'image' property
  modules.results.map(item => {
    item.image = item.image;
    return item;
  });

  return modules;
};

/**
 * Get Module by id
 * @param {ObjectId} id
 * @returns {Promise<Module>}
 */
const getModuleById = async (id) => {
  const module = await Module.findById(id).populate(['categoryId', {
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

  if (module) {
    const urlImage = module.image;
    Object.assign(module, {
      image: urlImage
    });
  }

  return module;
};

/**
 * Get Module by slug
 * @param {String} slug
 * @returns {Promise<Module>}
 */
const getModuleBySlug = async (slug) => {
  const module = await Module.findOne({ 'code': slug, 'isDeleted': false }).populate(['categoryId', {
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

  const urlImage = module.image;
  let updatedModule = Object.assign(module, {
    image: urlImage
  });

  return updatedModule;
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
