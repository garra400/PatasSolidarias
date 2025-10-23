import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { AssinanteService } from '@services/assinante.service';
import { ChartComponent } from './chart/chart.component';

interface EstatisticaCard {
    titulo: string;
    valor: number | string;
    icone: string;
    cor: string;
    link?: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ChartComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    permissoes: any = {};
    carregando = true;
    erro = '';

    estatisticas: EstatisticaCard[] = [];

    constructor(
        private adminService: AdminService,
        private assinanteService: AssinanteService
    ) { }

    ngOnInit(): void {
        this.verificarPermissoes();
        this.carregarEstatisticas();
    }

    verificarPermissoes(): void {
        this.adminService.verificarAdmin().subscribe({
            next: (response) => {
                this.permissoes = response.permissoes;
            },
            error: (err) => {
                console.error('Erro ao verificar permissões:', err);
                this.erro = 'Erro ao carregar permissões';
            }
        });
    }

    carregarEstatisticas(): void {
        this.carregando = true;
        this.assinanteService.buscarEstatisticasGerais().subscribe({
            next: (stats) => {
                this.estatisticas = [
                    {
                        titulo: 'Total de Apoiadores',
                        valor: stats.totalApoiadores,
                        icone: '👥',
                        cor: 'primary',
                        link: this.permissoes.visualizarAssinantes ? '/adm/assinantes/lista' : undefined
                    },
                    {
                        titulo: 'Apoiadores Ativos',
                        valor: stats.apoiadoresAtivos,
                        icone: '✅',
                        cor: 'success',
                        link: this.permissoes.visualizarAssinantes ? '/adm/assinantes/lista' : undefined
                    },
                    {
                        titulo: 'Total Arrecadado',
                        valor: this.formatarMoeda(stats.totalArrecadado),
                        icone: '💰',
                        cor: 'warning'
                    },
                    {
                        titulo: 'Média por Apoiador',
                        valor: this.formatarMoeda(stats.valorMedioPorApoiador),
                        icone: '📊',
                        cor: 'info'
                    }
                ];
                this.carregando = false;
            },
            error: (err) => {
                console.error('Erro ao carregar estatísticas:', err);
                this.erro = 'Erro ao carregar estatísticas';
                this.carregando = false;
            }
        });
    }

    formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    get acoesRapidas() {
        const acoes = [];

        if (this.permissoes.gerenciarAnimais) {
            acoes.push({
                titulo: 'Gerenciar Animais',
                descricao: 'Adicionar, editar e visualizar animais',
                icone: '🐾',
                link: '/adm/animais/lista',
                cor: 'primary'
            });
        }

        if (this.permissoes.gerenciarFotos) {
            acoes.push({
                titulo: 'Galeria de Fotos',
                descricao: 'Fazer upload e gerenciar fotos',
                icone: '📸',
                link: '/adm/fotos/lista',
                cor: 'success'
            });
        }

        if (this.permissoes.gerenciarBrindes) {
            acoes.push({
                titulo: 'Brindes',
                descricao: 'Gerenciar brindes e resgates',
                icone: '🎁',
                link: '/adm/brindes/lista',
                cor: 'warning'
            });
        }

        if (this.permissoes.gerenciarPosts) {
            acoes.push({
                titulo: 'Newsletter',
                descricao: 'Criar e enviar posts',
                icone: '📧',
                link: '/adm/posts/lista',
                cor: 'info'
            });
        }

        if (this.permissoes.visualizarAssinantes) {
            acoes.push({
                titulo: 'Apoiadores',
                descricao: 'Visualizar lista de apoiadores',
                icone: '❤️',
                link: '/adm/assinantes/lista',
                cor: 'danger'
            });
        }

        if (this.permissoes.convidarAdmins) {
            acoes.push({
                titulo: 'Administradores',
                descricao: 'Gerenciar admins e convites',
                icone: '👤',
                link: '/adm/admins/lista',
                cor: 'secondary'
            });
        }

        return acoes;
    }
}
