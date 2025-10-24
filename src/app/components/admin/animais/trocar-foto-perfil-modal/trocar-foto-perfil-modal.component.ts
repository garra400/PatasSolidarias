import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Foto } from '@models/animal.model';
import { FotoService } from '@services/foto.service';
import { AnimalService } from '@services/animal.service';

@Component({
    selector: 'app-trocar-foto-perfil-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trocar-foto-perfil-modal.component.html',
    styleUrls: ['./trocar-foto-perfil-modal.component.scss']
})
export class TrocarFotoPerfilModalComponent implements OnInit {
    @Input() animalId!: string;
    @Input() animalNome: string = '';
    @Input() fotoPerfilAtualId?: string;
    @Output() fechar = new EventEmitter<void>();
    @Output() fotoAlterada = new EventEmitter<Foto>();

    private fotoService = inject(FotoService);
    private animalService = inject(AnimalService);

    fotos: Foto[] = [];
    carregando = true;
    salvando = false;
    erro = '';
    fotoSelecionadaId?: string;

    ngOnInit(): void {
        this.carregarFotos();
    }

    carregarFotos(): void {
        this.carregando = true;
        this.erro = '';

        this.fotoService.listarFotos({ animalId: this.animalId }).subscribe({
            next: (response) => {
                this.fotos = response.fotos;
                this.fotoSelecionadaId = this.fotoPerfilAtualId;
                this.carregando = false;
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
            this.erro = 'Selecione uma foto';
            return;
        }

        if (this.fotoSelecionadaId === this.fotoPerfilAtualId) {
            this.fechar.emit();
            return;
        }

        this.salvando = true;
        this.erro = '';

        this.animalService.atualizarFotoPerfil(this.animalId, this.fotoSelecionadaId).subscribe({
            next: (response) => {
                const fotoSelecionada = this.fotos.find(f => f.id === this.fotoSelecionadaId);
                if (fotoSelecionada) {
                    this.fotoAlterada.emit(fotoSelecionada);
                }
                this.salvando = false;
                this.fechar.emit();
            },
            error: (err) => {
                console.error('Erro ao atualizar foto de perfil:', err);
                this.erro = 'Erro ao atualizar foto de perfil';
                this.salvando = false;
            }
        });
    }

    cancelar(): void {
        this.fechar.emit();
    }

    getFotoUrl(foto: Foto): string {
        return foto.url || '/images/foto-placeholder.svg';
    }
}