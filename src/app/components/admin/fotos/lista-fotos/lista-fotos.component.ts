import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FotoService } from '@services/foto.service';
import { ImageUrlHelper } from '../../../../utils/image-url.helper';

@Component({
    selector: 'app-lista-fotos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './lista-fotos.component.html',
    styleUrls: ['./lista-fotos.component.scss']
})
export class ListaFotosComponent implements OnInit {
    private fotoService = inject(FotoService);
    fotos: any[] = [];
    carregando = true;
    erro = '';
    paginaAtual = 1;
    totalPaginas = 1;

    ngOnInit(): void {
        this.carregarFotos();
    }

    carregarFotos(): void {
        this.carregando = true;
        this.fotoService.listarFotos({
            limit: 20,
            skip: (this.paginaAtual - 1) * 20
        }).subscribe({
            next: (response: any) => {
                this.fotos = response.fotos;
                this.totalPaginas = response.totalPaginas;
                this.carregando = false;
            },
            error: (err: any) => {
                console.error('Erro ao carregar fotos:', err);
                this.erro = 'Erro ao carregar fotos';
                this.carregando = false;
            }
        });
    }

    deletarFoto(id: string): void {
        if (!confirm('Tem certeza que deseja deletar esta foto?')) return;

        this.fotoService.deletarFoto(id).subscribe({
            next: () => {
                alert('Foto deletada com sucesso!');
                this.carregarFotos();
            },
            error: (err: any) => {
                console.error('Erro ao deletar foto:', err);
                alert('Erro ao deletar foto');
            }
        });
    }

    proximaPagina(): void {
        if (this.paginaAtual < this.totalPaginas) {
            this.paginaAtual++;
            this.carregarFotos();
        }
    }

    paginaAnterior(): void {
        if (this.paginaAtual > 1) {
            this.paginaAtual--;
            this.carregarFotos();
        }
    }

    getFotoUrl(foto: any): string {
        return ImageUrlHelper.getFullImageUrl(foto.url);
    }
}
