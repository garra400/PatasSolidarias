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
    path: 'seja-padrinho',
    loadComponent: () => import('./components/payment/seja-padrinho/seja-padrinho.component').then(m => m.SejaPadrinhoComponent),
    canActivate: [authGuard]
  },
  
  // User Dashboard Routes (Protected)
  {
    path: 'dashboard',
    canActivate: [authGuard, doadorGuard],
    children: [
      {
        path: '',
        redirectTo: 'meus-brindes',
        pathMatch: 'full'
      },
      {
        path: 'meus-brindes',
        loadComponent: () => import('./components/dashboard/meus-brindes/meus-brindes.component').then(m => m.MeusBrindesComponent)
      }
    ]
  },

  // Admin Routes (Protected)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'brindes',
        pathMatch: 'full'
      },
      {
        path: 'brindes',
        loadComponent: () => import('./components/admin/gerenciar-brindes/gerenciar-brindes.component').then(m => m.GerenciarBrindesComponent)
      }
    ]
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: ''
  }
];
