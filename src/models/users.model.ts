import { Schema, model } from "mongoose";
import { User, UserRole } from "../types/users.interface";

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRole,
      required: false,
      default: UserRole.CLIENT,
    },
    scopes: {
      type: [String],
    },
    recovery_token: {
      type: String,
      default: null,
    },
    profile_pictury: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    confirmation_token: {
      type: String,
      default: null,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    document: {
      type: String,
      default: null,
    },
    review: {
      type: Number,
      default: null,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model("users", UserSchema);

export default UserModel;
