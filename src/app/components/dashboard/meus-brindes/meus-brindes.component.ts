import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { BrindeService } from '../../../service/brinde.service';
import { ResgateService } from '../../../service/resgate.service';
import { User } from '../../../model/user.model';
import { Brinde, ConfiguracaoResgate } from '../../../model/brinde.model';

interface BrindeDisponivel {
  id: number;
  nome: string;
  descricao: string;
  imagemUrl: string;
  mesReferencia: string;
  status: 'disponivel' | 'resgatado';
}

@Component({
  selector: 'app-meus-brindes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './meus-brindes.component.html',
  styleUrl: './meus-brindes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeusBrindesComponent implements OnInit {
  private authService = inject(AuthService);
  private brindeService = inject(BrindeService);
  private resgateService = inject(ResgateService);
  private cdr = inject(ChangeDetectorRef);

  currentUser: User | null = null;
  totalMesesApoio: number = 0;
  brindesDisponiveis: number = 0;
  brindes: BrindeDisponivel[] = [];

  // Brindes reais do catálogo
  brindesCatalogo: Brinde[] = [];
  isLoadingBrindes: boolean = false;

  // Modal de resgate
  showModalResgate: boolean = false;
  brindeSelecionado: Brinde | null = null;
  configuracaoResgate: ConfiguracaoResgate | null = null;
  datasDisponiveis: Date[] = [];
  horariosDisponiveis: Date[] = [];
  dataSelecionada: Date | null = null;
  horarioSelecionado: Date | null = null;
  observacoes: string = '';
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Brindes do mês atual (mock - virá do backend)
  brindesDoMes: BrindeDisponivel[] = [
    {
      id: 1,
      nome: 'Adesivo Exclusivo - Outubro',
      descricao: 'Adesivo especial com a arte dos nossos pets',
      imagemUrl: 'https://via.placeholder.com/150/7c3aed/ffffff?text=Adesivo+Out',
      mesReferencia: '2025-10',
      status: 'disponivel'
    }
  ];

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.calcularBrindes(user);
        this.carregarBrindesCatalogo();
        this.carregarConfiguracaoResgate();
      }
      this.cdr.markForCheck();
    });
  }

  private calcularBrindes(user: User): void {
    // Calcular total de meses de apoio
    this.totalMesesApoio = user.totalMesesApoio || 0;

    // Calcular quantos brindes tem direito (1 brinde a cada 3 meses)
    this.brindesDisponiveis = Math.floor(this.totalMesesApoio / 3);

    // Gerar lista de brindes disponíveis (mock - virá do backend)
    this.brindes = [];
    for (let i = 0; i < this.brindesDisponiveis; i++) {
      this.brindes.push({
        id: i + 1,
        nome: `Brinde ${i + 1}`,
        descricao: 'Brinde especial por 3 meses de apoio',
        imagemUrl: `https://via.placeholder.com/150/7c3aed/ffffff?text=Brinde+${i + 1}`,
        mesReferencia: '',
        status: 'disponivel'
      });
    }
  }

  private carregarBrindesCatalogo(): void {
    this.isLoadingBrindes = true;
    this.brindeService.listarBrindes({ disponiveis: true }).subscribe({
      next: (response) => {
        this.brindesCatalogo = response.brindes;
        this.isLoadingBrindes = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao carregar brindes:', error);
        this.isLoadingBrindes = false;
        this.cdr.markForCheck();
      }
    });
  }

  private carregarConfiguracaoResgate(): void {
    this.resgateService.buscarConfiguracao().subscribe({
      next: (config) => {
        this.configuracaoResgate = config;
        if (config.ativo) {
          this.gerarDatasDisponiveis();
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao carregar configuração de resgate:', error);
        this.cdr.markForCheck();
      }
    });
  }

  private gerarDatasDisponiveis(): void {
    if (!this.configuracaoResgate) return;

    this.datasDisponiveis = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Gerar próximos 30 dias
    for (let i = 1; i <= 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);

      const diaSemana = data.getDay();
      if (this.configuracaoResgate.diasSemana.includes(diaSemana)) {
        this.datasDisponiveis.push(data);
      }
    }
  }

  abrirModalResgate(brinde: Brinde): void {
    if (!this.configuracaoResgate || !this.configuracaoResgate.ativo) {
      this.errorMessage = 'Sistema de resgates temporariamente indisponível. Entre em contato conosco.';
      setTimeout(() => this.errorMessage = '', 5000);
      this.cdr.markForCheck();
      return;
    }

    this.brindeSelecionado = brinde;
    this.showModalResgate = true;
    this.dataSelecionada = null;
    this.horarioSelecionado = null;
    this.horariosDisponiveis = [];
    this.observacoes = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  fecharModalResgate(): void {
    this.showModalResgate = false;
    this.brindeSelecionado = null;
    this.dataSelecionada = null;
    this.horarioSelecionado = null;
    this.horariosDisponiveis = [];
    this.observacoes = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  onDataChange(event: any): void {
    const dataStr = event.target.value;
    if (!dataStr || !this.configuracaoResgate) return;

    this.dataSelecionada = new Date(dataStr + 'T00:00:00');
    this.horarioSelecionado = null;

    // Gerar horários disponíveis para a data selecionada
    this.horariosDisponiveis = this.resgateService.gerarHorariosDisponiveis(
      this.configuracaoResgate,
      this.dataSelecionada
    );

    this.cdr.markForCheck();
  }

  solicitarResgate(): void {
    if (!this.brindeSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      setTimeout(() => this.errorMessage = '', 5000);
      this.cdr.markForCheck();
      return;
    }

    // Verificar se o brinde tem ID
    const brindeId = this.brindeSelecionado._id || this.brindeSelecionado.id;
    if (!brindeId) {
      this.errorMessage = 'Erro: ID do brinde não encontrado.';
      setTimeout(() => this.errorMessage = '', 5000);
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.resgateService.criarSolicitacao({
      brindeId: brindeId,
      dataHorarioEscolhido: this.horarioSelecionado,
      observacoes: this.observacoes
    }).subscribe({
      next: (response) => {
        this.successMessage = 'Solicitação enviada com sucesso! Você receberá um email de confirmação em breve.';
        this.isSubmitting = false;
        this.cdr.markForCheck();

        // Fechar modal após 3 segundos
        setTimeout(() => {
          this.fecharModalResgate();
        }, 3000);
      },
      error: (error) => {
        console.error('Erro ao solicitar resgate:', error);
        this.errorMessage = error.error?.message || 'Erro ao processar solicitação. Tente novamente.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  }

  formatarHorario(data: Date): string {
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDataInputValue(data: Date): string {
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getMinDate(): string {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return this.getDataInputValue(amanha);
  }

  getMaxDate(): string {
    const maxData = new Date();
    maxData.setDate(maxData.getDate() + 30);
    return this.getDataInputValue(maxData);
  }
}
