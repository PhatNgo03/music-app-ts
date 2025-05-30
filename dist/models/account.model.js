"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_1 = require("../helpers/generate");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: (0, generate_1.generateRandomString)(20)
    },
    phone: String,
    avatar: String,
    role_id: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    status: {
        type: String,
        default: "active"
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        },
    ]
}, {
    timestamps: true
});
const Account = mongoose.model('Account', accountSchema, "accounts");
exports.default = Account;
