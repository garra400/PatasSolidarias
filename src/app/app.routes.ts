import { Routes } from '@angular/router';
import { authGuard, adminGuard, doadorGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'redefinir-senha',
    loadComponent: () => import('./components/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'confirmar-email',
    loadComponent: () => import('./components/auth/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent)
  },
  {
    path: 'seja-padrinho',
    loadComponent: () => import('./components/payment/seja-padrinho/seja-padrinho.component').then(m => m.SejaPadrinhoComponent),
    canActivate: [authGuard]
  },

  // User Account Routes (Protected with Sidebar Layout)
  {
    path: 'conta',
    canActivate: [authGuard],
    loadComponent: () => import('./components/user/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'seja-apoiador',
        pathMatch: 'full'
      },
      {
        path: 'seja-apoiador',
        loadComponent: () => import('./components/payment/seja-padrinho/seja-padrinho.component').then(m => m.SejaPadrinhoComponent)
      },
      {
        path: 'doar-novamente',
        loadComponent: () => import('./components/user/doar-novamente/doar-novamente.component').then(m => m.DoarNovamenteComponent),
        canActivate: [doadorGuard]
      },
      {
        path: 'meus-brindes',
        loadComponent: () => import('./components/dashboard/meus-brindes/meus-brindes.component').then(m => m.MeusBrindesComponent),
        canActivate: [doadorGuard]
      },
      {
        path: 'fotos',
        loadComponent: () => import('./components/user/fotos/fotos.component').then(m => m.FotosComponent),
        canActivate: [doadorGuard]
      },
      {
        path: 'pagamentos',
        loadComponent: () => import('./components/user/pagamentos/pagamentos.component').then(m => m.PagamentosComponent),
        canActivate: [doadorGuard]
      },
      {
        path: 'assinatura',
        loadComponent: () => import('./components/user/assinatura/assinatura.component').then(m => m.AssinaturaComponent),
        canActivate: [doadorGuard]
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./components/user/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent)
      }
    ]
  },

  // Old Dashboard Route - Redirect to new structure
  {
    path: 'dashboard',
    redirectTo: 'conta/meus-brindes',
    pathMatch: 'full'
  },

  // Admin Routes (Protected)
  {
    path: 'admin',
    children: [
      // Admin Login (Public - sem guard)
      {
        path: 'login',
        loadComponent: () => import('./components/admin/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
      },
      // Admin Dashboard e outras rotas (Protected)
      {
        path: '',
        canActivate: [authGuard, adminGuard],
        loadChildren: () => import('./routes/admin.routes').then(m => m.adminRoutes)
      }
    ]
  },

  // Old Admin Routes Redirect
  {
    path: 'adm',
    redirectTo: 'admin',
    pathMatch: 'prefix'
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: ''
  }
];
