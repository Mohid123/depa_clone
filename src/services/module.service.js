const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get user by id
 * @returns {Promise<Module>}
 */
const getFirstModule = async () => {

    return Module.findOne({}, {}, { sort: { 'created_at' : -1 } });
};

/**
 * Get user by id
 * @returns {Promise<Module>}
 */
const getModuleById = async (id) => {

    return Module.findById(id);
};

/**
 * Get user by id aggregate
 * @returns {Promise<Module>}
 */
const getModuleByIdAggregate = async (id) => {

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
                approvalLog: { $first: "$approvalLog" },
                forms: { $first: "$forms" },
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
        },
        // {
        //     $limit: 1
        // }
    ]);
};

/**
 * Update one user by id
 * @returns {Promise<Module>}
 */
const updateOneModuleById = async (id, module) => {

    return Module.updateOne({'_id':  id}, module);
};

module.exports = {
  getModuleById,
  getFirstModule,
  getModuleByIdAggregate,
  updateOneModuleById,
};
