import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalService } from '@services/animal.service';
import { BrindeService } from '@services/brinde.service';
import { Animal } from '../../model/animal.model';
import { Brinde } from '../../model/brinde.model';
import { ImageUrlHelper } from '../../utils/image-url.helper';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private animalService = inject(AnimalService);
  private brindeService = inject(BrindeService);

  animals: Animal[] = [];
  brindesDestaque: Brinde[] = [];
  currentAnimalIndex = 0;
  isLoadingAnimals = true;
  isLoadingBrindes = true;
  erroAnimais = '';
  erroBrindes = '';

  ngOnInit(): void {
    console.log('🏠 HomeComponent inicializado');
    this.carregarAnimais();
    this.carregarBrindesDestaque();
  }

  carregarAnimais(): void {
    this.isLoadingAnimals = true;
    this.erroAnimais = '';

    this.animalService.getActiveAnimals().subscribe({
      next: (animais) => {
        this.animals = animais;
        console.log('✅ Animais carregados:', animais.length);
        this.isLoadingAnimals = false;

        if (this.animals.length > 0) {
          this.startCarousel();
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar animais:', err);
        this.erroAnimais = 'Erro ao carregar os animais';
        this.isLoadingAnimals = false;
        // Fallback para dados mock
        this.usarDadosMockAnimais();
      }
    });
  }

  carregarBrindesDestaque(): void {
    this.isLoadingBrindes = true;
    this.erroBrindes = '';

    // Buscar até 4 brindes disponíveis para resgate
    this.brindeService.listarBrindes({ disponiveis: true, limit: 4 }).subscribe({
      next: (response) => {
        this.brindesDestaque = response.brindes || [];
        console.log('✅ Brindes destaque carregados:', this.brindesDestaque.length);
        this.isLoadingBrindes = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar brindes:', err);
        this.erroBrindes = 'Erro ao carregar os brindes';
        this.isLoadingBrindes = false;
        this.brindesDestaque = [];
      }
    });
  }

  usarDadosMockAnimais(): void {
    // Fallback para dados estáticos caso a API falhe
    this.animals = [
      {
        _id: '1',
        nome: 'Tigrão',
        tipo: 'gato',
        descricao: 'Um gatinho lindo e brincalhão que adora correr pelo campus. Tigrão é muito carinhoso e sempre vem pedir carinho dos estudantes!',
        imagemPrincipal: '/assets/images/tigrao.jpg',
        dataCadastro: new Date(),
        ativo: true
      },
      {
        _id: '2',
        nome: 'Pretinha',
        tipo: 'gato',
        descricao: 'Linda gatinha preta de olhos brilhantes. Pretinha é mais tímida, mas quando pega confiança é super carinhosa e adora um cafuné.',
        imagemPrincipal: '/assets/images/pretinha.jpg',
        dataCadastro: new Date(),
        ativo: true
      },
      {
        _id: '3',
        nome: 'Fúria',
        tipo: 'cachorro',
        descricao: 'Não se engane pelo nome! Fúria é um doce de cachorrinha que adora brincar. Ela é super protetora e cuida de todos os outros animais do campus.',
        imagemPrincipal: '/assets/images/furia.jpg',
        dataCadastro: new Date(),
        ativo: true
      },
      {
        _id: '4',
        nome: 'Berenice',
        tipo: 'cachorro',
        descricao: 'Uma cachorrinha linda e elegante. Berenice é calma e adora tirar sonecas ao sol. Ela é a mais tranquila do grupo e adora receber visitantes.',
        imagemPrincipal: '/assets/images/berenice.jpg',
        dataCadastro: new Date(),
        ativo: true
      },
      {
        _id: '5',
        nome: 'Gata',
        tipo: 'gato',
        descricao: 'Uma gatinha curiosa e aventureira. Está sempre explorando cada cantinho do campus e surpreendendo todos com suas travessuras adoráveis.',
        imagemPrincipal: '/assets/images/gata.jpg',
        dataCadastro: new Date(),
        ativo: true
      }
    ];

    if (this.animals.length > 0) {
      this.startCarousel();
    }
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

  getTituloBrindes(): string {
    if (this.brindesDestaque.length === 0) return 'Brindes Exclusivos';

    // Verificar se todos são do mesmo tipo
    const tipos = [...new Set(this.brindesDestaque.map(b => b.nome.toLowerCase()))];

    if (tipos.length === 1) {
      const tipo = tipos[0];
      if (tipo.includes('adesivo') || tipo.includes('figurinha')) {
        return 'Confira os adesivos exclusivos dos nossos pets';
      }
      if (tipo.includes('chaveiro')) {
        return 'Confira os chaveiros exclusivos dos nossos pets';
      }
      if (tipo.includes('camiseta') || tipo.includes('camisa')) {
        return 'Confira as camisetas exclusivas dos nossos pets';
      }
    }

    return 'Confira os brindes exclusivos dos nossos pets';
  }

  getImageUrl(brinde: Brinde): string {
    if (brinde.foto) {
      return ImageUrlHelper.getFullImageUrl(brinde.foto);
    }
    return ImageUrlHelper.getFullImageUrl(null);
  }

  getAnimalImageUrl(animal: Animal): string {
    if (animal.fotoPerfil?.url) {
      return ImageUrlHelper.getFullImageUrl(animal.fotoPerfil.url);
    }
    if (animal.fotoUrl) {
      return ImageUrlHelper.getFullImageUrl(animal.fotoUrl);
    }
    if (animal.imagemPrincipal) {
      return ImageUrlHelper.getFullImageUrl(animal.imagemPrincipal);
    }
    return ImageUrlHelper.getFullImageUrl(null);
  }
}
