import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/shared/header/header.component';
import { SidebarService } from './service/sidebar.service';
import { AuthService } from './service/auth.service';
import { User } from './model/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('PataSolidarias');
  protected readonly currentYear = new Date().getFullYear();
  protected showFooter = true;
  protected isSidebarOpen = false;
  protected isInAccountArea = false;
  protected currentUser: User | null = null;
  protected isNavigationSidebarOpen = false;

  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);

  ngOnInit() {
    // Verificar URL inicial
    this.checkFooterVisibility(this.router.url);
    this.checkAccountArea(this.router.url);

    // Monitorar mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkFooterVisibility(event.url);
      this.checkAccountArea(event.url);
    });

    // Monitorar estado da sidebar
    this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    // Monitorar usuário logado
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // Escutar evento customizado para abrir sidebar de navegação
    window.addEventListener('openNavigationSidebar', () => {
      this.isNavigationSidebarOpen = true;
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  navigateToAccount(): void {
    this.router.navigate(['/conta']);
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
}
