const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { moduleService } = require('../services');
// const mongoose = require('mongoose');

const edit = catchAsync(async (req, res) => {
    // res.status(httpStatus.OK).send(mongoose.Types.ObjectId.isValid(req.params.moduleId));
    const module = await moduleService.getUserByIdAggregate("6401a636d39d2b14e4895cba");
    if (!module) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Module not found!');
    }
    res.status(httpStatus.OK).send(module[0]);
});

const update = catchAsync(async (req, res) => {
    const module = await moduleService.getUserById("6401a636d39d2b14e4895cba");
    if (!module) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Module not found!');
    }

    const approvalStep = await module.approvalStepStatus.filter( function(item){return (item.stepId==req.body.stepId);})[0];
    if (!approvalStep || !approvalStep.isActive) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Approval Step!');
    }

    const stepActiveUserId = await approvalStep.activeUser.filter( function(item){return (item==req.body.userId);})[0];
    if (!stepActiveUserId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid User!');
    } 


    if (req.body.isApproved) {
        approvalStep.approvedUserIds.push(stepActiveUserId);
        approvalStep.activeUser = approvalStep.activeUser.filter( function(item){return (item!=req.body.userId);});

        if (!approvalStep.pendingUserIds.length) {
            approvalStep.status = "approved";
            approvalStep.isActive = "false";
            for (let index = 0; index < module.approvalStepStatus.length; index++) {
                const element =  module.approvalStepStatus[index];
                if (element.status == "pending") {
                    element.activeUser.push(element.pendingUserIds[0]);
                    element.pendingUserIds = element.pendingUserIds.filter( function(item){return (item!=element.pendingUserIds[0]);}); 
                    element.isActive = true;
                    break;
                }
            }
        }
        
        if (approvalStep.type == "and") {
            approvalStep.activeUser.push(approvalStep.pendingUserIds[0]);
            approvalStep.pendingUserIds = approvalStep.pendingUserIds.filter( function(item){return (item!=approvalStep.pendingUserIds[0]);});
        }

    } else {
        
    }
    module.approvalLog.push({
        step: approvalStep._id,
        approvedBy: stepActiveUserId,
        approvedOn: new Date().getTime(),
        remarks: req.body.remarks,
        isApproved: req.body.isApproved
    });

    
    const moduleUpdated = await moduleService.updateOneUserById("6401a636d39d2b14e4895cba", module);
    res.status(httpStatus.OK).send(module);
});



module.exports = {
    edit,
    update
};
