import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  }

  console.warn('🚫 Acesso negado: usuário não é admin');
  router.navigate(['/'], {
    queryParams: { error: 'admin-required' }
  });
  return false;
};

export const doadorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isDoador()) {
    return true;
  }

  // Redireciona para a página de seja apoiador dentro da conta
  router.navigate(['/conta/seja-apoiador']);
  return false;
};
