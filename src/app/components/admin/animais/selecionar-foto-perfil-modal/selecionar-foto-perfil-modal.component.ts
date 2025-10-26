import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FotoService } from '@services/foto.service';
import { AnimalService } from '@services/animal.service';
import { Foto } from '@models/animal.model';
import { ImageUrlHelper } from '../../../../utils/image-url.helper';

@Component({
    selector: 'app-selecionar-foto-perfil-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './selecionar-foto-perfil-modal.component.html',
    styleUrls: ['./selecionar-foto-perfil-modal.component.scss']
})
export class SelecionarFotoPerfilModalComponent implements OnInit {
    @Input() mostrar = false;
    @Input() animalId!: string;
    @Input() fotoPerfilAtualId?: string;
    @Output() fechar = new EventEmitter<void>();
    @Output() fotoSelecionada = new EventEmitter<Foto>();

    fotos: Foto[] = [];
    carregando = false;
    erro = '';
    sucesso = '';
    salvando = false;

    fotoSelecionadaId?: string;

    protected getFullImageUrl = ImageUrlHelper.getFullImageUrl;

    private fotoService = inject(FotoService);
    private animalService = inject(AnimalService);

    ngOnInit(): void {
        if (this.mostrar && this.animalId) {
            this.carregarFotos();
        }
    }

    ngOnChanges(): void {
        if (this.mostrar && this.animalId) {
            this.carregarFotos();
            this.fotoSelecionadaId = this.fotoPerfilAtualId;
        }
    }

    carregarFotos(): void {
        this.carregando = true;
        this.erro = '';

        this.fotoService.listarFotos({ animalId: this.animalId, limit: 100 }).subscribe({
            next: (response) => {
                this.fotos = response.fotos;
                this.carregando = false;

                if (this.fotos.length === 0) {
                    this.erro = 'Nenhuma foto encontrada para este animal';
                }
            },
            error: (err) => {
                console.error('Erro ao carregar fotos:', err);
                this.erro = 'Erro ao carregar fotos do animal';
                this.carregando = false;
            }
        });
    }

    selecionarFoto(fotoId: string): void {
        this.fotoSelecionadaId = fotoId;
    }

    salvar(): void {
        if (!this.fotoSelecionadaId) {
            this.erro = 'Por favor, selecione uma foto';
            return;
        }

        this.salvando = true;
        this.erro = '';
        this.sucesso = '';

        this.animalService.atualizarFotoPerfil(this.animalId, this.fotoSelecionadaId).subscribe({
            next: (response) => {
                this.sucesso = 'Foto de perfil atualizada com sucesso!';
                this.salvando = false;

                const fotoSelecionada = this.fotos.find(f => f.id === this.fotoSelecionadaId);
                if (fotoSelecionada) {
                    this.fotoSelecionada.emit(fotoSelecionada);
                }

                setTimeout(() => {
                    this.fecharModal();
                }, 1500);
            },
            error: (err) => {
                console.error('Erro ao atualizar foto de perfil:', err);
                this.erro = err.error?.error || 'Erro ao atualizar foto de perfil';
                this.salvando = false;
            }
        });
    }

    fecharModal(): void {
        this.fotoSelecionadaId = undefined;
        this.erro = '';
        this.sucesso = '';
        this.fechar.emit();
    }
}
