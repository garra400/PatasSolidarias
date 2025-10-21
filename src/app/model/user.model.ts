export interface User {
  _id?: string;
  nome: string;
  email: string;
  telefone: string;
  rg: string;
  senha?: string;
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
}

export interface UserRegistration {
  nome: string;
  email: string;
  telefone: string;
  rg: string;
  senha: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface PasswordReset {
  email: string;
  token?: string;
  novaSenha?: string;
}
