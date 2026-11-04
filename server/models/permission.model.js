import mongoose, { Schema } from "mongoose";

const permissionSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: String,

    resource: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PermissionSchema = mongoose.model("Permission", permissionSchema);
export default PermissionSchema;