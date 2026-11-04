import mongoose, {Schema} from "mongoose";

const rolePermissionSchema = (
    {
        roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
        },

        permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
        },
    },
    {timestamps: true}
);

rolePermissionSchema.index(
  { roleId: 1, permissionId: 1 },
  { unique: true }
);

const RolePermissionSchema = mongoose.model("rolePermissionSchema", rolePermissionSchema);
export default RolePermissionSchema