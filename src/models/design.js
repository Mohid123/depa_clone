"MainModule" = ({
    moduleCode: { type: String, required: true },
    companyCode: { type: String, required: true },
    adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    viewOnlyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    defaultWorkFlow: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
    subModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true }],
    summary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModuleSummary', required: true }],
    status: { type: Boolean, required: true, default: true }
});

"SubModule" = ({
    moduleCode: { type: mongoose.Schema.Types.ObjectId, ref: 'MainModule', required: true},
    WorkFlow: {
        name: { type: String, required: true },
        anyUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        defaultUsers: {
            userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            type: { type: String, enum: ["none","and","or"], default: "none"}
        },
        finalUsers: {
            userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            type: { type: String, enum: ["none","and","or"], default: "none"}
        },
        stepIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' }]
    },
    approvalStepStatus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalStepStatus', required: true }],
    approvalLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalLog', required: true }],
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    achievedScore: { type: mongoose.Types.Decimal128, required: true, default: 0 },
    status: { type: String, enum: ['inProgress', 'approved', 'rejected','declined'], required: true, default: 'inProgress' }
});

"WorkFlow" = ({
    name: { type: String, required: true },
    anyUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    defaultUsers: {
        userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        type: { type: String, enum: ["none","and","or"], default: "none"}
    },
    finalUsers: {
        userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        type: { type: String, enum: ["none","and","or"], default: "none"}
    },
    stepIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' }]
});

"WorkflowStep" = ({
    type: {  type: String, enum: ["none","and","or"] },
    approverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

"ApprovalStepStatus" = ({
    stepId: { type: String, ref: 'WorkflowStep', required: true },
    activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: {  type: String, enum: ["none","and","or"], default: "none"},
    status: { type: String, enum: ['pending', 'approved', 'rejected'],required: true,default: 'pending' },
    isActive: { type: Boolean, default: false },
});

"ApprovalLog" = ({ 
    stepId: { type: Number, ref: 'WorkflowStep', required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['create','approve','reject','decline'], required: true, default: 'approve' },
    remarks: { type: String },
    performedOn: { type: Date, default: Date.now },
});

"Form" = ({
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
    title: { type: String, required: true },
    name: { type: String, required: true },
    key: { type: String, required: true },
    schema: { type: Object, required: true },
});

"ModuleSummary" = ({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    lastActivityBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pendingOn: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: mongoose.Types.Decimal128, required: true, default: 0 }
});

"Email" = ({
    ApprovalLogId: { type: Number, ref: 'ApprovalLog', required: true },
    companyGroup: { type: String, required: true },
    ModuleName: { type: String, required: true },
    subject: { type: String, required: true },
    to: { type: String, required: true },
    cc: { type: String, required: true },
    bcc: { type: String, required: true },
    data: {
        gid: { type: String, required: true },
        subModuleName: { type: String, required: true },
        subModule: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
        ApprovalLogId: { type: Number, ref: 'ApprovalLog', required: true },
    },
    bodyAction: { type: String, required: true },
    bodyWithAction: { type: String, required: true },
    redirectionalUrl: { type: String, required: true },
    status: { type: String, enum:['import', 'sent'], required: true },
});


