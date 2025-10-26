import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { AdminService } from '../../../service/admin.service';
import { AdminSidebarService } from '../../../service/admin-sidebar.service';
import { TrocarFotoPerfilModalComponent } from '../../shared/trocar-foto-perfil-modal/trocar-foto-perfil-modal.component';
import { ImageUrlHelper } from '../../../utils/image-url.helper';
import { Subscription, filter } from 'rxjs';
import { AdminPermissoes } from '../../../model/admin.model';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet, TrocarFotoPerfilModalComponent],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
    currentUser: any = null;
    isSidebarOpen = true; // Iniciar aberta em desktop
    isFirstRender = true;
    permissoes: AdminPermissoes | null = null;
    mostrarModalFoto = false;

    private authService = inject(AuthService);
    private adminService = inject(AdminService);
    private router = inject(Router);
    private adminSidebarService = inject(AdminSidebarService);
    private subscriptions: Subscription[] = [];

    getFullImageUrl = ImageUrlHelper.getFullImageUrl;

    ngOnInit(): void {
        // Abrir sidebar automaticamente APENAS em desktop (telas grandes)
        if (window.innerWidth >= 1025) {
            this.adminSidebarService.open();
        } else {
            // Em mobile e tablet, manter fechada
            this.adminSidebarService.close();
        }

        // Carregar usuário
        const userSub = this.authService.currentUser.subscribe(user => {
            this.currentUser = user;

            // Se for admin e não tem permissões, definir permissões padrão
            if (user && user.role === 'admin' && !this.permissoes) {
                this.setPermissoesPadrao();
            }
        });
        this.subscriptions.push(userSub);

        // Carregar permissões
        const permSub = this.adminService.permissoes$.subscribe(perm => {
            this.permissoes = perm;
        });
        this.subscriptions.push(permSub);

        // Sincronizar sidebar admin
        const sidebarSub = this.adminSidebarService.sidebarOpen$.subscribe(isOpen => {
            this.isSidebarOpen = isOpen;
        });
        this.subscriptions.push(sidebarSub);

        // Verificar se é admin (com delay de 200ms para garantir que o token foi salvo)
        setTimeout(() => {
            const token = this.authService.getToken();

            if (!token) {
                console.warn('⚠️ Nenhum token encontrado. Usando permissões padrão de fallback.');
                const currentUser = this.authService.currentUserValue;
                if (currentUser?.role === 'admin') {
                    this.setPermissoesPadrao();
                }
                return;
            }

            this.adminService.verificarAdmin().subscribe({
                next: (response) => {
                    // Admin verificado com sucesso
                },
                error: (err) => {
                    console.warn('⚠️ Erro ao verificar admin. Usando permissões padrão.', err);
                    // Se der erro, mas usuário é admin, usar permissões padrão
                    const currentUser = this.authService.currentUserValue;
                    if (currentUser && currentUser.role === 'admin') {
                        this.setPermissoesPadrao();
                    }
                }
            });
        }, 200); // Delay de 200ms

        // Remover flag de primeira renderização
        setTimeout(() => {
            this.isFirstRender = false;
        }, 50);

        // Fechar sidebar em mudanças de rota (mobile)
        const routeSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            if (window.innerWidth < 768) {
                this.adminSidebarService.close();
            }
        });
        this.subscriptions.push(routeSub);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    toggleSidebar(): void {
        this.adminSidebarService.toggle();
    }

    logout(): void {
        if (confirm('Deseja realmente sair?')) {
            this.authService.logout();
            this.router.navigate(['/']);
        }
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
        if (window.innerWidth < 768) {
            this.adminSidebarService.close();
        }
    }

    temPermissao(permissao: keyof AdminPermissoes): boolean {
        return this.permissoes ? this.permissoes[permissao] : false;
    }

    private setPermissoesPadrao(): void {
        this.permissoes = {
            gerenciarAnimais: true,
            gerenciarFotos: true,
            gerenciarBrindes: true,
            gerenciarPosts: true,
            visualizarAssinantes: true,
            convidarAdmins: true,
            gerenciarConfiguracoes: true
        };
    }

    getUserInitials(): string {
        if (!this.currentUser?.nome) return 'A';
        const names = this.currentUser.nome.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    }

    abrirModalFoto(): void {
        this.mostrarModalFoto = true;
    }

    fecharModalFoto(): void {
        this.mostrarModalFoto = false;
    }

    onFotoAtualizada(novaFotoUrl: string): void {
        // O modal já atualizou o localStorage e o authService
        // Apenas fechar o modal
        this.fecharModalFoto();
    }
}
