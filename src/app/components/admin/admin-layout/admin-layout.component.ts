import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { AdminService } from '../../../service/admin.service';
import { SidebarService } from '../../../service/sidebar.service';
import { Subscription, filter } from 'rxjs';
import { AdminPermissoes } from '../../../model/admin.model';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
    currentUser: any = null;
    isSidebarOpen = false;
    isFirstRender = true;
    permissoes: AdminPermissoes | null = null;

    private authService = inject(AuthService);
    private adminService = inject(AdminService);
    private router = inject(Router);
    private sidebarService = inject(SidebarService);
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        // Carregar usuário
        const userSub = this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.subscriptions.push(userSub);

        // Carregar permissões
        const permSub = this.adminService.permissoes$.subscribe(perm => {
            this.permissoes = perm;
        });
        this.subscriptions.push(permSub);

        // Sincronizar sidebar
        const sidebarSub = this.sidebarService.sidebarOpen$.subscribe(isOpen => {
            this.isSidebarOpen = isOpen;
        });
        this.subscriptions.push(sidebarSub);

        // Verificar se é admin
        this.adminService.verificarAdmin().subscribe();

        // Remover flag de primeira renderização
        setTimeout(() => {
            this.isFirstRender = false;
        }, 50);

        // Fechar sidebar em mudanças de rota (mobile)
        const routeSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            if (window.innerWidth < 768) {
                this.sidebarService.close();
            }
        });
        this.subscriptions.push(routeSub);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    toggleSidebar(): void {
        this.sidebarService.toggle();
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
            this.sidebarService.close();
        }
    }

    temPermissao(permissao: keyof AdminPermissoes): boolean {
        return this.permissoes ? this.permissoes[permissao] : false;
    }

    getUserInitials(): string {
        if (!this.currentUser?.nome) return 'A';
        const names = this.currentUser.nome.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    }
}
