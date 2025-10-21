import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward, UserReward } from '../model/reward.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private apiUrl = `${environment.apiUrl}/rewards`;

  constructor(private http: HttpClient) {}

  // User endpoints
  getUserRewards(): Observable<UserReward[]> {
    return this.http.get<UserReward[]>(`${this.apiUrl}/user`);
  }

  getAvailableRewards(): Observable<UserReward[]> {
    return this.http.get<UserReward[]>(`${this.apiUrl}/user/available`);
  }

  scheduleRewardPickup(userRewardId: string, data: Date, horario: string): Observable<UserReward> {
    return this.http.post<UserReward>(`${this.apiUrl}/user/${userRewardId}/schedule`, {
      data,
      horario
    });
  }

  // Admin endpoints
  getAllRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/all`);
  }

  getCurrentMonthReward(): Observable<Reward | null> {
    return this.http.get<Reward | null>(`${this.apiUrl}/current`);
  }

  createReward(rewardData: FormData): Observable<Reward> {
    return this.http.post<Reward>(`${this.apiUrl}`, rewardData);
  }

  updateReward(id: string, rewardData: FormData): Observable<Reward> {
    return this.http.put<Reward>(`${this.apiUrl}/${id}`, rewardData);
  }

  deleteReward(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getUserRewardsByReward(rewardId: string): Observable<UserReward[]> {
    return this.http.get<UserReward[]>(`${this.apiUrl}/${rewardId}/users`);
  }
}
