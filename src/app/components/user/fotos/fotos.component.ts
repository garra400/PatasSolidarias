import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnimalPhoto } from '../../../model/animal-photo.model';

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fotos.component.html',
  styleUrl: './fotos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FotosComponent implements OnInit {
  filterForm: FormGroup;
  photos: AnimalPhoto[] = [];
  filteredPhotos: AnimalPhoto[] = [];
  selectedPhoto: AnimalPhoto | null = null;
  isLoading = false;

  mesesDisponiveis: string[] = [];
  animaisDisponiveis: string[] = [];

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.filterForm = this.fb.group({
      animal: [''],
      especie: [''],
      mes: ['']
    });
  }

  ngOnInit(): void {
    this.loadPhotos();
    
    // Aplicar filtros quando mudarem
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadPhotos(): void {
    this.isLoading = true;
    
    // Mock data - substituir por chamada à API
    this.photos = [
      {
        _id: '1',
        animalId: '1',
        animalNome: 'Tigrão',
        animalEspecie: 'gato',
        imagemUrl: '/assets/images/charlesdeluvio-K4mSJ7kc0As-unsplash.jpg',
        descricao: 'Tigrão brincando com sua bolinha favorita no jardim durante a manhã ensolarada',
        mes: '2024-10',
        dataCriacao: new Date('2024-10-15')
      },
      {
        _id: '2',
        animalId: '2',
        animalNome: 'Berenice',
        animalEspecie: 'cachorro',
        imagemUrl: '/assets/images/joe-caione-qO-PIF84Vxg-unsplash.jpg',
        descricao: 'Berenice correndo feliz pelo campus após receber carinho dos estudantes',
        mes: '2024-10',
        dataCriacao: new Date('2024-10-10')
      },
      {
        _id: '3',
        animalId: '3',
        animalNome: 'Gata',
        animalEspecie: 'gato',
        imagemUrl: '/assets/images/baptist-standaert-mx0DEnfYxic-unsplash.jpg',
        descricao: 'Gata descansando tranquilamente em seu cantinho preferido debaixo da árvore',
        mes: '2024-09',
        dataCriacao: new Date('2024-09-20')
      },
      {
        _id: '4',
        animalId: '4',
        animalNome: 'Fiapo',
        animalEspecie: 'cachorro',
        imagemUrl: '/assets/images/oscar-sutton-yihlaRCCvd4-unsplash.jpg',
        descricao: 'Fiapo posando para foto após tomar banho e ficar todo cheirosinho',
        mes: '2024-09',
        dataCriacao: new Date('2024-09-15')
      },
      {
        _id: '5',
        animalId: '5',
        animalNome: 'Pretinha',
        animalEspecie: 'cachorro',
        imagemUrl: '/assets/images/victor-g-N04FIfHhv_k-unsplash.jpg',
        descricao: 'Pretinha aproveitando o dia de sol e recebendo muito amor dos alunos',
        mes: '2024-08',
        dataCriacao: new Date('2024-08-25')
      }
    ];

    this.filteredPhotos = [...this.photos];
    this.extractFilters();
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  extractFilters(): void {
    // Extrair meses únicos
    this.mesesDisponiveis = [...new Set(this.photos.map(p => p.mes))].sort().reverse();
    
    // Extrair nomes de animais únicos
    this.animaisDisponiveis = [...new Set(this.photos.map(p => p.animalNome))].sort();
    
    this.cdr.markForCheck();
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredPhotos = this.photos.filter(photo => {
      const matchAnimal = !filters.animal || photo.animalNome === filters.animal;
      const matchEspecie = !filters.especie || photo.animalEspecie === filters.especie;
      const matchMes = !filters.mes || photo.mes === filters.mes;
      
      return matchAnimal && matchEspecie && matchMes;
    });
    
    this.cdr.markForCheck();
  }

  clearFilters(): void {
    this.filterForm.reset({
      animal: '',
      especie: '',
      mes: ''
    });
  }

  openPhoto(photo: AnimalPhoto): void {
    this.selectedPhoto = photo;
    this.cdr.markForCheck();
  }

  closePhoto(): void {
    this.selectedPhoto = null;
    this.cdr.markForCheck();
  }

  formatMes(mes: string): string {
    const [ano, mesNum] = mes.split('-');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${meses[parseInt(mesNum) - 1]} ${ano}`;
  }
}
