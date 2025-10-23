export interface ConviteAdmin {
    id: string;
    usuarioId: string;
    usuarioEmail: string;
    usuarioNome: string;
    convidadoPor: string; // ID do admin que enviou
    convidadoPorNome: string;
    dataConvite: Date;
    dataExpiracao: Date;
    token: string; // Token único para confirmação
    status: 'pendente' | 'aceito' | 'expirado' | 'recusado';
    dataAceite?: Date;
}

export interface EstatisticasApoiadores {
    totalApoiadores: number; // Total histórico de apoiadores
    apoiadoresAtivos: number; // Apoiadores com assinaturas ativas
    totalApoiadoresAtivos: number; // Alias para apoiadoresAtivos
    totalApoiadoresInativos: number;
    totalHistorico: number;
    totalArrecadado: number; // Total arrecadado
    valorMedioPorApoiador: number; // Valor médio por apoiador
    novosPorMes: { mes: string; total: number }[];
    novosPorAno: { ano: number; total: number }[];
    apoiadoresPorDia: { data: string; total: number }[];
}

export interface InfoAssinante {
    usuarioId: string;
    nome: string;
    email: string;
    dataInicio: Date;
    status: 'ativa' | 'cancelada' | 'pendente';
    plano: string;
    valorMensal: number;
    proximaCobranca?: Date;
    metodoPagamento: string;
    totalContribuido: number;
    mesesAtivo: number;
}

// Atualização do User model para incluir flag de admin
export interface UserAdmin extends User {
    isAdmin: boolean;
    permissoes?: AdminPermissoes;
    dataConviteAdmin?: Date;
}

export interface AdminPermissoes {
    gerenciarAnimais: boolean;
    gerenciarFotos: boolean;
    gerenciarBrindes: boolean;
    gerenciarPosts: boolean;
    visualizarAssinantes: boolean;
    convidarAdmins: boolean;
    gerenciarConfiguracoes: boolean;
}

// Importar User do model existente
import { User } from './user.model';
