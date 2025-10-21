export interface AnimalPhoto {
  _id?: string;
  animalId: string;
  animalNome: string;
  animalEspecie: 'cachorro' | 'gato' | 'outro';
  imagemUrl: string;
  descricao: string;
  mes: string; // formato: "2024-10"
  dataCriacao: Date;
}
