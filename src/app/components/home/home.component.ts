import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalService } from '../../service/animal.service';
import { AnimalCarousel } from '../../model/animal.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  animals: AnimalCarousel[] = [];
  currentAnimalIndex = 0;
  isLoading = true;

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    console.log('🏠 HomeComponent inicializado');
    this.loadAnimals();
    this.startCarousel();
  }

  loadAnimals(): void {
    console.log('🐾 Iniciando carregamento de animais...');
    
    // Timeout de segurança - se não carregar em 5 segundos, desativa o loading
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout alcançado - desativando loading');
      this.isLoading = false;
    }, 5000);
    
    this.animalService.getAnimalsForCarousel().subscribe({
      next: (animals) => {
        clearTimeout(timeout);
        console.log('✅ Animais carregados:', animals);
        console.log('🖼️  Primeira imagem:', animals[0]?.animal?.imagemPrincipal);
        this.animals = animals;
        this.isLoading = false;
      },
      error: (error: any) => {
        clearTimeout(timeout);
        console.error('❌ Erro ao carregar animais:', error);
        this.isLoading = false;
      }
    });
  }

  startCarousel(): void {
    setInterval(() => {
      if (this.animals.length > 0) {
        this.currentAnimalIndex = (this.currentAnimalIndex + 1) % this.animals.length;
      }
    }, 5000);
  }

  get currentAnimal(): AnimalCarousel | null {
    return this.animals[this.currentAnimalIndex] || null;
  }

  nextAnimal(): void {
    this.currentAnimalIndex = (this.currentAnimalIndex + 1) % this.animals.length;
  }

  previousAnimal(): void {
    this.currentAnimalIndex = (this.currentAnimalIndex - 1 + this.animals.length) % this.animals.length;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('❌ Erro ao carregar imagem:', img.src);
    // Fallback para imagem placeholder do Unsplash
    img.src = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80';
  }
}
