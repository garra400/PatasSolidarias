import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResgateService } from '../../../../service/resgate.service';
import { SolicitacaoResgate } from '../../../../model/brinde.model'; interface StatusOption {
    valor: '' | 'pendente' | 'confirmado' | 'retirado' | 'cancelado';
    label: string;
    cor: string;
}

@Component({
    selector: 'app-resgates-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './resgates-list.component.html',
    styleUrl: './resgates-list.component.scss'
})
export class ResgatesListComponent implements OnInit {
    resgates: SolicitacaoResgate[] = [];
    resgatesFiltrados: SolicitacaoResgate[] = [];
    carregando = false;
    erro = '';

    // Filtros
    filtroStatus: '' | 'pendente' | 'confirmado' | 'retirado' | 'cancelado' = '';
    filtroDataInicio = '';
    filtroDataFim = ''; statusOpcoes: StatusOption[] = [
        { valor: '', label: 'Todos os status', cor: '#6c757d' },
        { valor: 'pendente', label: 'Pendente', cor: '#ffc107' },
        { valor: 'confirmado', label: 'Confirmado', cor: '#0dcaf0' },
        { valor: 'retirado', label: 'Retirado', cor: '#198754' },
        { valor: 'cancelado', label: 'Cancelado', cor: '#dc3545' }
    ];

    // Modal de detalhes
    resgateDetalhes: SolicitacaoResgate | null = null;
    mostrarModal = false;

    // Modal de atualização de status
    resgateParaAtualizar: SolicitacaoResgate | null = null;
    novoStatus: 'pendente' | 'confirmado' | 'retirado' | 'cancelado' = 'pendente';
    observacoes = '';
    mostrarModalStatus = false;
    atualizandoStatus = false; constructor(private resgateService: ResgateService) { }

    ngOnInit(): void {
        this.carregarResgates();
    }

    carregarResgates(): void {
        this.carregando = true;
        this.erro = '';

        this.resgateService.listarSolicitacoes().subscribe({
            next: (resposta: { solicitacoes: SolicitacaoResgate[] }) => {
                this.resgates = resposta.solicitacoes;
                this.aplicarFiltros();
                this.carregando = false;
            },
            error: (erro: any) => {
                console.error('Erro ao carregar resgates:', erro);
                this.erro = 'Erro ao carregar solicitações de resgate';
                this.carregando = false;
            }
        });
    } aplicarFiltros(): void {
        this.resgatesFiltrados = this.resgates.filter(resgate => {
            // Filtro de status
            if (this.filtroStatus && resgate.status !== this.filtroStatus) {
                return false;
            }

            // Filtro de data
            if (this.filtroDataInicio || this.filtroDataFim) {
                const dataResgate = new Date(resgate.dataHorarioEscolhido);

                if (this.filtroDataInicio) {
                    const dataInicio = new Date(this.filtroDataInicio);
                    if (dataResgate < dataInicio) return false;
                }

                if (this.filtroDataFim) {
                    const dataFim = new Date(this.filtroDataFim);
                    if (dataResgate > dataFim) return false;
                }
            } return true;
        });
    }

    limparFiltros(): void {
        this.filtroStatus = '';
        this.filtroDataInicio = '';
        this.filtroDataFim = '';
        this.aplicarFiltros();
    }

    getStatusCor(status: string): string {
        const opcao = this.statusOpcoes.find(o => o.valor === status);
        return opcao?.cor || '#6c757d';
    }

    getStatusLabel(status: string): string {
        const opcao = this.statusOpcoes.find(o => o.valor === status);
        return opcao?.label || status;
    }

    formatarData(data: string | Date): string {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatarHorario(data: string | Date): string {
        return new Date(data).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatarDataHora(data: string | Date): string {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } verDetalhes(resgate: SolicitacaoResgate): void {
        this.resgateDetalhes = resgate;
        this.mostrarModal = true;
    }

    fecharModal(): void {
        this.mostrarModal = false;
        this.resgateDetalhes = null;
    }

    abrirModalStatus(resgate: SolicitacaoResgate): void {
        this.resgateParaAtualizar = resgate;
        this.novoStatus = resgate.status;
        this.observacoes = resgate.observacoes || '';
        this.mostrarModalStatus = true;
    }

    fecharModalStatus(): void {
        this.mostrarModalStatus = false;
        this.resgateParaAtualizar = null;
        this.observacoes = '';
        this.atualizandoStatus = false;
    }

    atualizarStatus(): void {
        if (!this.resgateParaAtualizar) return;

        this.atualizandoStatus = true;
        this.erro = '';

        this.resgateService.atualizarStatusSolicitacao(
            this.resgateParaAtualizar.id,
            this.novoStatus,
            this.observacoes || undefined
        ).subscribe({
            next: (resposta: { message: string; solicitacao: SolicitacaoResgate }) => {
                // Atualizar na lista
                const index = this.resgates.findIndex(r => r.id === resposta.solicitacao.id);
                if (index !== -1) {
                    this.resgates[index] = resposta.solicitacao;
                }

                this.aplicarFiltros();
                this.fecharModalStatus();
                this.atualizandoStatus = false;
            },
            error: (erro: any) => {
                console.error('Erro ao atualizar status:', erro);
                this.erro = 'Erro ao atualizar status do resgate';
                this.atualizandoStatus = false;
            }
        });
    } getProximosStatus(statusAtual: string): StatusOption[] {
        const fluxo: { [key: string]: string[] } = {
            'pendente': ['confirmado', 'cancelado'],
            'confirmado': ['retirado', 'cancelado'],
            'retirado': [],
            'cancelado': []
        };

        const proximosValores = fluxo[statusAtual] || [];
        return this.statusOpcoes.filter(s => proximosValores.includes(s.valor as string));
    }

    podeAtualizar(resgate: SolicitacaoResgate): boolean {
        return resgate.status !== 'retirado' && resgate.status !== 'cancelado';
    } get totalResgates(): number {
        return this.resgates.length;
    }

    get resgatesPendentes(): number {
        return this.resgates.filter(r => r.status === 'pendente').length;
    }

    get resgatesConfirmados(): number {
        return this.resgates.filter(r => r.status === 'confirmado').length;
    }

    get resgatesRetirados(): number {
        return this.resgates.filter(r => r.status === 'retirado').length;
    }
}
