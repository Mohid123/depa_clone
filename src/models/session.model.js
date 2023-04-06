const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const sessionSchema = mongoose.Schema(
  {
    key: { type: String, required: true },
    endTime: { type: Date, default: null },
    expiryTime: { type: Date, required: true },
    isActiveDrLogin: { type: Boolean, default: false },

    revisionNo: {  type: Number, default: 0, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sessionSchema.plugin(toJSON);

/**
 * @typedef Session
 */
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
