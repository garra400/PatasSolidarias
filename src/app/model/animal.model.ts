export interface Animal {
  _id?: string;
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  descricao: string;
  imagemPrincipal: string;
  idade?: string;
  dataCadastro: Date;
  ativo: boolean;
}

export interface AnimalCarousel {
  animal: Animal;
  legenda: string;
}
