import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FotoService } from '@services/foto.service';
import { AnimalService } from '@services/animal.service';

@Component({
    selector: 'app-upload-fotos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './upload-fotos.component.html',
    styleUrls: ['./upload-fotos.component.scss']
})
export class UploadFotosComponent {
    fotosSelecionadas: File[] = [];
    previews: { url: string; descricao: string; animaisIds: string[] }[] = [];
    animais: any[] = [];
    carregando = false;
    erro = '';
    sucesso = '';
    isDragging = false;

    private fotoService = inject(FotoService);
    private animalService = inject(AnimalService);
    private router = inject(Router);

    constructor() {
        this.carregarAnimais();
    }

    carregarAnimais(): void {
        this.animalService.getAllAnimals().subscribe({
            next: (animais: any) => {
                this.animais = animais;
            },
            error: (err: any) => console.error('Erro ao carregar animais:', err)
        });
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;

        const files = Array.from(input.files);
        this.processFiles(files);
    }

    onAnimalToggle(fotoIndex: number, animalId: string): void {
        const foto = this.previews[fotoIndex];
        const index = foto.animaisIds.indexOf(animalId);

        if (index > -1) {
            foto.animaisIds.splice(index, 1);
        } else {
            foto.animaisIds.push(animalId);
        }
    }

    isAnimalSelecionado(fotoIndex: number, animalId: string): boolean {
        return this.previews[fotoIndex]?.animaisIds.includes(animalId) || false;
    }

    uploadFotos(): void {
        if (this.fotosSelecionadas.length === 0) {
            this.erro = 'Selecione pelo menos uma foto';
            return;
        }

        this.carregando = true;
        this.erro = '';
        this.sucesso = '';

        const batch = {
            fotos: this.fotosSelecionadas.map((file, index) => ({
                file: file,
                descricao: this.previews[index].descricao,
                animaisIds: this.previews[index].animaisIds
            })),
            enviarEmail: false
        };

        this.fotoService.uploadFotos(batch)
            .subscribe({
                next: () => {
                    this.sucesso = 'Fotos enviadas com sucesso!';
                    this.carregando = false;
                    setTimeout(() => this.router.navigate(['/adm/fotos/lista']), 1500);
                },
                error: (err: any) => {
                    console.error('Erro ao enviar fotos:', err);
                    this.erro = 'Erro ao enviar fotos';
                    this.carregando = false;
                }
            });
    }

    removerFoto(index: number): void {
        this.fotosSelecionadas.splice(index, 1);
        this.previews.splice(index, 1);
    }

    // Drag & Drop handlers
    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.processFiles(Array.from(files));
        }
    }

    private processFiles(files: File[]): void {
        // Validar e adicionar apenas imagens
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            this.erro = 'Por favor, selecione apenas arquivos de imagem';
            return;
        }

        if (this.fotosSelecionadas.length + imageFiles.length > 20) {
            this.erro = 'Máximo de 20 fotos permitido';
            return;
        }

        this.fotosSelecionadas.push(...imageFiles);

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previews.push({
                    url: e.target?.result as string,
                    descricao: '',
                    animaisIds: []
                });
            };
            reader.readAsDataURL(file);
        });

        // Limpar erro se existir
        this.erro = '';
    }
}
