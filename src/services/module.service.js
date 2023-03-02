const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * Get user by id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
//   return Module.aggregate([{
//     $match: {
//         _id: ObjectId(id)
//     }}
// ]);

    return Module.aggregate([
        {
          $match: {
            _id: ObjectId("6400513365048d13d0c04cb0")
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
            as: "approvalStepStatus.pendingUsers"
          }
        },
        // {
        //   $group: {
        //     _id: "$_id",
        //     approvalStepStatus: {
        //       $push: "$approvalStepStatus"
        //     }
        //   }
        // },
        // {
        //     $project: {
        //         "workFlow" : 1,
        //         "adminUsers" : 1,
        //         "viewOnlyUsers" : 1,
        //         "isApproved" : 1,
        //         "moduleCode" : 1,
        //         "companyCode" : 1,
        //         "approvalStepStatus.pendingUsers._id" : 1,
        //         "approvalStepStatus.pendingUsers.name" : 1,
        //         "approvalRequest" : 1,
        //         "createdAt" : 1,
        //         "updatedAt" : 1,
        //     }
        // }
      ]);
};

module.exports = {
  getUserById,
};
