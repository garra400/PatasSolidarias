import { Routes } from '@angular/router';
import { adminGuard } from '../guards/auth.guard';
import { permissionGuard } from '../guards/permission.guard';

/**
 * Rotas da área administrativa
 * Todas as rotas requerem autenticação e privilégios de admin
 */
export const adminRoutes: Routes = [
    {
        path: '',
        canActivate: [adminGuard],
        loadComponent: () => import('../components/admin/admin-layout/admin-layout.component')
            .then(m => m.AdminLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('../components/admin/dashboard/dashboard.component')
                    .then(m => m.DashboardComponent),
                title: 'Dashboard Admin - Patas Solidárias'
            },

            // ANIMAIS
            {
                path: 'animais',
                canActivate: [permissionGuard],
                data: { permission: 'gerenciarAnimais' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/animais/lista-animais/lista-animais.component')
                            .then(m => m.ListaAnimaisComponent),
                        title: 'Gerenciar Animais - Admin'
                    },
                    {
                        path: 'novo',
                        loadComponent: () => import('../components/admin/animais/form-animal/form-animal.component')
                            .then(m => m.FormAnimalComponent),
                        title: 'Cadastrar Animal - Admin'
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('../components/admin/animais/form-animal/form-animal.component')
                            .then(m => m.FormAnimalComponent),
                        title: 'Editar Animal - Admin'
                    }
                ]
            },

            // FOTOS
            {
                path: 'fotos',
                canActivate: [permissionGuard],
                data: { permission: 'gerenciarFotos' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/fotos/lista-fotos/lista-fotos.component')
                            .then(m => m.ListaFotosComponent),
                        title: 'Galeria de Fotos - Admin'
                    },
                    {
                        path: 'upload',
                        loadComponent: () => import('../components/admin/fotos/upload-fotos/upload-fotos.component')
                            .then(m => m.UploadFotosComponent),
                        title: 'Upload de Fotos - Admin'
                    },
                    {
                        path: 'pendentes',
                        loadComponent: () => import('../components/admin/fotos/fotos-pendentes/fotos-pendentes.component')
                            .then(m => m.FotosPendentesComponent),
                        title: 'Fotos Pendentes - Admin'
                    }
                ]
            },

            // BRINDES
            {
                path: 'brindes',
                canActivate: [permissionGuard],
                data: { permission: 'gerenciarBrindes' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/brindes/lista-brindes/lista-brindes.component')
                            .then(m => m.ListaBrindesComponent),
                        title: 'Gerenciar Brindes - Admin'
                    },
                    {
                        path: 'novo',
                        loadComponent: () => import('../components/admin/brindes/form-brinde/form-brinde.component')
                            .then(m => m.FormBrindeComponent),
                        title: 'Cadastrar Brinde - Admin'
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('../components/admin/brindes/form-brinde/form-brinde.component')
                            .then(m => m.FormBrindeComponent),
                        title: 'Editar Brinde - Admin'
                    },
                    {
                        path: 'selecionar',
                        loadComponent: () => import('../components/admin/brindes/selecionar-brindes/selecionar-brindes.component')
                            .then(m => m.SelecionarBrindesComponent),
                        title: 'Selecionar Brindes para Resgate - Admin'
                    }
                ]
            },

            // RESGATES
            {
                path: 'resgates',
                canActivate: [permissionGuard],
                data: { permission: 'gerenciarBrindes' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/resgates/lista-resgates/lista-resgates.component')
                            .then(m => m.ListaResgatesComponent),
                        title: 'Solicitações de Resgate - Admin'
                    },
                    {
                        path: 'configuracao',
                        loadComponent: () => import('../components/admin/resgates/config-resgate/config-resgate.component')
                            .then(m => m.ConfigResgateComponent),
                        data: { permission: 'gerenciarConfiguracoes' },
                        title: 'Configurar Horários - Admin'
                    }
                ]
            },

            // POSTS/NEWSLETTER
            {
                path: 'posts',
                canActivate: [permissionGuard],
                data: { permission: 'gerenciarPosts' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/posts/lista-posts/lista-posts.component')
                            .then(m => m.ListaPostsComponent),
                        title: 'Newsletter - Admin'
                    },
                    {
                        path: 'novo',
                        loadComponent: () => import('../components/admin/posts/editor-post/editor-post.component')
                            .then(m => m.EditorPostComponent),
                        title: 'Nova Newsletter - Admin'
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('../components/admin/posts/editor-post/editor-post.component')
                            .then(m => m.EditorPostComponent),
                        title: 'Editar Newsletter - Admin'
                    }
                ]
            },

            // ASSINANTES
            {
                path: 'assinantes',
                canActivate: [permissionGuard],
                data: { permission: 'visualizarAssinantes' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/assinantes/lista-assinantes/lista-assinantes.component')
                            .then(m => m.ListaAssinantesComponent),
                        title: 'Apoiadores - Admin'
                    },
                    {
                        path: 'estatisticas',
                        loadComponent: () => import('../components/admin/assinantes/estatisticas/estatisticas.component')
                            .then(m => m.EstatisticasComponent),
                        title: 'Estatísticas - Admin'
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('../components/admin/assinantes/detalhe-assinante/detalhe-assinante.component')
                            .then(m => m.DetalheAssinanteComponent),
                        title: 'Detalhes do Apoiador - Admin'
                    }
                ]
            },

            // ADMINS
            {
                path: 'admins',
                canActivate: [permissionGuard],
                data: { permission: 'convidarAdmins' },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../components/admin/admins/lista-admins/lista-admins.component')
                            .then(m => m.ListaAdminsComponent),
                        title: 'Gerenciar Admins - Admin'
                    },
                    {
                        path: 'convites',
                        loadComponent: () => import('../components/admin/admins/lista-convites/lista-convites.component')
                            .then(m => m.ListaConvitesComponent),
                        title: 'Convites Admin - Admin'
                    }
                ]
            },

            // Rota para aceitar convite (não requer permissões especiais, só estar logado)
            {
                path: 'aceitar-convite/:token',
                loadComponent: () => import('../components/admin/admins/aceitar-convite/aceitar-convite.component')
                    .then(m => m.AceitarConviteComponent),
                title: 'Aceitar Convite Admin'
            },

            // Página de acesso negado
            {
                path: 'acesso-negado',
                loadComponent: () => import('../components/admin/acesso-negado/acesso-negado.component')
                    .then(m => m.AcessoNegadoComponent),
                title: 'Acesso Negado'
            }
        ]
    }
];
