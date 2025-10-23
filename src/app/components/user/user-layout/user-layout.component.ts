import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SidebarService } from '../../../service/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  currentUser: any = null;
  isSidebarOpen = false; // Sidebar fechada por padrão
  isFirstRender = true; // Flag para desabilitar transição na primeira renderização

  private authService = inject(AuthService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
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

  openAvatarUpload(): void {
    this.avatarInput.nativeElement.click();
  }

  async onAvatarSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:3000/api/user/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da foto');
      }

      const data = await response.json();

      // Atualizar o usuário atual
      if (this.currentUser) {
        this.currentUser.fotoPerfil = data.fotoPerfil;
        // Atualizar no localStorage também
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.fotoPerfil = data.fotoPerfil;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }

      alert('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    }
  }
}
