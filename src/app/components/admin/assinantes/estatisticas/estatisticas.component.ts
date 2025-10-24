import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssinanteService } from '@services/assinante.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

interface EstatisticasGerais {
    totalApoiadores: number;
    apoiadoresAtivos: number;
    totalArrecadado: number;
    valorMedioPorApoiador: number;
    evolucaoMensal: { mes: string; total: number; novos: number; cancelados: number }[];
    apoiadoresPorDia: { dia: string; quantidade: number }[];
    tempoMedioApoio: number;
    taxaRetencao: number;
    valorMedioMensal: number;
}

@Component({
    selector: 'app-estatisticas',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './estatisticas.component.html',
    styleUrl: './estatisticas.component.scss'
})
export class EstatisticasComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    private assinanteService = inject(AssinanteService);

    stats: EstatisticasGerais = {
        totalApoiadores: 0,
        apoiadoresAtivos: 0,
        totalArrecadado: 0,
        valorMedioPorApoiador: 0,
        evolucaoMensal: [],
        apoiadoresPorDia: [],
        tempoMedioApoio: 0,
        taxaRetencao: 0,
        valorMedioMensal: 0
    };

    carregando = true;
    erro = '';

    // Gráfico de Evolução Mensal
    evolucaoMensalChartData: ChartData<'line'> = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Total de Apoiadores',
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                data: [],
                label: 'Novos Apoiadores',
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                data: [],
                label: 'Cancelamentos',
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    evolucaoMensalChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    evolucaoMensalChartType: ChartType = 'line';

    // Gráfico de Apoiadores por Dia da Semana
    apoiadoresPorDiaChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Apoiadores',
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    '#667eea',
                    '#764ba2',
                    '#10b981',
                    '#3b82f6',
                    '#fb923c',
                    '#ec4899',
                    '#8b5cf6'
                ],
                borderWidth: 2
            }
        ]
    };

    apoiadoresPorDiaChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.parsed.y} apoiadores`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    apoiadoresPorDiaChartType: ChartType = 'bar';

    ngOnInit(): void {
        this.carregarEstatisticas();
    }

    carregarEstatisticas(): void {
        this.carregando = true;
        this.erro = '';

        this.assinanteService.buscarEstatisticasGerais().subscribe({
            next: (data: any) => {
                this.stats = data;
                this.processarDadosGraficos();
                this.carregando = false;
            },
            error: (erro: any) => {
                console.error('Erro ao carregar estatísticas:', erro);
                this.erro = 'Erro ao carregar estatísticas';
                this.carregando = false;
                // Dados de exemplo para desenvolvimento
                this.carregarDadosExemplo();
            }
        });
    }

    processarDadosGraficos(): void {
        // Processar evolução mensal
        if (this.stats.evolucaoMensal && this.stats.evolucaoMensal.length > 0) {
            this.evolucaoMensalChartData.labels = this.stats.evolucaoMensal.map(e => e.mes);
            this.evolucaoMensalChartData.datasets[0].data = this.stats.evolucaoMensal.map(e => e.total);
            this.evolucaoMensalChartData.datasets[1].data = this.stats.evolucaoMensal.map(e => e.novos);
            this.evolucaoMensalChartData.datasets[2].data = this.stats.evolucaoMensal.map(e => e.cancelados);
        }

        // Processar apoiadores por dia
        if (this.stats.apoiadoresPorDia && this.stats.apoiadoresPorDia.length > 0) {
            this.apoiadoresPorDiaChartData.labels = this.stats.apoiadoresPorDia.map(a => a.dia);
            this.apoiadoresPorDiaChartData.datasets[0].data = this.stats.apoiadoresPorDia.map(a => a.quantidade);
        }

        this.chart?.update();
    }

    carregarDadosExemplo(): void {
        // Dados de exemplo para desenvolvimento
        this.stats = {
            totalApoiadores: 247,
            apoiadoresAtivos: 198,
            totalArrecadado: 24750,
            valorMedioPorApoiador: 125,
            valorMedioMensal: 19800,
            tempoMedioApoio: 8.5,
            taxaRetencao: 80.2,
            evolucaoMensal: [
                { mes: 'Jan', total: 180, novos: 25, cancelados: 5 },
                { mes: 'Fev', total: 195, novos: 22, cancelados: 7 },
                { mes: 'Mar', total: 210, novos: 28, cancelados: 13 },
                { mes: 'Abr', total: 225, novos: 20, cancelados: 5 },
                { mes: 'Mai', total: 240, novos: 18, cancelados: 3 },
                { mes: 'Jun', total: 247, novos: 15, cancelados: 8 }
            ],
            apoiadoresPorDia: [
                { dia: 'Dom', quantidade: 28 },
                { dia: 'Seg', quantidade: 42 },
                { dia: 'Ter', quantidade: 38 },
                { dia: 'Qua', quantidade: 35 },
                { dia: 'Qui', quantidade: 40 },
                { dia: 'Sex', quantidade: 37 },
                { dia: 'Sáb', quantidade: 27 }
            ]
        };
        this.processarDadosGraficos();
    }

    formatarMeses(meses: number): string {
        if (meses < 1) return 'menos de 1 mês';
        if (meses === 1) return '1 mês';
        if (meses < 12) return `${Math.floor(meses)} meses`;
        const anos = Math.floor(meses / 12);
        const mesesRestantes = Math.floor(meses % 12);
        if (mesesRestantes === 0) return anos === 1 ? '1 ano' : `${anos} anos`;
        return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
    }
}
