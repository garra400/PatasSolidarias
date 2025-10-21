import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, catchError, take, map } from 'rxjs';
import { Animal, AnimalCarousel } from '../model/animal.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/animals`;

  // Mock data
  private mockAnimals: Animal[] = [
    {
      _id: '1',
      nome: 'Tigrão',
      tipo: 'gato',
      descricao: 'Gato listrado muito carinhoso que adora brincar com bolinhas',
      imagemPrincipal: 'https://placekitten.com/400/400',
      idade: '2 anos',
      dataCadastro: new Date('2023-05-15'),
      ativo: true
    },
    {
      _id: '2',
      nome: 'Berenice',
      tipo: 'cachorro',
      descricao: 'Cachorra alegre e brincalhona, muito dócil com crianças',
      imagemPrincipal: 'https://place.dog/400/400',
      idade: '3 anos',
      dataCadastro: new Date('2022-08-20'),
      ativo: true
    },
    {
      _id: '3',
      nome: 'Gata',
      tipo: 'gato',
      descricao: 'Gatinha preta muito elegante e independente',
      imagemPrincipal: 'https://placekitten.com/401/401',
      idade: '1 ano',
      dataCadastro: new Date('2024-01-10'),
      ativo: true
    },
    {
      _id: '4',
      nome: 'Fiapo',
      tipo: 'cachorro',
      descricao: 'Cachorrinho pequeno e fofo que adora colo',
      imagemPrincipal: 'https://place.dog/401/401',
      idade: '5 anos',
      dataCadastro: new Date('2023-11-05'),
      ativo: true
    },
    {
      _id: '5',
      nome: 'Pretinha',
      tipo: 'cachorro',
      descricao: 'Cachorra carinhosa e leal, excelente companheira',
      imagemPrincipal: 'https://place.dog/402/402',
      idade: '4 anos',
      dataCadastro: new Date('2023-03-22'),
      ativo: true
    },
    {
      _id: '6',
      nome: 'Furia',
      tipo: 'gato',
      descricao: 'Gatinha preta com olhos verdes penetrantes',
      imagemPrincipal: 'https://placekitten.com/402/402',
      idade: '2 anos',
      dataCadastro: new Date('2024-02-14'),
      ativo: true
    }
  ];

  constructor(private http: HttpClient) {}

  getAllAnimals(): Observable<Animal[]> {
    if (environment.useMockData) {
      console.log('🐾 Mock: getAllAnimals');
      return of(this.mockAnimals).pipe(delay(500));
    }
    return this.http.get<Animal[]>(`${this.apiUrl}`)
      .pipe(catchError(() => of(this.mockAnimals).pipe(delay(500))));
  }

  getActiveAnimals(): Observable<Animal[]> {
    if (environment.useMockData) {
      console.log('🐾 Mock: getActiveAnimals');
      return of(this.mockAnimals.filter(a => a.ativo)).pipe(delay(500));
    }
    return this.http.get<Animal[]>(`${this.apiUrl}/active`)
      .pipe(catchError(() => of(this.mockAnimals.filter(a => a.ativo)).pipe(delay(500))));
  }

  getAnimalById(id: string): Observable<Animal> {
    if (environment.useMockData) {
      console.log('🐾 Mock: getAnimalById', id);
      const animal = this.mockAnimals.find(a => a._id === id) || this.mockAnimals[0];
      return of(animal).pipe(delay(300));
    }
    return this.http.get<Animal>(`${this.apiUrl}/${id}`)
      .pipe(catchError(() => {
        const animal = this.mockAnimals.find(a => a._id === id) || this.mockAnimals[0];
        return of(animal).pipe(delay(300));
      }));
  }

  getAnimalsForCarousel(): Observable<AnimalCarousel[]> {
    if (environment.useMockData) {
      console.log('🐾 Mock: getAnimalsForCarousel');
      const carousel: AnimalCarousel[] = this.mockAnimals.map(animal => ({
        animal,
        legenda: `${animal.nome} - ${animal.descricao}`
      }));
      return of(carousel).pipe(delay(500));
    }
    
    // Buscar todos os animais e mapear para carousel
    return this.http.get<Animal[]>(this.apiUrl)
      .pipe(
        take(1),
        map((animals: Animal[]) => animals.map((animal: Animal) => ({
          animal,
          legenda: `${animal.nome} - ${animal.descricao}`
        }))),
        catchError((error) => {
          console.error('❌ Erro ao buscar animais para carousel:', error);
          // Fallback para mock
          const carousel: AnimalCarousel[] = this.mockAnimals.map(animal => ({
            animal,
            legenda: `${animal.nome} - ${animal.descricao}`
          }));
          return of(carousel).pipe(delay(500));
        })
      );
  }

  // Admin endpoints
  createAnimal(animalData: FormData): Observable<Animal> {
    if (environment.useMockData) {
      console.log('🐾 Mock: createAnimal');
      const newAnimal: Animal = {
        _id: Date.now().toString(),
        nome: 'Novo Animal',
        tipo: 'gato',
        descricao: 'Descrição do novo animal',
        imagemPrincipal: 'https://placekitten.com/400/400',
        dataCadastro: new Date(),
        ativo: true
      };
      this.mockAnimals.push(newAnimal);
      return of(newAnimal).pipe(delay(500));
    }
    return this.http.post<Animal>(`${this.apiUrl}`, animalData);
  }

  updateAnimal(id: string, animalData: FormData): Observable<Animal> {
    if (environment.useMockData) {
      console.log('🐾 Mock: updateAnimal', id);
      const animal = this.mockAnimals.find(a => a._id === id) || this.mockAnimals[0];
      return of(animal).pipe(delay(500));
    }
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, animalData);
  }

  deleteAnimal(id: string): Observable<{ message: string }> {
    if (environment.useMockData) {
      console.log('🐾 Mock: deleteAnimal', id);
      const index = this.mockAnimals.findIndex(a => a._id === id);
      if (index !== -1) {
        this.mockAnimals.splice(index, 1);
      }
      return of({ message: 'Animal removido com sucesso' }).pipe(delay(500));
    }
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  toggleAnimalStatus(id: string, ativo: boolean): Observable<Animal> {
    if (environment.useMockData) {
      console.log('🐾 Mock: toggleAnimalStatus', id, ativo);
      const animal = this.mockAnimals.find(a => a._id === id);
      if (animal) {
        animal.ativo = ativo;
      }
      return of(animal || this.mockAnimals[0]).pipe(delay(500));
    }
    return this.http.patch<Animal>(`${this.apiUrl}/${id}/status`, { ativo });
  }
}
