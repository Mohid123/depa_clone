const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { moduleService } = require('../services');

const edit = catchAsync(async (req, res) => {
    const module = await moduleService.getUserById(req.params.moduleId);
    if (!module) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
    }
    res.status(httpStatus.OK).send(module);
});

const update = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send(req.params.moduleId);
});



module.exports = {
    edit,
    update
};
