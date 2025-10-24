import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '@services/admin.service';
import { ConviteAdmin, AdminPermissoes } from '../../../../model/admin.model';

@Component({
    selector: 'app-lista-convites',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './lista-convites.component.html',
    styleUrl: './lista-convites.component.scss'
})
export class ListaConvitesComponent implements OnInit {
    private adminService = inject(AdminService);

    convites: any[] = [];  // Usando any pois o backend pode retornar propriedades diferentes da interface
    convitesFiltrados: any[] = [];
    novoEmail = '';
    carregando = true;
    enviando = false;
    erro = '';
    sucesso = '';
    filtroStatus: 'todos' | 'pendente' | 'aceito' | 'expirado' | 'cancelado' = 'todos';

    // Modal de permissões
    mostrarModalPermissoes = false;
    permissoes: AdminPermissoes = {
        gerenciarAnimais: true,
        gerenciarFotos: true,
        gerenciarBrindes: true,
        gerenciarPosts: true,
        visualizarAssinantes: true,
        convidarAdmins: false,
        gerenciarConfiguracoes: false
    };

    // Estatísticas
    stats = {
        total: 0,
        pendentes: 0,
        aceitos: 0,
        expirados: 0
    };

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.carregando = true;
        this.erro = '';

        this.adminService.listarConvites().subscribe({
            next: (response: any) => {
                this.convites = response.convites || response || [];
                this.aplicarFiltro();
                this.calcularEstatisticas();
                this.carregando = false;
            },
            error: (err) => {
                this.erro = 'Erro ao carregar convites';
                this.carregando = false;
                console.error('Erro ao carregar convites:', err);
            }
        });
    }

    aplicarFiltro(): void {
        if (this.filtroStatus === 'todos') {
            this.convitesFiltrados = [...this.convites];
        } else {
            this.convitesFiltrados = this.convites.filter(c => c.status === this.filtroStatus);
        }
    }

    alterarFiltro(status: 'todos' | 'pendente' | 'aceito' | 'expirado' | 'cancelado'): void {
        this.filtroStatus = status;
        this.aplicarFiltro();
    }

    calcularEstatisticas(): void {
        this.stats.total = this.convites.length;
        this.stats.pendentes = this.convites.filter(c => c.status === 'pendente').length;
        this.stats.aceitos = this.convites.filter(c => c.status === 'aceito').length;
        this.stats.expirados = this.convites.filter(c => c.status === 'expirado').length;
    }

    abrirModalPermissoes(): void {
        this.mostrarModalPermissoes = true;
    }

    fecharModalPermissoes(): void {
        this.mostrarModalPermissoes = false;
    }

    enviarConvite(): void {
        if (!this.novoEmail || !this.validarEmail(this.novoEmail)) {
            this.erro = 'Por favor, insira um email válido';
            return;
        }

        this.enviando = true;
        this.erro = '';
        this.sucesso = '';

        this.adminService.criarConvite(this.novoEmail, this.permissoes).subscribe({
            next: (response) => {
                this.sucesso = 'Convite enviado com sucesso! Um email foi enviado para ' + this.novoEmail;
                this.novoEmail = '';
                this.fecharModalPermissoes();
                this.carregar();
                this.enviando = false;

                // Limpar mensagem de sucesso após 5 segundos
                setTimeout(() => this.sucesso = '', 5000);
            },
            error: (err) => {
                this.erro = err.error?.message || 'Erro ao enviar convite';
                this.enviando = false;
                console.error('Erro ao enviar convite:', err);
            }
        });
    }

    validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    cancelarConvite(id: string): void {
        if (!confirm('Tem certeza que deseja cancelar este convite?')) {
            return;
        }

        this.adminService.cancelarConvite(id).subscribe({
            next: () => {
                this.sucesso = 'Convite cancelado com sucesso';
                this.carregar();
                setTimeout(() => this.sucesso = '', 3000);
            },
            error: (err) => {
                this.erro = 'Erro ao cancelar convite';
                console.error('Erro ao cancelar convite:', err);
            }
        });
    }

    reenviarConvite(convite: any): void {
        if (!confirm('Deseja reenviar o convite para ' + convite.emailConvidado + '?')) {
            return;
        }

        // Primeiro cancela o convite antigo
        this.adminService.cancelarConvite(convite._id || convite.id).subscribe({
            next: () => {
                // Depois cria um novo
                this.adminService.criarConvite(convite.emailConvidado, convite.permissoes).subscribe({
                    next: () => {
                        this.sucesso = 'Convite reenviado com sucesso!';
                        this.carregar();
                        setTimeout(() => this.sucesso = '', 3000);
                    },
                    error: () => {
                        this.erro = 'Erro ao reenviar convite';
                    }
                });
            },
            error: () => {
                this.erro = 'Erro ao processar reenvio';
            }
        });
    }

    copiarLink(convite: ConviteAdmin): void {
        const link = `${window.location.origin}/admin/convite/aceitar/${convite.token}`;
        navigator.clipboard.writeText(link).then(() => {
            this.sucesso = 'Link copiado para a área de transferência!';
            setTimeout(() => this.sucesso = '', 3000);
        }).catch(() => {
            this.erro = 'Erro ao copiar link';
        });
    }

    formatarData(data: Date): string {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            'pendente': 'status-pendente',
            'aceito': 'status-aceito',
            'expirado': 'status-expirado',
            'cancelado': 'status-cancelado'
        };
        return classes[status] || '';
    }

    getStatusIcon(status: string): string {
        const icons: { [key: string]: string } = {
            'pendente': '⏳',
            'aceito': '✅',
            'expirado': '⏰',
            'cancelado': '❌'
        };
        return icons[status] || '📧';
    }

    contarPermissoes(permissoes: AdminPermissoes): number {
        return Object.values(permissoes).filter(v => v === true).length;
    }
}
