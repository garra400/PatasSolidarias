import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalService } from '@services/animal.service';
import { Animal } from '@models/animal.model';
import { ImageUrlHelper } from '../../../../utils/image-url.helper';

@Component({
    selector: 'app-lista-animais',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './lista-animais.component.html',
    styleUrls: ['./lista-animais.component.scss']
})
export class ListaAnimaisComponent implements OnInit {
    private animalService = inject(AnimalService);
    animais: Animal[] = [];
    carregando = true;
    erro = '';

    ngOnInit(): void {
        this.carregarAnimais();
    }

    carregarAnimais(): void {
        this.carregando = true;
        console.log('🔍 Carregando animais...');
        this.animalService.getAllAnimals().subscribe({
            next: (animais: Animal[]) => {
                console.log('✅ Animais carregados:', animais.length, animais);
                this.animais = animais;
                this.carregando = false;
            },
            error: (err: any) => {
                console.error('❌ Erro ao carregar animais:', err);
                this.erro = 'Erro ao carregar lista de animais';
                this.carregando = false;
            }
        });
    }

    deletarAnimal(id: string): void {
        if (!confirm('Tem certeza que deseja deletar este animal?')) {
            return;
        }

        this.animalService.deleteAnimal(id).subscribe({
            next: () => {
                alert('Animal deletado com sucesso!');
                this.carregarAnimais();
            },
            error: (err: any) => {
                console.error('Erro ao deletar animal:', err);
                alert('Erro ao deletar animal');
            }
        });
    }

    getTipoLabel(tipo: string): string {
        const tipos: any = {
            cachorro: '🐕 Cachorro',
            gato: '🐈 Gato',
            outro: '🐾 Outro'
        };
        return tipos[tipo] || tipo;
    }

    getFotoUrl(animal: Animal): string {
        // Usar a URL da foto de perfil se disponível
        if (animal.fotoPerfil?.url) {
            return ImageUrlHelper.getFullImageUrl(animal.fotoPerfil.url);
        }
        // Fallback para fotoUrl se disponível
        if (animal.fotoUrl) {
            return ImageUrlHelper.getFullImageUrl(animal.fotoUrl);
        }
        // Fallback para imagemPrincipal (compatibilidade)
        if (animal.imagemPrincipal) {
            return ImageUrlHelper.getFullImageUrl(animal.imagemPrincipal);
        }
        // Placeholder se não tiver foto
        return ImageUrlHelper.getFullImageUrl(null);
    }
}
