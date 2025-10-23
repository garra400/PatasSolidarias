export interface Brinde {
    id: string;
    nome: string;
    descricao: string;
    foto: string;
    disponivelParaResgate: boolean; // Se está visível/disponível para usuários
    ordem: number; // Ordem de exibição (máximo 4 na home)
    dataCadastro: Date;
    dataUltimaAtualizacao?: Date;
    ativo: boolean;
    quantidadeDisponivel?: number; // Quantidade em estoque (opcional)
}

export interface ConfiguracaoResgate {
    id: string;
    diasSemana: number[]; // 0 = Domingo, 1 = Segunda, etc
    horariosDisponiveis: HorarioResgate[];
    intervaloMinutos: number; // Intervalo entre horários (ex: 30 minutos)
    ativo: boolean;
}

export interface HorarioResgate {
    horaInicio: string; // Formato "HH:mm" ex: "09:00"
    horaFim: string; // Formato "HH:mm" ex: "18:00"
}

export interface SolicitacaoResgate {
    id: string;
    usuarioId: string;
    usuarioNome: string;
    usuarioEmail: string;
    brindeId: string;
    brindeNome: string;
    brindeFoto: string;
    dataHorarioEscolhido: Date;
    dataSolicitacao: Date;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'retirado';
    observacoes?: string;
}
