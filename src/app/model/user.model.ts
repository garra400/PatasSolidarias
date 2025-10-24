export interface User {
  _id?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha?: string;
  fotoPerfil?: string;
  role: 'user' | 'admin';
  isDoador: boolean;
  emailVerificado: boolean;
  dataCriacao: Date;
  assinaturaAtiva?: {
    tipo: 'mensal' | 'avulso';
    valorMensal?: number;
    dataInicio?: Date;
    dataProximoPagamento?: Date;
    status: 'ativa' | 'cancelada' | 'suspensa';
  };
  historicoPagamentos?: Pagamento[];
  totalMesesApoio?: number; // Total de meses que apoiou (PIX + assinatura)
  brindesDisponiveis?: number; // Quantidade de brindes que tem direito (totalMesesApoio / 3)
}

export interface Pagamento {
  _id?: string;
  userId: string;
  tipo: 'pix' | 'assinatura';
  valor: number;
  status: 'aprovado' | 'pendente' | 'recusado';
  data: Date;
  mercadoPagoId?: string;
  mesReferencia?: string; // Ex: "2025-10" para contabilizar meses
}

export interface UserRegistration {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface PasswordReset {
  email?: string;
  token?: string;
  novaSenha?: string;
}
