import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Animal {
  nome: string;
  imagemPrincipal: string;
  descricao: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  animals: Animal[] = [
    {
      nome: 'Tigrão',
      imagemPrincipal: '/assets/images/tigrao.jpg',
      descricao: 'Um gatinho lindo e brincalhão que adora correr pelo campus. Tigrão é muito carinhoso e sempre vem pedir carinho dos estudantes!'
    },
    {
      nome: 'Pretinha',
      imagemPrincipal: '/assets/images/pretinha.jpg',
      descricao: 'Linda gatinha preta de olhos brilhantes. Pretinha é mais tímida, mas quando pega confiança é super carinhosa e adora um cafuné.'
    },
    {
      nome: 'Fúria',
      imagemPrincipal: '/assets/images/furia.jpg',
      descricao: 'Não se engane pelo nome! Fúria é um doce de cachorrinha que adora brincar. Ela é super protetora e cuida de todos os outros animais do campus.'
    },
    {
      nome: 'Berenice',
      imagemPrincipal: '/assets/images/berenice.jpg',
      descricao: 'Uma cachorrinha linda e elegante. Berenice é calma e adora tirar sonecas ao sol. Ela é a mais tranquila do grupo e adora receber visitantes.'
    },
    {
      nome: 'Gata',
      imagemPrincipal: '/assets/images/gata.jpg',
      descricao: 'Uma gatinha curiosa e aventureira. Está sempre explorando cada cantinho do campus e surpreendendo todos com suas travessuras adoráveis.'
    }
  ];
  
  currentAnimalIndex = 0;
  isLoading = false;

  constructor() {}

  ngOnInit(): void {
    console.log('🏠 HomeComponent inicializado com', this.animals.length, 'animais');
    this.startCarousel();
  }

  startCarousel(): void {
    setInterval(() => {
      if (this.animals.length > 0) {
        this.currentAnimalIndex = (this.currentAnimalIndex + 1) % this.animals.length;
      }
    }, 5000);
  }

  get currentAnimal(): Animal | null {
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
    // Fallback para logo do projeto
    img.src = '/assets/images/logo.png';
  }
}
