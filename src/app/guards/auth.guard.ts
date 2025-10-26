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

  console.log('🔒 AdminGuard - Verificando acesso admin');
  console.log('📍 URL solicitada:', state.url);
  console.log('✅ Autenticado?', authService.isAuthenticated());
  console.log('👤 Usuário atual:', authService.currentUserValue);
  console.log('🛡️ É admin?', authService.isAdmin());

  if (!authService.isAuthenticated()) {
    console.warn('❌ Usuário não autenticado - redirecionando para login');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (authService.isAdmin()) {
    console.log('✅ Acesso admin permitido');
    return true;
  }

  console.warn('❌ Usuário não é admin - redirecionando para home');
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
