const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * Get user by id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {

    return Module.aggregate([
        {
            $match: {
                _id: ObjectId(id)   
            }
        },
        {
            $unwind: "$approvalStepStatus"
        },
        {
            $lookup: {
                from: "users",
                localField: "approvalStepStatus.pendingUserIds",
                foreignField: "_id",
                as: "approvalStepStatus.pendingUserIds"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "approvalStepStatus.activeUser",
                foreignField: "_id",
                as: "approvalStepStatus.activeUser"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "approvalStepStatus.approvedUserIds",
                foreignField: "_id",
                as: "approvalStepStatus.approvedUserIds"
            }
        },
        {
            $group: {
                _id: "$_id",
                adminUsers: { $first: "$adminUsers" },
                viewOnlyUsers: { $first: "$viewOnlyUsers" },
                moduleCode: { $first: "$moduleCode" },
                companyCode: { $first: "$companyCode" },
                workFlow: { $first: "$workFlow" },
                approvalStepStatus: {
                    $push: {
                        _id: "$approvalStepStatus._id",
                        approvedUserIds: "$approvalStepStatus.approvedUserIds",
                        pendingUserIds: "$approvalStepStatus.pendingUserIds",
                        activeUser: "$approvalStepStatus.activeUser",
                        type: "$approvalStepStatus.type",
                        stepId: "$approvalStepStatus.stepId",
                        status: "$approvalStepStatus.status",
                        isActive: "$approvalStepStatus.isActive",
                        pendingUsers: "$approvalStepStatus.pendingUsers"
                    }
                },
                approvalRequest: { $first: "$approvalRequest" },
                isApproved: { $first: "$isApproved" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$$ROOT", { approvalStepStatus: "$approvalStepStatus" }]
                }
            }
        }
    ]);
};

module.exports = {
  getUserById,
};
