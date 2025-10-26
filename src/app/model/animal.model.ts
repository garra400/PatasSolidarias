export interface Animal {
  _id?: string;
  id?: string; // Alias para compatibilidade
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  idade?: number; // Idade em anos
  descricao: string;
  fotoUrl?: string; // URL direta da foto de perfil
  fotoPerfilId?: string; // ID da foto que é o perfil
  fotoPerfil?: Foto; // Objeto completo da foto de perfil
  imagemPrincipal?: string; // Manter por compatibilidade (será substituído por fotoPerfil)
  dataCriacao?: Date;
  dataCadastro?: Date;
  ativo?: boolean;
  status?: string; // 'disponivel' | 'adotado' | 'em tratamento'
  fotos?: Foto[]; // Todas as fotos associadas ao animal
}

export interface AnimalCarousel {
  animal: Animal;
  legenda: string;
}

export interface Foto {
  id: string;
  _id?: string; // Para compatibilidade com MongoDB
  url: string;
  descricao?: string;
  animaisIds: string[]; // Array porque uma foto pode ter múltiplos animais
  animais?: Animal[]; // Objetos completos dos animais
  mesReferencia: string; // Formato "YYYY-MM" - Mês em que a foto foi adicionada à galeria
  dataCadastro: Date;
  criadaEm?: Date; // Alias para dataCadastro
  adicionadaPor: string; // ID do admin
  emailEnviado: boolean; // Se já foi incluída em email de notificação
}

export interface FotoUploadBatch {
  fotos: {
    file: File;
    descricao: string;
    animaisIds: string[];
  }[];
  enviarEmail: boolean; // Se deve enviar email após upload de todas
}

