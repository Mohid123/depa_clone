const mongoose = require('mongoose');

const defaultFields = {
    revisionNo: { type: Number, default: 0, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
};

module.exports = defaultFields;