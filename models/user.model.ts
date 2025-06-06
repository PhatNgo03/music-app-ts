import mongoose from "mongoose";
import { generateRandomString } from "../helpers/generate";

const userSchema = new mongoose.Schema({
    fullName: String, 
    email : String,
    password: String,
    tokenUser: {
      type: String,
      require: true
    },
    phone: String, 
    avatar: String,
    status: {
      type :String,
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
        type:Boolean,
        default:false
    },
    deletedBy: {
        account_id: String,
        deletedAt:Date
    },
    updatedBy: [
      {
          account_id: String,
          updatedAt:Date
      },
    ]
},
{
 timestamps: true
});
const UserModel  = mongoose.model('User', userSchema, "users");

export default UserModel ;