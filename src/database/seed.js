const mongoose = require('mongoose');
const app = require('./../app');
const config = require('./../config/config');
const logger = require('./../config/logger');
const bcrypt = require('bcryptjs');

const User = require('./../models/user.model');
const WorkFlow = require('./../models/workflow.model');
const Module = require('./../models/module.model');

async function password(password) {
    const pass = await bcrypt.hash(password, 8);
    return pass;
}

mongoose.connect(config.mongoose.url, config.mongoose.options)
.then(async () => {
    logger.info('Connected to MongoDB');

    let passA = await password("12345678")
    let passB = await password("12345678")
    let passC = await password("12345678")
    let passD = await password("12345678")
    let passE = await password("12345678")
    let passF = await password("12345678")
    let passG = await password("12345678")
    let passH = await password("12345678")

    let userData = [
        {
            name: "Admin",
            email: "admin@depa.com",
            password: passA,
            role: "admin"
        },
        {
            name: "User A",
            email: "user.a@depa.com",
            password: passA
        },
        {
            name: "User B",
            email: "user.b@depa.com",
            password: passB
        },
        {
            name: "User C",
            email: "user.c@depa.com",
            password: passC
        },
        {
            name: "User D",
            email: "user.d@depa.com",
            password: passD
        },
        {
            name: "User E",
            email: "user.e@depa.com",
            password: passE
        },
        {
            name: "User F",
            email: "user.f@depa.com",
            password: passF
        },
        {
            name: "User G",
            email: "user.g@depa.com",
            password: passG
        },
        {
            name: "User H",
            email: "user.h@depa.com",
            password: passH
        }
    ];
    // Function call
    const users = await User.insertMany(userData);

    /////////////////////////////////////////////////////////////////////////////////////////////
    let usersIdsArray = users.map(({ _id }) => _id);[ usersIdsArray[0],usersIdsArray[1],usersIdsArray[2] ]
    let stepOneusersIdsArray = [ usersIdsArray[0],usersIdsArray[1],usersIdsArray[2] ]
    let stepTwousersIdsArray = [ usersIdsArray[3] ]
    let stepThreeusersIdsArray = [ usersIdsArray[4] ]
    let stepFourusersIdsArray = [ usersIdsArray[5] ]
    let stepFiveusersIdsArray = [ usersIdsArray[6],usersIdsArray[7] ]

    let workFlowData = {
        name: "WorkFlow A",
        specialCaseUserId: [], // The special case user who can individually approve the workflow
        steps: [
            {
                name: "Step One",
                type: "or",
                approverIds: stepOneusersIdsArray, // Reference to User document _id
            },
            {
                name: "Step Two",
                type: "none",
                approverIds: stepTwousersIdsArray, // Reference to User document _id
            },
            {
                name: "Step Three",
                type: "none",
                approverIds: stepThreeusersIdsArray, // Reference to User document _id
            },
            {
                name: "Step Four",
                type: "none",
                approverIds: stepFourusersIdsArray, // Reference to User document _id
            },
            {
                name: "Step Five",
                type: "and",
                approverIds: stepFiveusersIdsArray, // Reference to User document _id
            }
        ],
    };

    // Function call
    const workFlow = await new WorkFlow(workFlowData);
    workFlow.save(function(err,result){
    if (err){
        console.log(err);
    }
    else{
        console.log(result)
    }});

    ///////////////////////////////////////////////////////////////////////////////////////
    let workFlowSetpsIdsArray = workFlow.steps.map(({ _id }) => _id);
    let moduleData = {
        moduleCode: "Module-A",
        companyCode: "Company-XYZ",
        adminUsers: usersIdsArray,
        workFlow: workFlow,
        approvalStepStatus: [
            {
                step: workFlowSetpsIdsArray[0],
                activeUser: [stepOneusersIdsArray[0]],
                pendingUserIds:  [stepOneusersIdsArray[1],stepOneusersIdsArray[2]],
                isActive:true
            },
            {
                step: workFlowSetpsIdsArray[1],
                pendingUserIds: stepTwousersIdsArray,
            },
            {
                step: workFlowSetpsIdsArray[2],
                pendingUserIds: stepThreeusersIdsArray,
            },
            {
                step: workFlowSetpsIdsArray[3],
                pendingUserIds: stepFourusersIdsArray,
            },
            {
                step: workFlowSetpsIdsArray[4],
                pendingUserIds: stepFiveusersIdsArray,
            }
        ],
    };

    // Function call
    const module = await new Module(moduleData);
    module.save(function(err,result){
    if (err){
        console.log(err);
    }
    else{
        console.log(result)
    }});

    console.log(users, users.map(({ _id }) => _id));
    console.log(workFlow);
    console.log(moduleData);
    // process.exit();
}).catch((error) => {console.log(error)});