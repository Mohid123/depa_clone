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
                workFlow: { $first: "$workFlow" },
                adminUsers: { $first: "$adminUsers" },
                viewOnlyUsers: { $first: "$viewOnlyUsers" },
                isApproved: { $first: "$isApproved" },
                moduleCode: { $first: "$moduleCode" },
                companyCode: { $first: "$companyCode" },
                approvalRequest: { $first: "$approvalRequest" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                __v: { $first: "$__v" },
                approvalStepStatus: {
                    $push: {
                        approvedUserIds: "$approvalStepStatus.approvedUserIds",
                        pendingUserIds: "$approvalStepStatus.pendingUserIds",
                        status: "$approvalStepStatus.status",
                        isActive: "$approvalStepStatus.isActive",
                        _id: "$approvalStepStatus._id",
                        step: "$approvalStepStatus.step",
                        activeUser: "$approvalStepStatus.activeUser",
                        pendingUsers: "$approvalStepStatus.pendingUsers"
                    }
                }
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
