import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData);
  }

  updatePassword(senhaAtual: string, novaSenha: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/password`, {
      senhaAtual,
      novaSenha
    });
  }

  // Atualizar foto de perfil
  atualizarFotoPerfil(foto: File): Observable<{ message: string; fotoPerfilUrl: string }> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.put<{ message: string; fotoPerfilUrl: string }>(`${this.apiUrl}/foto-perfil`, formData);
  }

  // Remover foto de perfil
  removerFotoPerfil(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/foto-perfil`);
  }

  cancelarAssinatura(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/cancelar-assinatura`, {});
  }

  // Admin endpoints
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  getDoadores(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/doadores`);
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/role`, { role });
  }
}
