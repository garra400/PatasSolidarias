import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/shared/header/header.component';
import { SidebarService } from './service/sidebar.service';
import { AdminSidebarService } from './service/admin-sidebar.service';
import { AuthService } from './service/auth.service';
import { User } from './model/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('PataSolidarias');
  protected readonly currentYear = new Date().getFullYear();
  protected showFooter = true;
  protected isSidebarOpen = false;
  protected isInAccountArea = false;
  protected isInAdminArea = false;
  protected currentUser: User | null = null;
  protected isNavigationSidebarOpen = false;
  protected isMobileView = false;

  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private adminSidebarService = inject(AdminSidebarService);
  private authService = inject(AuthService);

  ngOnInit() {
    // Verificar URL inicial
    this.checkFooterVisibility(this.router.url);
    this.checkAccountArea(this.router.url);
    this.checkAdminArea(this.router.url);
    this.checkMobileView();

    // Monitorar mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkFooterVisibility(event.url);
      this.checkAccountArea(event.url);
      this.checkAdminArea(event.url);
    });

    // Monitorar estado da sidebar (cliente)
    this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      if (!this.isInAdminArea) {
        this.isSidebarOpen = isOpen;
      }
    });

    // Monitorar estado da sidebar (admin)
    this.adminSidebarService.sidebarOpen$.subscribe(isOpen => {
      if (this.isInAdminArea) {
        this.isSidebarOpen = isOpen;
      }
    });

    // Monitorar usuário logado
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // Escutar evento customizado para abrir sidebar de navegação
    window.addEventListener('openNavigationSidebar', () => {
      this.isNavigationSidebarOpen = true;
    });

    // Monitorar resize da janela
    window.addEventListener('resize', () => {
      this.checkMobileView();
    });
  }

  private checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 968;
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  toggleAccountSidebar(): void {
    // Sempre apenas toggle o sidebar, SEM redirecionar
    this.sidebarService.toggle();
  }

  toggleNavigationSidebar(): void {
    this.isNavigationSidebarOpen = !this.isNavigationSidebarOpen;
  }

  closeNavigationSidebar(): void {
    this.isNavigationSidebarOpen = false;
  }

  navigateToSection(section: string): void {
    this.closeNavigationSidebar();
    if (section === 'home') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/'], { fragment: section });
    }
  }

  private checkFooterVisibility(url: string): void {
    // Ocultar footer nas páginas de autenticação
    const hideFooterRoutes = ['/login', '/registro', '/recuperar-senha'];
    this.showFooter = !hideFooterRoutes.some(route => url.includes(route));
  }

  private checkAccountArea(url: string): void {
    // Verificar se está na área de conta
    this.isInAccountArea = url.startsWith('/conta');
  }

  private checkAdminArea(url: string): void {
    // Verificar se está na área admin
    this.isInAdminArea = url.startsWith('/admin');
  }

  isDoador(): boolean {
    return this.authService.isDoador();
  }

  hasAssinatura(): boolean {
    return this.currentUser?.assinaturaAtiva?.status === 'ativa';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  closeSidebarIfMobile(): void {
    // Fecha o sidebar em mobile após clicar em um link
    if (window.innerWidth < 769) {
      this.sidebarService.close();
    }
  }

  logout(): void {
    if (confirm('Deseja realmente sair?')) {
      this.authService.logout();
      this.sidebarService.close();
      this.router.navigate(['/']);
    }
  }
}
