export interface Reward {
  _id?: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
  mes: number;
  ano: number;
  dataDisponibilidade: Date;
  horariosRetirada: RewardSchedule[];
  quantidadeDisponivel: number;
  ativo: boolean;
}

export interface RewardSchedule {
  data: Date;
  horarioInicio: string;
  horarioFim: string;
  vagasDisponiveis: number;
  vagasOcupadas: number;
}

export interface UserReward {
  _id?: string;
  userId: string;
  rewardId: string;
  reward?: Reward;
  dataElegibilidade: Date; // Data em que se tornou elegível (3 meses)
  resgatado: boolean;
  dataResgate?: Date;
  horarioRetiradaSelecionado?: {
    data: Date;
    horario: string;
  };
}
