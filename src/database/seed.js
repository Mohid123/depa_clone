const mongoose = require('mongoose');
const app = require('./../app');
const config = require('./../config/config');
const logger = require('./../config/logger');
const bcrypt = require('bcryptjs');

const { User } = require('./../models/index');
const { WorkFlow } = require('./../models/index');
const { Module } = require('./../models/index');

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
            username: "Admin",
            email: "admin@depa.com",
            password: passA,
            role: "admin"
        },
        {
            username: "User A",
            email: "user.a@depa.com",
            password: passA
        },
        {
            username: "User B",
            email: "user.b@depa.com",
            password: passB
        },
        {
            username: "User C",
            email: "user.c@depa.com",
            password: passC
        },
        {
            username: "User D",
            email: "user.d@depa.com",
            password: passD
        },
        {
            username: "User E",
            email: "user.e@depa.com",
            password: passE
        },
        {
            username: "User F",
            email: "user.f@depa.com",
            password: passF
        },
        {
            username: "User G",
            email: "user.g@depa.com",
            password: passG
        },
        {
            username: "User H",
            email: "user.h@depa.com",
            password: passH
        }
    ];
    // Function call
    const users = await User.insertMany(userData);

    /////////////////////////////////////////////////////////////////////////////////////////////
    let usersIdsArray = users.map(({ _id }) => _id);
    let stepOneusersIdsArray = [ usersIdsArray[1],usersIdsArray[2],usersIdsArray[3] ]
    let stepTwousersIdsArray = [ usersIdsArray[4] ]
    let stepThreeusersIdsArray = [ usersIdsArray[5] ]
    let stepFourusersIdsArray = [ usersIdsArray[6] ]
    let stepFiveusersIdsArray = [ usersIdsArray[7],usersIdsArray[8] ]

    let workFlowData = {
        username: "WorkFlow A",
        specialCaseUserId: [], // The special case user who can individually approve the workflow
        steps: [
            {
                username: "Step One",
                type: "or",
                approverIds: stepOneusersIdsArray, // Reference to User document _id
            },
            {
                username: "Step Two",
                type: "none",
                approverIds: stepTwousersIdsArray, // Reference to User document _id
            },
            {
                username: "Step Three",
                type: "none",
                approverIds: stepThreeusersIdsArray, // Reference to User document _id
            },
            {
                username: "Step Four",
                type: "none",
                approverIds: stepFourusersIdsArray, // Reference to User document _id
            },
            {
                username: "Step Five",
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
                stepId: workFlowSetpsIdsArray[0],
                activeUser: stepOneusersIdsArray,
                pendingUserIds:  [],
                type: "or",
                isActive:true
            },
            {
                stepId: workFlowSetpsIdsArray[1],
                pendingUserIds: stepTwousersIdsArray,
            },
            {
                stepId: workFlowSetpsIdsArray[2],
                pendingUserIds: stepThreeusersIdsArray,
            },
            {
                stepId: workFlowSetpsIdsArray[3],
                pendingUserIds: stepFourusersIdsArray,
            },
            {
                stepId: workFlowSetpsIdsArray[4],
                type: "and",
                pendingUserIds: stepFiveusersIdsArray,
            }
        ],
        forms: [{
            title: "Form A",
            key: "Form-A",
            schema: {
                "components": [
                    {
                        "label": "Email",
                        "labelPosition": "top",
                        "placeholder": "",
                        "description": "",
                        "tooltip": "",
                        "prefix": "",
                        "suffix": "",
                        "widget": {
                            "type": "input"
                        },
                        "inputMask": "",
                        "displayMask": "",
                        "allowMultipleMasks": false,
                        "customClass": "",
                        "tabindex": "",
                        "autocomplete": "",
                        "hidden": false,
                        "hideLabel": false,
                        "showWordCount": false,
                        "showCharCount": false,
                        "mask": false,
                        "autofocus": false,
                        "spellcheck": true,
                        "disabled": false,
                        "tableView": true,
                        "modalEdit": false,
                        "multiple": false,
                        "defaultValue": "",
                        "persistent": true,
                        "inputFormat": "plain",
                        "protected": false,
                        "dbIndex": false,
                        "case": "",
                        "truncateMultipleSpaces": false,
                        "encrypted": false,
                        "redrawOn": "",
                        "clearOnHide": true,
                        "customDefaultValue": "",
                        "calculateValue": "",
                        "calculateServer": false,
                        "allowCalculateOverride": false,
                        "validateOn": "change",
                        "validate": {
                            "required": false,
                            "pattern": "",
                            "customMessage": "",
                            "custom": "",
                            "customPrivate": false,
                            "json": "",
                            "minLength": "",
                            "maxLength": "",
                            "strictDateValidation": false,
                            "multiple": false,
                            "unique": false
                        },
                        "unique": false,
                        "errorLabel": "",
                        "errors": "",
                        "key": "email",
                        "tags": [],
                        "properties": {},
                        "conditional": {
                            "show": null,
                            "when": null,
                            "eq": "",
                            "json": ""
                        },
                        "customConditional": "",
                        "logic": [],
                        "attributes": {},
                        "overlay": {
                            "style": "",
                            "page": "",
                            "left": "",
                            "top": "",
                            "width": "",
                            "height": ""
                        },
                        "type": "textfield",
                        "input": true,
                        "refreshOn": "",
                        "dataGridLabel": false,
                        "addons": [],
                        "inputType": "text",
                        "id": "e6kr2sp"
                    }
                ]
            },
          }],
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