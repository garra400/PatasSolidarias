import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PostService } from '@services/post.service';
import { FotoService } from '@services/foto.service';
import { BrindeService } from '@services/brinde.service';
import { switchMap } from 'rxjs/operators';

interface ImagemBiblioteca {
    id: string;
    url: string;
    tipo: 'animal' | 'brinde';
    nome: string;
    descricao?: string;
}

@Component({
    selector: 'app-editor-post',
    standalone: true,
    imports: [CommonModule, FormsModule, QuillModule],
    templateUrl: './editor-post.component.html',
    styleUrl: './editor-post.component.scss'
})
export class EditorPostComponent implements OnInit {
    postId: string | null = null;
    titulo = '';
    conteudo = '';
    destinatarios: 'todos' | 'apoiadores' = 'apoiadores';

    salvando = false;
    enviando = false;
    carregandoImagens = false;
    erro = '';
    sucesso = '';

    // Biblioteca de imagens
    mostrarBiblioteca = false;
    imagensBiblioteca: ImagemBiblioteca[] = [];
    tipoImagemFiltro: 'todos' | 'animal' | 'brinde' = 'todos';

    // Configuração do Quill
    quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ]
    };

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private postService = inject(PostService);
    private fotoService = inject(FotoService);
    private brindeService = inject(BrindeService);

    ngOnInit(): void {
        this.postId = this.route.snapshot.paramMap.get('id');

        if (this.postId) {
            this.carregarPost();
        }
    }

    carregarPost(): void {
        if (!this.postId) return;

        this.postService.buscarPostPorId(this.postId).subscribe({
            next: (post: any) => {
                this.titulo = post.titulo;
                this.conteudo = post.conteudoHtml || post.conteudo || '';
                this.destinatarios = post.destinatarios || 'apoiadores';
            },
            error: (erro: any) => {
                console.error('Erro ao carregar post:', erro);
                this.erro = 'Erro ao carregar newsletter';
            }
        });
    }

    abrirBiblioteca(): void {
        this.mostrarBiblioteca = true;
        if (this.imagensBiblioteca.length === 0) {
            this.carregarImagens();
        }
    }

    fecharBiblioteca(): void {
        this.mostrarBiblioteca = false;
    }

    carregarImagens(): void {
        this.carregandoImagens = true;
        this.imagensBiblioteca = [];

        // Carregar fotos de animais
        this.fotoService.listarFotos({ status: 'publicada' }).subscribe({
            next: (resposta: any) => {
                const fotos = resposta.fotos || resposta;
                const imagensAnimais: ImagemBiblioteca[] = fotos
                    .map((foto: any) => ({
                        id: foto._id || foto.id,
                        url: foto.url,
                        tipo: 'animal' as const,
                        nome: foto.animais?.[0]?.nome || 'Animal',
                        descricao: foto.descricao
                    }));
                this.imagensBiblioteca = [...this.imagensBiblioteca, ...imagensAnimais];
                this.carregandoImagens = false;
            },
            error: (erro: any) => {
                console.error('Erro ao carregar fotos:', erro);
                this.carregandoImagens = false;
            }
        });

        // Carregar imagens de brindes
        this.brindeService.listarBrindes().subscribe({
            next: (resposta: any) => {
                const brindes = resposta.brindes || resposta;
                const imagensBrindes: ImagemBiblioteca[] = brindes
                    .filter((b: any) => b.foto)
                    .map((brinde: any) => ({
                        id: brinde._id || brinde.id,
                        url: brinde.foto,
                        tipo: 'brinde' as const,
                        nome: brinde.nome,
                        descricao: brinde.descricao
                    }));
                this.imagensBiblioteca = [...this.imagensBiblioteca, ...imagensBrindes];
            },
            error: (erro: any) => {
                console.error('Erro ao carregar brindes:', erro);
            }
        });
    }

    get imagensFiltradas(): ImagemBiblioteca[] {
        if (this.tipoImagemFiltro === 'todos') {
            return this.imagensBiblioteca;
        }
        return this.imagensBiblioteca.filter(img => img.tipo === this.tipoImagemFiltro);
    }

    inserirImagem(imagem: ImagemBiblioteca): void {
        // Inserir imagem no editor Quill
        const imgHtml = `<p><img src="${imagem.url}" alt="${imagem.nome}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;"></p>`;
        this.conteudo += imgHtml;
        this.fecharBiblioteca();
    }

    salvarRascunho(): void {
        if (!this.validarFormulario()) return;

        this.salvando = true;
        this.erro = '';
        this.sucesso = '';

        const dados = {
            titulo: this.titulo,
            conteudoHtml: this.conteudo,
            destinatarios: this.destinatarios
        };

        const request = this.postId
            ? this.postService.atualizarPost(this.postId, dados)
            : this.postService.criarPost(dados);

        request.subscribe({
            next: (response: any) => {
                this.salvando = false;
                this.sucesso = 'Rascunho salvo com sucesso!';

                if (!this.postId && response._id) {
                    this.postId = response._id;
                    this.router.navigate(['/adm/posts/editar', this.postId], { replaceUrl: true });
                }

                setTimeout(() => {
                    this.sucesso = '';
                }, 3000);
            },
            error: (erro: any) => {
                console.error('Erro ao salvar rascunho:', erro);
                this.erro = 'Erro ao salvar rascunho';
                this.salvando = false;
            }
        });
    }

    enviarNewsletter(): void {
        if (!this.validarFormulario()) return;

        const confirmar = confirm(
            `Deseja enviar esta newsletter para ${this.destinatarios === 'todos' ? 'TODOS os usuários' : 'apenas os APOIADORES'}?\n\n` +
            `Esta ação não pode ser desfeita e enviará emails imediatamente.`
        );

        if (!confirmar) return;

        this.enviando = true;
        this.erro = '';
        this.sucesso = '';

        const dados = {
            titulo: this.titulo,
            conteudoHtml: this.conteudo,
            destinatarios: this.destinatarios
        };

        // Salvar e enviar
        const salvar = this.postId
            ? this.postService.atualizarPost(this.postId, dados)
            : this.postService.criarPost(dados);

        salvar.pipe(
            switchMap((response: any) => {
                const id = this.postId || response._id;
                return this.postService.enviarPost(id);
            })
        ).subscribe({
            next: (response: any) => {
                this.enviando = false;
                this.sucesso = `Newsletter enviada com sucesso!`;

                setTimeout(() => {
                    this.router.navigate(['/adm/posts']);
                }, 2000);
            },
            error: (erro: any) => {
                console.error('Erro ao enviar newsletter:', erro);
                this.erro = erro.error?.message || 'Erro ao enviar newsletter';
                this.enviando = false;
            }
        });
    }

    validarFormulario(): boolean {
        if (!this.titulo.trim()) {
            this.erro = 'O título é obrigatório';
            return false;
        }

        if (!this.conteudo.trim() || this.conteudo.trim() === '<p><br></p>') {
            this.erro = 'O conteúdo é obrigatório';
            return false;
        }

        return true;
    }

    cancelar(): void {
        if (confirm('Deseja realmente cancelar? Alterações não salvas serão perdidas.')) {
            this.router.navigate(['/adm/posts']);
        }
    }

    get totalDestinatarios(): string {
        return this.destinatarios === 'todos' ? 'todos os usuários' : 'apenas apoiadores';
    }
}
