import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AdminService } from '../service/admin.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const adminService = inject(AdminService);
    const router = inject(Router);

    return adminService.verificarAdmin().pipe(
        map(response => {
            if (response.isAdmin) {
                return true;
            } else {
                console.warn('🚫 Acesso negado: usuário não é admin');
                router.navigate(['/admin/login'], {
                    queryParams: { returnUrl: state.url }
                });
                return false;
            }
        }),
        catchError(error => {
            console.error('❌ Erro ao verificar admin:', error);
            router.navigate(['/admin/login'], {
                queryParams: { returnUrl: state.url }
            });
            return of(false);
        })
    );
};
