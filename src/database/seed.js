const mongoose = require('mongoose');
const app = require('./../app');
const config = require('./../config/config');
const logger = require('./../config/logger');
const bcrypt = require('bcryptjs');

const { User, Company, Category } = require('./../models/index');
const { formService, moduleService, subModuleService, submissionService } = require('../services');

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
                email: "admin@depa.com",
                password: passA,
                roles: ["admin"]
            },
            {
                userName: "F",
                fullName: "Fahad",
                email: "fahad@quaidtech.com",
                password: passA,
                roles: ["admin", "any"]
            },
            {
                userName: "M",
                fullName: "Mohid",
                email: "mohid@quaidtech.com",
                password: passA,
                roles: ["admin", "any"]
            },
            {
                userName: "MK",
                fullName: "Mohammad Kamran",
                email: "kamran@depa.com",
                password: passB,
                roles: ["admin", "any"]
            },
            {
                userName: "H",
                fullName: "HOD",
                email: "hod@depa.com",
                password: passH
            },
            {
                userName: "H",
                fullName: "HR",
                email: "hr@depa.com",
                password: passH
            },
            {
                userName: "S",
                fullName: "Service Desk",
                email: "srdesk@depa.com",
                password: passH
            },
            {
                userName: "A",
                fullName: "Mr. ALi Katkhada",
                email: "mali@depa.com",
                password: passA
            },
            {
                userName: "C",
                fullName: "Adeel Hashmi",
                email: "adeel@depa.com",
                password: passC
            },
            {
                userName: "D",
                fullName: "Ishtiaq Ahmed",
                email: "ishtiaq@depa.com",
                password: passD
            },
            {
                userName: "E",
                fullName: "Mohammad Jahanzeb",
                email: "jahanzeb@depa.com",
                password: passE
            },
            {
                userName: "F",
                fullName: "Moin Ul Haq",
                email: "user.f@depa.com",
                password: passF
            },
            {
                userName: "G",
                fullName: "Usaid Qazi",
                email: "user.g@depa.com",
                password: passG
            },
            {
                userName: "H",
                fullName: "Hassan Khan",
                email: "hassan@depa.com",
                password: passH
            }
        ];
        // Function call
        const users = await User.insertMany(userData);

        // Default forms data
        const formsData = [
            {
                "title": "Login Form",
                "components": [
                    {
                        "label": "Email",
                        "tableView": true,
                        "validate": {
                            "required": true,
                            "customMessage": "A valid email is required"
                        },
                        "key": "email",
                        "type": "email",
                        "input": true
                    },
                    {
                        "label": "Password",
                        "showCharCount": true,
                        "tableView": false,
                        "validate": {
                            "required": true,
                            "minLength": 8
                        },
                        "key": "password",
                        "type": "password",
                        "input": true,
                        "protected": true
                    },
                    {
                        "label": "Login",
                        "showValidations": false,
                        "disableOnInvalid": true,
                        "tableView": false,
                        "key": "submit",
                        "type": "button",
                        "input": true,
                        "saveOnEnter": true
                    }
                ],
                "display": "default",
                "key": "login_form",
            },
            {
                "title": "Login Form Active Directory",
                "components": [
                    {
                        "label": "Username",
                        "tableView": true,
                        "validate": {
                            "required": true,
                            "customMessage": "Username is required"
                        },
                        "key": "username",
                        "type": "textfield",
                        "input": true
                    },
                    {
                        "label": "Password",
                        "showCharCount": true,
                        "tableView": false,
                        "validate": {
                            "required": true,
                            "minLength": 8
                        },
                        "key": "password",
                        "type": "password",
                        "input": true,
                        "protected": true
                    },
                    {
                        "label": "Login",
                        "showValidations": false,
                        "disableOnInvalid": true,
                        "tableView": false,
                        "key": "submit",
                        "type": "button",
                        "input": true,
                        "saveOnEnter": true
                    }
                ],
                "display": "default",
                "key": "login_form_ac",
            },
            {
                "title": "Module details form",
                "components": [
                    {
                        "label": "Module Title",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "moduleTitle",
                        "type": "textfield",
                        "input": true
                    },
                    {
                        "label": "Module URL",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "moduleUrl",
                        "type": "url",
                        "input": true
                    },
                    {
                        "label": "Description",
                        "autoExpand": false,
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "description",
                        "type": "textarea",
                        "input": true
                    },
                    {
                        "label": "Code",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "code",
                        "type": "textfield",
                        "input": true
                    },
                    {
                        "label": "Proceed to Default Workflow",
                        "showValidations": false,
                        "customClass": "flex justify-end",
                        "tableView": false,
                        "key": "proceedToDefaultWorkflow",
                        "type": "button",
                        "input": true,
                        "saveOnEnter": false,
                        "disableOnInvalid": true
                    }
                ],
                "display": "default",
                "key": "module_details_form",
            },
            {
                "title": "Workflow Form",
                "components": [
                    {
                        "label": "Add Default Workflow",
                        "columns": [
                            {
                                "components": [
                                    {
                                        "type": "select",
                                        "label": "Approvers",
                                        "key": "approvers",
                                        "data": {
                                            "values": [
                                                {
                                                    "value": "raindropsOnRoses",
                                                    "label": "Raindrops on roses"
                                                },
                                                {
                                                    "value": "whiskersOnKittens",
                                                    "label": "Whiskers on Kittens"
                                                },
                                                {
                                                    "value": "brightCopperKettles",
                                                    "label": "Bright Copper Kettles"
                                                },
                                                {
                                                    "value": "warmWoolenMittens",
                                                    "label": "Warm Woolen Mittens"
                                                }
                                            ]
                                        },
                                        "dataSrc": "values",
                                        "template": "<span>{{ item.label }}</span>",
                                        "multiple": true,
                                        "input": true
                                    }
                                ],
                                "width": 6,
                                "offset": 0,
                                "push": 0,
                                "pull": 0,
                                "size": "md",
                                "currentWidth": 6
                            },
                            {
                                "components": [
                                    {
                                        "label": "Condition",
                                        "widget": "html5",
                                        "tableView": true,
                                        "data": {
                                            "values": [
                                                {
                                                    "label": "OR",
                                                    "value": "or"
                                                },
                                                {
                                                    "label": "AND",
                                                    "value": "and"
                                                },
                                                {
                                                    "label": "ANY",
                                                    "value": "any"
                                                }
                                            ]
                                        },
                                        "key": "condition",
                                        "type": "select",
                                        "input": true
                                    }
                                ],
                                "width": 6,
                                "offset": 0,
                                "push": 0,
                                "pull": 0,
                                "size": "md",
                                "currentWidth": 6
                            }
                        ],
                        "key": "addDefaultWorkflow",
                        "type": "columns",
                        "input": false,
                        "tableView": false
                    },
                    {
                        "label": "Proceed to Module Graphics",
                        "showValidations": false,
                        "customClass": "flex justify-end",
                        "tableView": false,
                        "key": "proceedToModuleGraphics",
                        "type": "button",
                        "disableOnInvalid": true,
                        "saveOnEnter": false,
                        "input": true
                    }
                ],
                "display": "default",
                "key": "workflow_form",
            },
            {
                "title": "Submodule Form",
                "components": [
                    {
                        "label": "Submodule Url",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "submoduleUrl",
                        "type": "url",
                        "input": true
                    },
                    {
                        "label": "Company Name",
                        "widget": "html5",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "companyName",
                        "type": "select",
                        "data": {
                            "values": []
                        },
                        "input": true
                    },
                    {
                        "label": "Code",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "key": "code",
                        "type": "textfield",
                        "input": true
                    },
                ],
                "display": "default",
                "key": "submodule_form",
            },
            {
                "title": "User Form",
                "components": [
                    {
                        "label": "Full Name",
                        "tableView": true,
                        "key": "fullname",
                        "type": "textfield",
                        "input": true,
                        "validate": {
                            "required": true
                        },
                    },
                    {
                        "label": "Email",
                        "tableView": true,
                        "key": "email",
                        "type": "email",
                        "validate": {
                            "required": true
                        },
                        "input": true
                    },
                    {
                        "label": "Roles",
                        "widget": "choicesjs",
                        "tableView": true,
                        "validate": {
                            "required": true
                        },
                        "data": {
                            "values": [
                                {
                                    "label": "Admin",
                                    "value": "admin"
                                },
                                {
                                    "label": "User",
                                    "value": "user"
                                }
                            ]
                        },
                        "key": "roles",
                        "type": "select",
                        "input": true
                    }
                ],
                "display": "default",
                "key": "user_form"
            },
            {
                "title": "Email Creation Form",
                "key": "email_creation_form",
                "display": "form",
                "components": [
                    {
                        "label": "Full Name",
                        "tableView": true,
                        "key": "fullName",
                        "type": "textfield",
                        "input": true
                    },
                    {
                        "label": "Phone Number",
                        "tableView": true,
                        "key": "phoneNumber",
                        "type": "phoneNumber",
                        "input": true
                    },
                    {
                        "label": "Email",
                        "tableView": true,
                        "key": "email",
                        "type": "email",
                        "input": true
                    },
                    {
                        "label": "Date of Birth",
                        "hideInputLabels": false,
                        "inputsLabelPosition": "top",
                        "useLocaleSettings": false,
                        "tableView": false,
                        "fields": {
                            "day": {
                                "hide": false
                            },
                            "month": {
                                "hide": false
                            },
                            "year": {
                                "hide": false
                            }
                        },
                        "key": "dateOfBirth",
                        "type": "day",
                        "input": true,
                        "defaultValue": "00/00/0000"
                    },
                    {
                        "type": "button",
                        "label": "Submit",
                        "key": "submit",
                        "disableOnInvalid": true,
                        "input": true,
                        "tableView": false
                    }
                ]
            }
        ];

        // Function call
        const forms = await formService.createManyForms(formsData);

        const companiesData = [
            {
                groupCode: 'depa-group',
                title: 'DEPA Groups',
            },
            {
                groupCode: 'quaid-tech',
                title: 'Quaid Tech',
            }
        ];
        const companies = await Company.insertMany(companiesData);

        const categoriesData = [
            {
                name: "Management"
            },
            {
                name: "Accounts & Finance"
            }
        ]
        const categories = await Category.insertMany(categoriesData);

        // const moduleData = {
        //     categoryId: categories[0].id,
        //     code: "it-department",
        //     title: "IT Department",
        //     description: "The IT department oversees the installation and maintenance of computer network systems within a company. This may only require a single IT employee, or in the case of larger organizations, a team of people working to ensure that the network runs smoothly.",
        //     url: "/submodule/submodules-list/it-department",
        //     image: "uploads/images/1686820628632.jpg",
        //     steps: [
        //         {
        //             "condition": "none",
        //             "approverIds": [users[1]],
        //             "emailNotifyTo": [],
        //         },
        //         {
        //             "condition": "none",
        //             "approverIds": [users[2]],
        //             "emailNotifyTo": [],
        //         },
        //         {
        //             "condition": "none",
        //             "approverIds": [users[3]],
        //             "emailNotifyTo": [],
        //         }
        //     ],
        //     createdBy: users[0]
        // };

        // const module = await moduleService.createModule(moduleData);

        // const subModuleData = {
        //     moduleId: module.id,
        //     companyId: companies[0],
        //     adminUsers: [users[5]],
        //     viewOnlyUsers: [users[7]],
        //     formIds: [formsData[6]],
        //     code: "digital-transformation",
        //     url: "/submodule/submodule-details/digital-transformation",
        //     steps: [
        //         {
        //             "condition": "none",
        //             "approverIds": [users[1]],
        //             "emailNotifyTo": [],
        //         },
        //         {
        //             "condition": "none",
        //             "approverIds": [users[2]],
        //             "emailNotifyTo": [],
        //         },
        //         {
        //             "condition": "none",
        //             "approverIds": [users[3]],
        //             "emailNotifyTo": [],
        //         }
        //     ],
        //     createdBy: users[0]
        // };

        // const subModule = await subModuleService.createSubModule(subModuleData);

        // Check if all documents were inserted successfully
        if (users.length === userData.length
            && forms.length === formsData.length
        ) {
            console.log("Data seeded successfully");
            console.log(users);
            console.log(forms);
            process.exit(); // Exit the seeder process
        } else {
            console.log("Error seeding data");
        }
    }).catch((error) => { console.log(error) });