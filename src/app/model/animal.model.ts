export interface Animal {
  _id?: string;
  id?: string; // Alias para compatibilidade
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  idade?: number; // Idade em anos
  descricao: string;
  fotoPerfilId?: string; // ID da foto que é o perfil
  fotoPerfil?: Foto; // Objeto completo da foto de perfil
  imagemPrincipal?: string; // Manter por compatibilidade (será substituído por fotoPerfil)
  dataCriacao?: Date;
  dataCadastro?: Date;
  ativo?: boolean;
  fotos?: Foto[]; // Todas as fotos associadas ao animal
}

export interface AnimalCarousel {
  animal: Animal;
  legenda: string;
}

export interface Foto {
  id: string;
  url: string;
  descricao?: string;
  animaisIds: string[]; // Array porque uma foto pode ter múltiplos animais
  animais?: Animal[]; // Objetos completos dos animais
  dataCadastro: Date;
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

