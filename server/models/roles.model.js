import mongoose, { Schema } from "mongoose";

const roleSchema = Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: String,

        isSystem: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

const RoleSchema = mongoose.model("Role", roleSchema);
export default RoleSchema;