import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SidebarService } from '../../../service/sidebar.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent implements OnInit {
  currentUser: any = null;
  isSidebarOpen = true; // Sidebar aberta por padrão

  private authService = inject(AuthService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // Sincronizar com o serviço
    this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
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

  isDoador(): boolean {
    return this.authService.isDoador();
  }

  hasAssinatura(): boolean {
    return this.currentUser?.assinaturaAtiva?.status === 'ativa';
  }

  isDoadorPix(): boolean {
    // É doador mas NÃO tem assinatura ativa (doou apenas via PIX)
    return this.isDoador() && !this.hasAssinatura();
  }
}
