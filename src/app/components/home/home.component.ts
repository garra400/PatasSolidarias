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
    this.loadAnimals();
    this.startCarousel();
  }

  loadAnimals(): void {
    this.animalService.getAnimalsForCarousel().subscribe({
      next: (animals) => {
        this.animals = animals;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar animais:', error);
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
}
