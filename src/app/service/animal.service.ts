import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, AnimalCarousel } from '../model/animal.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/animals`;

  constructor(private http: HttpClient) {}

  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}`);
  }

  getActiveAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/active`);
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`);
  }

  getAnimalsForCarousel(): Observable<AnimalCarousel[]> {
    return this.http.get<AnimalCarousel[]>(`${this.apiUrl}/carousel`);
  }

  // Admin endpoints
  createAnimal(animalData: FormData): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}`, animalData);
  }

  updateAnimal(id: string, animalData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, animalData);
  }

  deleteAnimal(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  toggleAnimalStatus(id: string, ativo: boolean): Observable<Animal> {
    return this.http.patch<Animal>(`${this.apiUrl}/${id}/status`, { ativo });
  }
}
