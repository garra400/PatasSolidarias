import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
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
    imports: [CommonModule, RouterLink, ChartComponent, ReactiveFormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    permissoes: any = {};
    carregando = true;
    erro = '';

    estatisticas: EstatisticaCard[] = [];
    filtrosForm!: FormGroup;

    // Dados para os gráficos
    chartLabels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    chartData: number[] = [45, 52, 61, 75, 88, 95];
    chartColors: string[] = ['#667eea', '#764ba2', '#48bb78', '#ed8936', '#4299e1', '#f56565'];

    doughnutLabels: string[] = ['Apoiadores Ativos', 'Novos', 'Inativos'];
    doughnutData: number[] = [65, 25, 10];
    doughnutColors: string[] = ['#48bb78', '#667eea', '#ed8936'];

    constructor(
        private adminService: AdminService,
        private authService: AuthService,
        private assinanteService: AssinanteService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.criarFormularioFiltros();
        this.verificarPermissoes();
        // Carregar estatísticas de forma não-bloqueante
        setTimeout(() => this.carregarEstatisticas(), 0);

        // Aplicar filtros quando mudarem
        this.filtrosForm.valueChanges.subscribe(() => {
            this.aplicarFiltros();
        });
    }

    criarFormularioFiltros(): void {
        this.filtrosForm = this.fb.group({
            periodo: ['mes'], // semana, mes, ano, customizado
            plano: ['todos'], // todos, 15, 30, 60
            dataInicio: [''],
            dataFim: ['']
        });
    }

    aplicarFiltros(): void {
        const filtros = this.filtrosForm.value;
        console.log('📊 Aplicando filtros:', filtros);

        // Atualizar labels baseado no período
        switch (filtros.periodo) {
            case 'semana':
                this.chartLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                this.chartData = [12, 18, 15, 22, 20, 25, 19];
                break;
            case 'mes':
                this.chartLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
                this.chartData = [45, 52, 61, 55];
                break;
            case 'ano':
                this.chartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                this.chartData = [45, 52, 61, 75, 88, 95, 102, 110, 118, 125, 130, 135];
                break;
        }

        // Atualizar dados do doughnut baseado no plano
        switch (filtros.plano) {
            case '15':
                this.doughnutLabels = ['Plano R$15'];
                this.doughnutData = [100];
                this.doughnutColors = ['#667eea'];
                break;
            case '30':
                this.doughnutLabels = ['Plano R$30'];
                this.doughnutData = [100];
                this.doughnutColors = ['#48bb78'];
                break;
            case '60':
                this.doughnutLabels = ['Plano R$60'];
                this.doughnutData = [100];
                this.doughnutColors = ['#ed8936'];
                break;
            default:
                this.doughnutLabels = ['R$15', 'R$30', 'R$60'];
                this.doughnutData = [40, 35, 25];
                this.doughnutColors = ['#667eea', '#48bb78', '#ed8936'];
        }

        // Em produção, aqui faria uma chamada ao backend com os filtros
        // this.carregarEstatisticasComFiltros(filtros);
    }

    limparFiltros(): void {
        this.filtrosForm.patchValue({
            periodo: 'mes',
            plano: 'todos',
            dataInicio: '',
            dataFim: ''
        });
    }

    verificarPermissoes(): void {
        // Usar permissões do currentUser se for admin (sincronamente)
        const currentUser = this.authService.currentUserValue;

        if (currentUser && currentUser.role === 'admin') {
            this.permissoes = {
                gerenciarAnimais: true,
                gerenciarFotos: true,
                gerenciarBrindes: true,
                gerenciarPosts: true,
                visualizarAssinantes: true,
                convidarAdmins: true,
                gerenciarConfiguracoes: true
            };
            this.carregando = false;
        } else {
            // Fallback: tentar via backend
            this.carregando = false; // Não bloquear UI
            this.adminService.verificarAdmin().subscribe({
                next: (response) => {
                    this.permissoes = response.permissoes;
                },
                error: () => {
                    this.erro = 'Erro ao carregar permissões';
                }
            });
        }
    }

    carregarEstatisticas(): void {
        this.assinanteService.buscarEstatisticasGerais().subscribe({
            next: (stats) => {
                this.estatisticas = [
                    {
                        titulo: 'Total de Apoiadores',
                        valor: stats.totalApoiadores,
                        icone: '👥',
                        cor: 'primary',
                        link: this.permissoes.visualizarAssinantes ? '/adm/assinantes' : undefined
                    },
                    {
                        titulo: 'Apoiadores Ativos',
                        valor: stats.apoiadoresAtivos,
                        icone: '✅',
                        cor: 'success',
                        link: this.permissoes.visualizarAssinantes ? '/adm/assinantes' : undefined
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
            },
            error: (err) => {
                console.error('Erro ao carregar estatísticas:', err);
                this.erro = 'Erro ao carregar estatísticas';
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
                link: '/adm/animais',
                cor: 'primary'
            });
        }

        if (this.permissoes.gerenciarFotos) {
            acoes.push({
                titulo: 'Galeria de Fotos',
                descricao: 'Fazer upload e gerenciar fotos',
                icone: '📸',
                link: '/adm/fotos',
                cor: 'success'
            });
        }

        if (this.permissoes.gerenciarBrindes) {
            acoes.push({
                titulo: 'Brindes',
                descricao: 'Gerenciar brindes e resgates',
                icone: '🎁',
                link: '/adm/brindes',
                cor: 'warning'
            });
        }

        if (this.permissoes.gerenciarPosts) {
            acoes.push({
                titulo: 'Newsletter',
                descricao: 'Criar e enviar posts',
                icone: '📧',
                link: '/adm/posts',
                cor: 'info'
            });
        }

        if (this.permissoes.visualizarAssinantes) {
            acoes.push({
                titulo: 'Apoiadores',
                descricao: 'Visualizar lista de apoiadores',
                icone: '❤️',
                link: '/adm/assinantes',
                cor: 'danger'
            });
        }

        if (this.permissoes.convidarAdmins) {
            acoes.push({
                titulo: 'Administradores',
                descricao: 'Gerenciar admins e convites',
                icone: '👤',
                link: '/adm/admins',
                cor: 'secondary'
            });
        }

        return acoes;
    }
}
