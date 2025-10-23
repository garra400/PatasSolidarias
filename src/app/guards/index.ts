// Barrel export para todos os guards
export { authGuard, adminGuard, doadorGuard } from './auth.guard';
export { permissionGuard, createPermissionGuard } from './permission.guard';

// Re-export para facilitar
import { adminGuard as adminGuardNew } from './admin.guard';
export { adminGuardNew };
