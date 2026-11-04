import { permissions } from "./permission.js";

export const rolePermissions = {
  customer: [
    // permissions.VIEW_TICKET,
    permissions.CREATE_TICKET,
    permissions.UPDATE_TICKET,
    permissions.DELETE_TICKET,
  ],

  agent: [
    permissions.VIEW_TICKET,
    permissions.UPDATE_TICKET,
    permissions.RESOLVE_TICKET,
  ],

  admin: Object.values(permissions),
};