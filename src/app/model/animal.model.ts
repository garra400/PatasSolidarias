export interface Animal {
  _id?: string;
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  descricao: string;
  dataCriacao?: Date;
  // Campos para mock data (temporário)
  imagemPrincipal?: string;
  idade?: string;
  dataCadastro?: Date;
  ativo?: boolean;
}

export interface AnimalCarousel {
  animal: Animal;
  legenda: string;
}
