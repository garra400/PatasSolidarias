import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo, UserPhoto } from '../model/photo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) {}

  // User endpoints
  getUserPhotos(): Observable<UserPhoto[]> {
    return this.http.get<UserPhoto[]>(`${this.apiUrl}/user`);
  }

  markPhotoAsViewed(photoId: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${photoId}/viewed`, {});
  }

  // Admin endpoints
  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/all`);
  }

  uploadPhoto(photoData: FormData): Observable<Photo> {
    return this.http.post<Photo>(`${this.apiUrl}`, photoData);
  }

  updatePhoto(id: string, photoData: Partial<Photo>): Observable<Photo> {
    return this.http.put<Photo>(`${this.apiUrl}/${id}`, photoData);
  }

  deletePhoto(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  sendPhotoToUsers(photoId: string, userIds?: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${photoId}/send`, { userIds });
  }

  sendMonthlyPhotos(mes: number, ano: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/send-monthly`, { mes, ano });
  }
}
