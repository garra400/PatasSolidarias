export interface Photo {
  _id?: string;
  urlImagem: string;
  animaisAssociados: string[]; // IDs dos animais
  dataEnvio: Date;
  descricao?: string;
  legenda?: string;
  usuariosReceberam: string[]; // IDs dos usuários que receberam
  mes: number;
  ano: number;
}

export interface UserPhoto {
  photo: Photo;
  dataRecebimento: Date;
  visualizada: boolean;
}
