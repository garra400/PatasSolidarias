import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SidebarService } from '../../../service/sidebar.service';
import { Subscription } from 'rxjs';
import { TrocarFotoPerfilModalComponent } from '../../shared/trocar-foto-perfil-modal/trocar-foto-perfil-modal.component';
import { ImageUrlHelper } from '../../../utils/image-url.helper';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, TrocarFotoPerfilModalComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  currentUser: any = null;
  isSidebarOpen = false; // Sidebar fechada por padrão
  isFirstRender = true; // Flag para desabilitar transição na primeira renderização
  mostrarModalFoto = false;
  getFullImageUrl = ImageUrlHelper.getFullImageUrl;

  private authService = inject(AuthService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Abrir sidebar automaticamente em desktop (telas grandes)
    if (window.innerWidth >= 769) {
      this.sidebarService.open();
    }

    const userSub = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.subscriptions.push(userSub);

    // Sincronizar com o serviço
    const sidebarSub = this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
    this.subscriptions.push(sidebarSub);

    // Remover a flag de primeira renderização após um pequeno delay
    setTimeout(() => {
      this.isFirstRender = false;
    }, 50);
  }

  ngOnDestroy(): void {
    // Limpar todas as inscrições
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // NÃO fechar a sidebar aqui - deixa ela no estado natural
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

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  abrirModalFoto(): void {
    console.log('🖼️ Abrindo modal de foto no user-layout');
    this.mostrarModalFoto = true;
  }

  fecharModalFoto(): void {
    console.log('❌ Fechando modal de foto no user-layout');
    this.mostrarModalFoto = false;
  }

  onFotoAtualizada(novaFotoUrl: string): void {
    console.log('✅ Foto atualizada:', novaFotoUrl);
    this.fecharModalFoto();
  }
}
