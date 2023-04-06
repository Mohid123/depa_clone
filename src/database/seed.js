const mongoose = require('mongoose');
const app = require('./../app');
const config = require('./../config/config');
const logger = require('./../config/logger');
const bcrypt = require('bcryptjs');

const { User } = require('./../models/index');
// const { WorkFlow } = require('./../models/index');
// const { Module } = require('./../models/index');
// const { ApprovalLog } = require('./../models/index');
// const { ApprovalStepStatus } = require('./../models/index');
// const { Email } = require('./../models/index');
// const { Form } = require('./../models/index');
// const { ModuleSummary } = require('./../models/index');
// const { SubModule } = require('./../models/index');
// const { WorkflowStep } = require('./../models/index');

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
                userName: "Admin",
                fullName: "Administrator",
                fullName: "Administrator",
                email: "admin@depa.com",
                password: passA,
                role: "admin"
            },
            {
                userName: "A",
                fullName: "User A",
                email: "user.a@depa.com",
                password: passA
            },
            {
                userName: "B",
                fullName: "User B",
                email: "user.b@depa.com",
                password: passB
            },
            {
                userName: "C",
                fullName: "User C",
                email: "user.c@depa.com",
                password: passC
            },
            {
                userName: "D",
                fullName: "User D",
                email: "user.d@depa.com",
                password: passD
            },
            {
                userName: "E",
                fullName: "User E",
                email: "user.e@depa.com",
                password: passE
            },
            {
                userName: "F",
                fullName: "User F",
                email: "user.f@depa.com",
                password: passF
            },
            {
                userName: "G",
                fullName: "User G",
                email: "user.g@depa.com",
                password: passG
            },
            {
                userName: "H",
                fullName: "User H",
                email: "user.h@depa.com",
                password: passH
            }
        ];
        // Function call
        const users = await User.insertMany(userData);

        console.log(users);

        /////////////////////////////////////////////////////////////////////////////////////////////
        // let usersIdsArray = users.map(({ _id }) => _id);
        // let stepOneusersIdsArray = [usersIdsArray[1], usersIdsArray[2], usersIdsArray[3]]
        // let stepTwousersIdsArray = [usersIdsArray[4]]
        // let stepThreeusersIdsArray = [usersIdsArray[5]]
        // let stepFourusersIdsArray = [usersIdsArray[6]]
        // let stepFiveusersIdsArray = [usersIdsArray[7], usersIdsArray[8]]

        // // Workflow Step Data
        // let workflowStepData = [
        //     { type: "or", approverIds: stepOneusersIdsArray },
        //     { type: "none", approverIds: stepTwousersIdsArray },
        //     { type: "none", approverIds: stepThreeusersIdsArray },
        //     { type: "none", approverIds: stepFourusersIdsArray },
        //     { type: "and", approverIds: stepFiveusersIdsArray }
        // ];

        // const workflowStep = await new WorkflowStep(workflowStepData);
        // workflowStep.save(function (err, result) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(result)
        //     }
        // });

        // // Workflow Data
        // let workFlowSetpsIdsArray = workflowStep.map(({ _id }) => _id);

        // let workFlowData = {
        //     name: "WorkFlow A",    
        //     anyUserIds: [],
        //     defaultUsers: {},
        //     finalUsers: {},
        //     stepIds: workFlowSetpsIdsArray
        // };

        // const workFlow = await new WorkFlow(workFlowData);
        // workFlow.save(function (err, result) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(result)
        //     }
        // });

        // //////// Modules and Submodules Data
        // ///////////////////////////////////////////////////////////////////////////////////////

        // let approvalStepData =  [
        //     {
        //         stepId: workFlowSetpsIdsArray[0],
        //         activeUser: [stepOneusersIdsArray],
        //         type: "or",
        //         isActive: true,
        //     },
        //     {
        //         stepId: workFlowSetpsIdsArray[1],
        //         pendingUserIds: [stepTwousersIdsArray],
        //     },
        //     {
        //         stepId: workFlowSetpsIdsArray[2],
        //         pendingUserIds: [stepThreeusersIdsArray],
        //     },
        //     {
        //         stepId: workFlowSetpsIdsArray[3],
        //         pendingUserIds: [stepFourusersIdsArray],
        //     },
        //     {
        //         stepId: workFlowSetpsIdsArray[4],
        //         pendingUserIds: [stepFiveusersIdsArray],
        //         type: "and",
        //     }
        // ];

        // const approvalStep = await new ApprovalStep(approvalStepDataData);
        // approvalStep.save(function (err, result) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(result)
        //     }
        // });

        // // Workflow Data
        // let approvalStepsIdsArray = approvalStep.map(({ _id }) => _id);

        // let subModulesData = {
        //     section: "Section A",
        //     WorkFlow: {
        //         name: "WorkFlow A",
        //         anyUserIds: [],
        //         defaultUsers: {},
        //         finalUsers: {},
        //         stepIds: workFlowSetpsIdsArray
        //     },
        //     approvalStepStatus: [approvalStepsIdsArray],
        //     approvalLog: [],
        //     form: [{
        //         title: "Form A",
        //         key: "Form-A",
        //         schema: {
        //             "components": [
        //                 {
        //                     "label": "Email",
        //                     "labelPosition": "top",
        //                     "placeholder": "",
        //                     "description": "",
        //                     "tooltip": "",
        //                     "prefix": "",
        //                     "suffix": "",
        //                     "widget": {
        //                         "type": "input"
        //                     },
        //                     "inputMask": "",
        //                     "displayMask": "",
        //                     "allowMultipleMasks": false,
        //                     "customClass": "",
        //                     "tabindex": "",
        //                     "autocomplete": "",
        //                     "hidden": false,
        //                     "hideLabel": false,
        //                     "showWordCount": false,
        //                     "showCharCount": false,
        //                     "mask": false,
        //                     "autofocus": false,
        //                     "spellcheck": true,
        //                     "disabled": false,
        //                     "tableView": true,
        //                     "modalEdit": false,
        //                     "multiple": false,
        //                     "defaultValue": "",
        //                     "persistent": true,
        //                     "inputFormat": "plain",
        //                     "protected": false,
        //                     "dbIndex": false,
        //                     "case": "",
        //                     "truncateMultipleSpaces": false,
        //                     "encrypted": false,
        //                     "redrawOn": "",
        //                     "clearOnHide": true,
        //                     "customDefaultValue": "",
        //                     "calculateValue": "",
        //                     "calculateServer": false,
        //                     "allowCalculateOverride": false,
        //                     "validateOn": "change",
        //                     "validate": {
        //                         "required": false,
        //                         "pattern": "",
        //                         "customMessage": "",
        //                         "custom": "",
        //                         "customPrivate": false,
        //                         "json": "",
        //                         "minLength": "",
        //                         "maxLength": "",
        //                         "strictDateValidation": false,
        //                         "multiple": false,
        //                         "unique": false
        //                     },
        //                     "unique": false,
        //                     "errorLabel": "",
        //                     "errors": "",
        //                     "key": "email",
        //                     "tags": [],
        //                     "properties": {},
        //                     "conditional": {
        //                         "show": null,
        //                         "when": null,
        //                         "eq": "",
        //                         "json": ""
        //                     },
        //                     "customConditional": "",
        //                     "logic": [],
        //                     "attributes": {},
        //                     "overlay": {
        //                         "style": "",
        //                         "page": "",
        //                         "left": "",
        //                         "top": "",
        //                         "width": "",
        //                         "height": ""
        //                     },
        //                     "type": "textfield",
        //                     "input": true,
        //                     "refreshOn": "",
        //                     "dataGridLabel": false,
        //                     "addons": [],
        //                     "inputType": "text",
        //                     "id": "e6kr2sp"
        //                 }
        //             ]
        //         },
        //     }]
        // };

        // let moduleData = {
        //     moduleCode: "Module-A",
        //     companyCode: "Company-XYZ",
        //     adminUsers: usersIdsArray,
        //     defaultWorkFlow: workFlow._id,
        //     WorkFlow: {
        //         name: "First Sub Module",
        //         anyUserIds: [],
        //         defaultUsers: {},
        //         finalUsers: {},
        //         stepIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' }]
        //     },
        //     subModules: [
        //         {
        //             stepId: { type: String, ref: 'WorkflowStep', required: true },
        //             activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             type: { type: String, enum: ["none", "and", "or"], default: "none" },
        //             status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
        //             isActive: { type: Boolean, default: false },
        //         },
        //         {
        //             stepId: { type: String, ref: 'WorkflowStep', required: true },
        //             activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             type: { type: String, enum: ["none", "and", "or"], default: "none" },
        //             status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
        //             isActive: { type: Boolean, default: false },
        //         },
        //         {
        //             stepId: { type: String, ref: 'WorkflowStep', required: true },
        //             activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             type: { type: String, enum: ["none", "and", "or"], default: "none" },
        //             status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
        //             isActive: { type: Boolean, default: false },
        //         },
        //         {
        //             stepId: { type: String, ref: 'WorkflowStep', required: true },
        //             activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             type: { type: String, enum: ["none", "and", "or"], default: "none" },
        //             status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
        //             isActive: { type: Boolean, default: false },
        //         },
        //         {
        //             stepId: { type: String, ref: 'WorkflowStep', required: true },
        //             activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //             type: { type: String, enum: ["none", "and", "or"], default: "none" },
        //             status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
        //             isActive: { type: Boolean, default: false },
        //         },
        //     ],
        //     approvalStepStatus: [
        //         {
        //             stepId: workFlowSetpsIdsArray[0],
        //             activeUser: stepOneusersIdsArray,
        //             pendingUserIds: [],
        //             type: "or",
        //             isActive: true
        //         },
        //         {
        //             stepId: workFlowSetpsIdsArray[1],
        //             pendingUserIds: stepTwousersIdsArray,
        //         },
        //         {
        //             stepId: workFlowSetpsIdsArray[2],
        //             pendingUserIds: stepThreeusersIdsArray,
        //         },
        //         {
        //             stepId: workFlowSetpsIdsArray[3],
        //             pendingUserIds: stepFourusersIdsArray,
        //         },
        //         {
        //             stepId: workFlowSetpsIdsArray[4],
        //             type: "and",
        //             pendingUserIds: stepFiveusersIdsArray,
        //         }
        //     ],
        //     forms: [{
        //         title: "Form A",
        //         key: "Form-A",
        //         schema: {
        //             "components": [
        //                 {
        //                     "label": "Email",
        //                     "labelPosition": "top",
        //                     "placeholder": "",
        //                     "description": "",
        //                     "tooltip": "",
        //                     "prefix": "",
        //                     "suffix": "",
        //                     "widget": {
        //                         "type": "input"
        //                     },
        //                     "inputMask": "",
        //                     "displayMask": "",
        //                     "allowMultipleMasks": false,
        //                     "customClass": "",
        //                     "tabindex": "",
        //                     "autocomplete": "",
        //                     "hidden": false,
        //                     "hideLabel": false,
        //                     "showWordCount": false,
        //                     "showCharCount": false,
        //                     "mask": false,
        //                     "autofocus": false,
        //                     "spellcheck": true,
        //                     "disabled": false,
        //                     "tableView": true,
        //                     "modalEdit": false,
        //                     "multiple": false,
        //                     "defaultValue": "",
        //                     "persistent": true,
        //                     "inputFormat": "plain",
        //                     "protected": false,
        //                     "dbIndex": false,
        //                     "case": "",
        //                     "truncateMultipleSpaces": false,
        //                     "encrypted": false,
        //                     "redrawOn": "",
        //                     "clearOnHide": true,
        //                     "customDefaultValue": "",
        //                     "calculateValue": "",
        //                     "calculateServer": false,
        //                     "allowCalculateOverride": false,
        //                     "validateOn": "change",
        //                     "validate": {
        //                         "required": false,
        //                         "pattern": "",
        //                         "customMessage": "",
        //                         "custom": "",
        //                         "customPrivate": false,
        //                         "json": "",
        //                         "minLength": "",
        //                         "maxLength": "",
        //                         "strictDateValidation": false,
        //                         "multiple": false,
        //                         "unique": false
        //                     },
        //                     "unique": false,
        //                     "errorLabel": "",
        //                     "errors": "",
        //                     "key": "email",
        //                     "tags": [],
        //                     "properties": {},
        //                     "conditional": {
        //                         "show": null,
        //                         "when": null,
        //                         "eq": "",
        //                         "json": ""
        //                     },
        //                     "customConditional": "",
        //                     "logic": [],
        //                     "attributes": {},
        //                     "overlay": {
        //                         "style": "",
        //                         "page": "",
        //                         "left": "",
        //                         "top": "",
        //                         "width": "",
        //                         "height": ""
        //                     },
        //                     "type": "textfield",
        //                     "input": true,
        //                     "refreshOn": "",
        //                     "dataGridLabel": false,
        //                     "addons": [],
        //                     "inputType": "text",
        //                     "id": "e6kr2sp"
        //                 }
        //             ]
        //         },
        //     }],
        // };

        // // Function call
        // const module = await new Module(moduleData);
        // module.save(function (err, result) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(result)
        //     }
        // });
    }).catch((error) => { console.log(error) });