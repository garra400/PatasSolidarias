export interface Post {
    id: string;
    titulo: string;
    conteudoHtml: string; // Conteúdo rico com HTML
    imagensAnimais: string[]; // URLs de fotos de animais
    imagensBrindes: string[]; // URLs de fotos de brindes
    destinatarios: 'todos' | 'apoiadores'; // Quem receberá
    dataCriacao: Date;
    dataEnvio?: Date;
    enviadoPor: string; // ID do admin
    status: 'rascunho' | 'enviado';
    totalDestinatarios?: number;
}

export interface TemplatePost {
    id: string;
    nome: string;
    htmlTemplate: string;
    variaveis: string[]; // Variáveis substituíveis no template ex: {{NOME_USUARIO}}
    previewImagem?: string;
}

export interface EmailPost {
    postId: string;
    destinatario: string;
    destinatarioNome: string;
    dataEnvio: Date;
    aberto: boolean;
    dataAbertura?: Date;
}
