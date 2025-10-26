import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';
import { ImageUrlHelper } from '../../../utils/image-url.helper';

@Component({
    selector: 'app-trocar-foto-perfil-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trocar-foto-perfil-modal.component.html',
    styleUrls: ['./trocar-foto-perfil-modal.component.scss']
})
export class TrocarFotoPerfilModalComponent {
    @Input() mostrar = false;
    @Output() fechar = new EventEmitter<void>();
    @Output() fotoAtualizada = new EventEmitter<string>();

    private authService = inject(AuthService);
    private userService = inject(UserService);

    preview: string | null = null;
    arquivoSelecionado: File | null = null;
    carregando = false;
    erro = '';
    sucesso = '';

    getFullImageUrl = ImageUrlHelper.getFullImageUrl;

    onFileChange(event: any): void {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            this.erro = 'Por favor, selecione uma imagem válida';
            return;
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.erro = 'A imagem deve ter no máximo 5MB';
            return;
        }

        this.erro = '';
        this.arquivoSelecionado = file;

        // Preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.preview = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    salvar(): void {
        if (!this.arquivoSelecionado) {
            this.erro = 'Selecione uma foto';
            return;
        }

        this.carregando = true;
        this.erro = '';

        this.userService.atualizarFotoPerfil(this.arquivoSelecionado).subscribe({
            next: (response: any) => {
                this.sucesso = 'Foto atualizada com sucesso!';

                // Atualizar usuário no localStorage e AuthService
                const currentUser = this.authService.currentUserValue;
                if (currentUser && response.fotoPerfilUrl) {
                    currentUser.fotoPerfil = response.fotoPerfilUrl;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    this.authService.updateCurrentUser(currentUser);
                }

                setTimeout(() => {
                    this.fotoAtualizada.emit(response.fotoPerfilUrl);
                    this.fecharModal();
                }, 1500);
            },
            error: (err: any) => {
                console.error('Erro ao atualizar foto:', err);
                this.erro = err.error?.message || 'Erro ao atualizar foto';
                this.carregando = false;
            }
        });
    }

    removerFoto(): void {
        if (!confirm('Tem certeza que deseja remover sua foto de perfil?')) {
            return;
        }

        this.carregando = true;
        this.erro = '';

        this.userService.removerFotoPerfil().subscribe({
            next: () => {
                this.sucesso = 'Foto removida com sucesso!';

                // Atualizar usuário
                const currentUser = this.authService.currentUserValue;
                if (currentUser) {
                    currentUser.fotoPerfil = undefined;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    this.authService.updateCurrentUser(currentUser);
                }

                setTimeout(() => {
                    this.fotoAtualizada.emit('');
                    this.fecharModal();
                }, 1500);
            },
            error: (err: any) => {
                console.error('Erro ao remover foto:', err);
                this.erro = err.error?.message || 'Erro ao remover foto';
                this.carregando = false;
            }
        });
    }

    fecharModal(): void {
        this.preview = null;
        this.arquivoSelecionado = null;
        this.erro = '';
        this.sucesso = '';
        this.carregando = false;
        this.fechar.emit();
    }
}
