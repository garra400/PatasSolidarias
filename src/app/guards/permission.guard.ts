import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AdminService } from '../service/admin.service';
import { AdminPermissoes } from '../model/admin.model';

/**
 * Guard que verifica permissões específicas
 * Uso nas rotas: canActivate: [permissionGuard]
 * Configurar data: { permission: 'gerenciarAnimais' }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const adminService = inject(AdminService);
    const router = inject(Router);

    // Pegar a permissão necessária da configuração da rota
    const requiredPermission = route.data['permission'] as keyof AdminPermissoes;

    console.log('🔐 PermissionGuard - Verificando permissão');
    console.log('📍 URL solicitada:', state.url);
    console.log('🔑 Permissão necessária:', requiredPermission);

    if (!requiredPermission) {
        console.error('❌ PermissionGuard: permissão não especificada na rota');
        return false;
    }

    console.log('🔄 Chamando adminService.verificarAdmin()...');
    return adminService.verificarAdmin().pipe(
        map(response => {
            console.log('✅ PermissionGuard - Resposta recebida:', response);

            if (!response.isAdmin) {
                console.warn('🚫 Acesso negado: usuário não é admin');
                router.navigate(['/login'], {
                    queryParams: { returnUrl: state.url, error: 'admin-required' }
                });
                return false;
            }

            const hasPermission = response.permissoes?.[requiredPermission] || false;
            console.log(`🔍 Tem permissão ${requiredPermission}?`, hasPermission);

            if (hasPermission) {
                console.log('✅ Permissão concedida!');
                return true;
            } else {
                console.warn(`🚫 Acesso negado: sem permissão para ${requiredPermission}`);
                router.navigate(['/adm/dashboard'], {
                    queryParams: { error: 'permission-denied', required: requiredPermission }
                });
                return false;
            }
        }),
        catchError(error => {
            console.error('❌ PermissionGuard - Erro ao verificar permissão:', error);
            console.error('❌ Erro completo:', JSON.stringify(error, null, 2));

            // Se der erro 401/403, redirecionar para login
            if (error.status === 401 || error.status === 403) {
                console.error('❌ Não autenticado ou sem permissão - redirecionando para login');
                router.navigate(['/login'], {
                    queryParams: { returnUrl: state.url, error: 'auth-failed' }
                });
            } else {
                // Para outros erros, redirecionar para home com mensagem
                console.error('❌ Erro inesperado - redirecionando para home');
                router.navigate(['/'], {
                    queryParams: { error: 'unexpected-error' }
                });
            }
            return of(false);
        })
    );
};

/**
 * Helper function para criar guard com permissão específica
 * Uso: canActivate: [createPermissionGuard('gerenciarAnimais')]
 */
export function createPermissionGuard(permission: keyof AdminPermissoes): CanActivateFn {
    return (route, state) => {
        const adminService = inject(AdminService);
        const router = inject(Router);

        return adminService.verificarAdmin().pipe(
            map(response => {
                if (!response.isAdmin) {
                    console.warn('🚫 Acesso negado: usuário não é admin');
                    router.navigate(['/login'], {
                        queryParams: { returnUrl: state.url, error: 'admin-required' }
                    });
                    return false;
                }

                const hasPermission = response.permissoes?.[permission] || false;

                if (hasPermission) {
                    return true;
                } else {
                    console.warn(`🚫 Acesso negado: sem permissão para ${permission}`);
                    router.navigate(['/adm/dashboard'], {
                        queryParams: { error: 'permission-denied', required: permission }
                    });
                    return false;
                }
            }),
            catchError(error => {
                console.error('❌ Erro ao verificar permissão:', error);
                router.navigate(['/login'], {
                    queryParams: { returnUrl: state.url, error: 'auth-failed' }
                });
                return of(false);
            })
        );
    };
}
