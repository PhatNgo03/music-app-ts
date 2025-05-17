import { generateRandomString } from "../helpers/generate";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new mongoose.Schema({
    fullName: String, 
    email : String,
    password: String,
    token: {
      type: String,
      default: generateRandomString(20)
    },
    phone: String, 
    avatar: String,
    role_id: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
    status: {
      type :String,
      default: "active"
    },
    deleted: {
        type:Boolean,
        default:false
    },
    deletedAt: Date
},
{
 timestamps: true
});
const Account = mongoose.model('Account', accountSchema, "accounts");

export default Account;