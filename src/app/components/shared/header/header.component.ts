import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SidebarService } from '../../../service/sidebar.service';
import { AdminSidebarService } from '../../../service/admin-sidebar.service';
import { User } from '../../../model/user.model';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isDoador: boolean = false;
  isAdmin: boolean = false;
  isMenuOpen: boolean = false;
  hasHistoricoPagamentos: boolean = false;
  hasAssinaturaAtiva: boolean = false;
  isSidebarOpen: boolean = false;
  isInAccountArea: boolean = false;
  isInAdminArea: boolean = false;

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService,
    private adminSidebarService: AdminSidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isDoador = user?.isDoador || false;
      this.isAdmin = user?.role === 'admin' || false;

      // Verificar se tem histórico de pagamentos (foi ou é apoiador)
      this.hasHistoricoPagamentos = (user?.historicoPagamentos && user.historicoPagamentos.length > 0) || false;

      // Verificar se tem assinatura ativa
      this.hasAssinaturaAtiva = user?.assinaturaAtiva?.status === 'ativa' || false;

      this.cdr.markForCheck();
    });

    // Observar mudanças no estado da sidebar
    this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
      this.cdr.markForCheck();
    });

    // Observar mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isInAccountArea = event.url.startsWith('/conta');
      this.isInAdminArea = event.url.startsWith('/adm'); // Corrigido de '/admin' para '/adm'
      this.cdr.markForCheck();
    });

    // Verificar rota inicial
    this.isInAccountArea = this.router.url.startsWith('/conta');
    this.isInAdminArea = this.router.url.startsWith('/adm'); // Corrigido de '/admin' para '/adm'
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(sectionId: string) {
    // Primeiro navega para home se não estiver lá
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollToElement(sectionId);
        }, 100);
      });
    } else {
      this.scrollToElement(sectionId);
    }
  }

  private scrollToElement(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Altura do header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.markForCheck();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.cdr.markForCheck();
  }

  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateTo(route: string) {
    this.closeMenu();
    this.router.navigate([route]);
  }

  getUserInitials(): string {
    if (!this.currentUser?.nome) return 'U';
    const names = this.currentUser.nome.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  toggleSidebar() {
    // Usar o serviço correto baseado na área atual
    if (this.isInAdminArea) {
      this.adminSidebarService.toggle();
    } else {
      this.sidebarService.toggle();
    }
  }

  openNavigationSidebar() {
    // Redireciona para home e abre sidebar de navegação via evento ou serviço
    // Por enquanto, vamos apenas navegar para home
    window.dispatchEvent(new CustomEvent('openNavigationSidebar'));
  }

  goToAccount() {
    this.router.navigate(['/conta']);
  }
}
