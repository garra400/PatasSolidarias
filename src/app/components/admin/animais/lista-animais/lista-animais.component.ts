import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalService } from '@services/animal.service';
import { Animal } from '@models/animal.model';

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
        this.animalService.getAllAnimals().subscribe({
            next: (animais: Animal[]) => {
                this.animais = animais;
                this.carregando = false;
            },
            error: (err: any) => {
                console.error('Erro ao carregar animais:', err);
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
        // TODO: Buscar a URL real da foto pelo ID
        return animal.fotoPerfilId ? `assets/images/animais/${animal.fotoPerfilId}.jpg` : 'assets/images/animal-placeholder.png';
    }
}
